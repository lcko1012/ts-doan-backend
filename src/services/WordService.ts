import { Service } from "typedi";
import fs from "fs";
import Word from "models/Word";
import WordRepository from "../repository/WordRepository";
import PageRequest from "dto/PageDto";
import { CreateWordDto, UpdateWordDto, } from "../dto/WordDto";
import { BadRequestError, NotFoundError } from "routing-controllers";
import sequelize from "../models";
import { Model, Op } from "sequelize";
import Example from "models/Example";
import Kind from "models/Kind";
import Meaning from "models/Meaning";
import Idiom from "models/Idiom";
import WordKind from "models/WordKind";
import IUserCredential from "interfaces/IUserCredential";
import Course from "models/Course";
import Lesson from "models/Lesson";
import LessonService from "./LessonService";
import UserCourse from "models/UserCourse";

@Service()
export default class WordService {
    constructor(
        private wordRepository: WordRepository,
        private lessonService: LessonService
    ) { }

    public async createDictionary() {
        fs.readFile(__dirname + '../../dictionary/dict_0.json', 'utf-8', async (err, data) => {
            if (err) {
                console.log(err)
                throw new BadRequestError("Đã có lỗi xảy ra")
            }
            else {
                const databases = JSON.parse(data)
                try {
                    await sequelize.transaction(async transaction => {
                        for (const item of databases) {
                            const word = await Word.findOrCreate({
                                where: {
                                    vocab: item.vocab,
                                },
                                defaults: { phonetic: item.phonetic },
                                transaction
                            })

                            for (const kind of item.kinds) {
                                kind.idioms.map(idiom => {
                                    idiom.mean = JSON.stringify(idiom.mean)
                                })

                                const existedKind = await Kind.findOrCreate({
                                    where: { name: kind.name },
                                    defaults: { name: kind.name },
                                })

                                await WordKind.create({
                                    wordId: word[0].id,
                                    kindId: existedKind[0].id,
                                    meanings: kind.meanings,
                                    idioms: kind.idioms,

                                }, {
                                    include: [{
                                        model: Meaning,
                                        include: [{ model: Example }]
                                    }, {
                                        model: Idiom,
                                    }],
                                    transaction
                                })
                            }
                        }
                    })

                } catch (err) {
                    // if (transaction) await transaction.rollback()
                    throw new BadRequestError("Đã có lỗi xảy ra")
                }
            }
        })
    }

    public async searchWord(word: string) {
        var list = await this.wordRepository.searchWord(word);
        return list
    }

    public async getAllWords(pageRequest: PageRequest) {
        const { page, size, keyword, phonetic, meaning } = pageRequest;

        var keywordCondition = keyword ? { vocab: { [Op.like]: `${keyword}%` } } : {};
        var phoneticCondition = phonetic ? { phonetic: { [Op.like]: `%${phonetic}%` } } : {};
        var meaningCondition = meaning ? { name: { [Op.like]: `%${meaning}%` } } : {};

        const result = await this.wordRepository.getAllWords(page, size,
            keywordCondition, phoneticCondition, meaningCondition
        );

        const list = result.rows

        return {
            list,
            count: result.count
        }
    }

    public async getWordByVocab(vocab: string) {
        var result = await this.wordRepository.getByVocab(vocab, null);
        if (!result) throw new NotFoundError("Từ vựng không tồn tại");
        return result
    }

    public async getById(id: number) {
        const word = await this.wordRepository.getById(id, null);
        if (!word) throw new NotFoundError("Từ vựng không tồn tại");

        return word;
    }

    public async createWordDict(newWord: CreateWordDto) {
        const { vocab, phonetic, meaning, kindId } = newWord;
        var word = await this.wordRepository.getByVocab(vocab, null);
        if (word) throw new BadRequestError("Từ vựng đã tồn tại");

        return await this.wordRepository.createWord({ vocab, phonetic, meaning, kindId }, null)
    }

    public async updateWord(id: number, newWord: UpdateWordDto) {
        const word = await Word.findOne({
            where: { id }
        })

        if (!word) throw new BadRequestError("Từ vựng không tồn tại");

        const existedWord = await Word.findAll({
            where: {
                id: {
                    [Op.ne]: id
                },
                vocab: newWord.vocab,
            }
        })

        if (existedWord.length > 0) throw new BadRequestError("Từ vựng đã tồn tại");

        await Word.update({
            vocab: newWord.vocab,
            phonetic: newWord.phonetic,
            audios: newWord.audios,
            imageLink: newWord.imageLink
        }, { where: { id } })
    }

    public async deleteWord(id: number) {
        const word = await this.getById(id)
        await word.destroy();
    }

    public async getWordsByLesson(
        lessonId: number, courseId: number,
        user: IUserCredential, pageRequest: PageRequest) {
        const lesson = await Lesson.findOne({
            where: { id: lessonId },
            include: [{
                model: Course,
                where: { id: courseId, teacherId: user.id }
            }]
        })

        if (!lesson) throw new NotFoundError("Bài học không tồn tại")

        const { page, size, keyword, phonetic, meaning } = pageRequest;
        var keywordCondition = keyword ? { vocab: { [Op.like]: `${keyword}%` } } : {};
        var phoneticCondition = phonetic ? { phonetic: { [Op.like]: `%${phonetic}%` } } : {};
        var meaningCondition = meaning ? { name: { [Op.like]: `%${meaning}%` } } : {};

        const result = await this.wordRepository.getAllWordByLesson(lesson.id, page, size,
            keywordCondition, phoneticCondition, meaningCondition)

        const list = result.rows
        return {
            list,
            count: result.count
        }
    }


    public async createWordLessonByTeacher(
        lessonId: number, courseId: number,
        newWord: CreateWordDto, user: IUserCredential) {
        const lesson = await Lesson.findOne({
            where: { id: lessonId },
            include: [{ model: Course, where: { id: courseId, teacherId: user.id } }]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại')

        const { vocab, phonetic, meaning, kindId } = newWord;
        const existedWord = await Word.findOne({
            where: { vocab, lessonId: lesson.id },
        })
        if (existedWord) throw new BadRequestError('Từ vựng đã tồn tại trong bài học này')

        return await this.wordRepository.createWord({ vocab, phonetic, meaning, kindId },
            lesson.id)
    }

    public async addExistedWordToLesson(
        lessonId: number, courseId: number,
        wordId: number, user: IUserCredential
    ) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        //Find word by id
        const word = await Word.scope(['is_dict', 'do_not_get_time']).findOne({
            where: { id: wordId },
            include: [
                {
                    model: WordKind.scope('do_not_get_time'),
                    attributes: { exclude: ['id', 'wordId', 'kindId'] },
                    include: [
                        {
                            model: Kind.scope('do_not_get_time'),
                            attributes: ['id'],

                        },
                        {
                            model: Meaning.scope('do_not_get_time'),
                            attributes: { exclude: ['id', 'wordKindId'] },
                            include: [{
                                model: Example.scope('do_not_get_time'),
                                attributes: { exclude: ['id', 'meaningId'] }
                            }]
                        },
                        {
                            model: Idiom.scope('do_not_get_time'),
                            attributes: { exclude: ['id', 'wordKindId'] },
                        }
                    ]
                }
            ]
        })
        if (!word) throw new NotFoundError('Từ vựng không tồn tại')

        //Check if word vocab is existed in lesson
        const existedWord = await Word.findOne({
            where: { vocab: word.vocab, lessonId: lesson.id },
        })
        //If existed throw error
        if (existedWord) throw new BadRequestError('Từ vựng đã tồn tại trong bài học này')
        //Add word to lesson
        try {
            await sequelize.transaction(async transaction => {
                const newWord = await Word.create({
                    vocab: word.vocab,
                    phonetic: word.phonetic,
                    audios: word.audios,
                    imageLink: word.imageLink,
                    lessonId: lesson.id,
                }, { transaction })

                for (const wordKind of word.wordKinds) {
                    const newhaha = await WordKind.create({
                        wordId: newWord.id,
                        kindId: wordKind.kind.id,
                        meanings: wordKind.meanings,
                        idiom: wordKind.idioms,
                    }, {
                        include: [{
                            model: Meaning,
                            include: [{ model: Example }]
                        }, {
                            model: Idiom,
                        }],
                        transaction
                    })
                    console.log(newhaha)
                }
            })

            const result = await this.wordRepository.getByVocab(word.vocab, lesson.id)
            return result
        } catch (err) {
            console.log(err)
            throw new BadRequestError('Đã có lỗi xảy ra')
        }

    }

    public async getWordInLesson(lessonId: number, courseId: number, wordId: number, user: IUserCredential) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)
        const word = this.wordRepository.getById(wordId, lesson.id)
        return word
    }

    public async updateWordInLessonByTeacher(
        lessonId: number, courseId: number,
        wordId: number, newWord: UpdateWordDto,
        user: IUserCredential) {
        // check if lesson is existed
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        // check if word is existed in lesson
        const word = await Word.findOne({
            where: { id: wordId, lessonId: lesson.id }
        })
        if (!word) throw new NotFoundError('Từ vựng không tồn tại trong bài học')

        const existedWord = await Word.findAll({
            where: {
                id: { [Op.ne]: wordId },
                vocab: newWord.vocab,
                lessonId: lesson.id
            }
        })
        console.log(existedWord)
        if (existedWord.length > 0) throw new BadRequestError("Từ vựng đã tồn tại");
        // update thui

        await Word.update({
            vocab: newWord.vocab,
            phonetic: newWord.phonetic,
            audios: newWord.audios,
            imageLink: newWord.imageLink
        }, { where: { id: wordId, lessonId: lesson.id } })
    }

    public async deleteWordInLessonByTeacher(lessonId: number, courseId: number, wordId: number, user: IUserCredential) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        const word = await Word.findOne({
            where: { id: wordId, lessonId: lesson.id }
        })
        if (!word) throw new NotFoundError('Từ vựng không tồn tại trong bài học')

        await Word.destroy({ where: { id: wordId, lessonId: lesson.id } })
    }

    public async getWordsOfLessonByStudent(lessonId: number, user: IUserCredential) {
        //1. check if lesson is existed
        const lesson = await Lesson.findOne({
            where: { id: lessonId },
            include: [{
                model: Course,
                where: {isPublic: true},
            }]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại')
        //2. check if user is student
        const userId = user.id
        const enrolled = await UserCourse.findOne({
            where: {
                userId,
                courseId: lesson.courseId
            }
        })

        if (!enrolled) throw new BadRequestError('Bạn chưa đăng ký khóa học này')

        //3. get words of lesson
        const words = await Word.findAll({
            where: { lessonId: lesson.id },
            include: [{
                model: WordKind,
                include: [
                    {model: Kind},
                    {model: Meaning, include: [{model: Example}]},
                    {model: Idiom}
                ]
            }]
        })

        return words
    }
}