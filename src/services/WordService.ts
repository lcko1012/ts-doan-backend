import { Service } from "typedi";
import fs from "fs";
import Word from "../models/Word";
import WordRepository from "../repository/WordRepository";
import PageRequest from "../dto/PageDto";
import { CreateWordDto, UpdateWordDto, } from "../dto/WordDto";
import { BadRequestError, NotFoundError } from "routing-controllers";
import sequelize from "../models";
import { Model, Op } from "sequelize";
import Example from "../models/Example";
import Kind from "../models/Kind";
import Meaning from "../models/Meaning";
import Idiom from "../models/Idiom";
import WordKind from "../models/WordKind";
import IUserCredential from "interfaces/IUserCredential";
import Course from "../models/Course";
import Lesson from "../models/Lesson";
import LessonService from "./LessonService";
import UserCourse from "../models/UserCourse";
import LessonWord from "../models/LessonWord";
import FolderWord from "../models/FolderWord";
import Folder from "../models/Folder";
import { KindType } from "../interfaces/Word";

@Service()
export default class WordService {
    constructor(
        private wordRepository: WordRepository,
        private lessonService: LessonService
    ) { }

    public async createDictionary() {
        for (var stt = 154; stt <= 156; stt++){
        fs.readFile(__dirname + `../../dictionary/dict_${stt}.json`, 'utf-8', async (err, data) => {
            if (err) {
                console.log(err)
                throw new BadRequestError("Đã có lỗi xảy ra")
            }
            else {
                const databases = JSON.parse(data)
                try {
                    await sequelize.transaction(async transaction => {
                        for (const item of databases) {
                            const existedWord = await Word.findOne({
                                where: {
                                    vocab: item.vocab,
                                    isDict: true
                                }
                            })
                            if (existedWord) continue

                            const word = await Word.create({
                                vocab: item.vocab,
                                phonetic: item.phonetic,
                                isDict: true,
                            }, { transaction })

                            try {
                                for (const kind of item.kinds) {
                                    kind.idioms.map(idiom => {
                                        idiom.mean = JSON.stringify(idiom.mean)
                                    })

                                    const existedKind = await Kind.findOrCreate({
                                        where: { name: kind.name },
                                        defaults: { name: kind.name },
                                    })

                                    await WordKind.create({
                                        wordId: word.id,
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
                            } catch (e) {
                                transaction.rollback()
                                console.log(e)
                                throw new BadRequestError("error")
                            }
                        }
                    })
                } catch (err) {
                    // if (transaction) await transaction.rollback()
                    throw new BadRequestError("Đã có lỗi xảy ra")
                    console.log(err)
                }

            }
        })
        }
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
        const word = await this.wordRepository.getById(id);
        if (!word) throw new NotFoundError("Từ vựng không tồn tại");

        return word;
    }

    public async createWordDict(newWord: CreateWordDto) {
        const { vocab, phonetic, meaning, kindId } = newWord;
        var word = await this.wordRepository.getByVocab(vocab, null);
        if (word) throw new BadRequestError("Từ vựng đã tồn tại");

        return await this.wordRepository.createWord({ vocab, phonetic, meaning, kindId }, true)
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
        const existedWord = await LessonWord.findOne({
            where: { lessonId: lesson.id },
            include: [{
                model: Word,
                attributes: [],
                where: { vocab },
            }]
        })
        if (existedWord) throw new BadRequestError(`Từ vựng ${vocab} đã tồn tại trong bài học này`)

        const word = await this.wordRepository.createWord({ vocab, phonetic, meaning, kindId }, false)

        await LessonWord.create({
            lessonId: lesson.id,
            wordId: word.id
        })

        return word;

    }

    public async addExistedWordToLesson(
        lessonId: number, courseId: number,
        wordId: number, user: IUserCredential
    ) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        //Find word by id
        const word = await Word.scope(['do_not_get_time']).findOne({
            where: { id: wordId },
        })
        if (!word) throw new NotFoundError('Từ vựng không tồn tại')

        //Check if word vocab is existed in lesson
        const existedWord = await LessonWord.findOne({
            where: { wordId: word.id, lessonId: lesson.id },
        })
        //If existed throw error
        if (existedWord) throw new BadRequestError('Từ vựng đã tồn tại trong bài học này')
        //Add word to lesson
        await LessonWord.create({
            lessonId: lesson.id,
            wordId: word.id
        })
    }

    public async getWordInLesson(lessonId: number, courseId: number, wordId: number, user: IUserCredential) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)
        const word = this.wordRepository.getById(wordId)
        return word
    }

    public async updateWordInLessonByTeacher(
        lessonId: number, courseId: number,
        wordId: number, newWord: UpdateWordDto,
        user: IUserCredential) {
        // check if lesson is existed
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        // check if word is existed in lesson
        await this.checkExistedLessonWord(lesson.id, wordId)

        const existedWord = await LessonWord.findAll({
            where: {
                wordId: { [Op.ne]: wordId },
                lessonId: lesson.id
            },
            include: [{
                model: Word,
                where: {
                    vocab: newWord.vocab,
                }
            }]
        })

        console.log(existedWord)
        if (existedWord.length > 0) throw new BadRequestError("Từ vựng đã tồn tại trong bài học");
        // update thui

        await Word.update({
            vocab: newWord.vocab,
            phonetic: newWord.phonetic,
            audios: newWord.audios,
            imageLink: newWord.imageLink
        }, { where: { id: wordId } })
    }

    public async deleteWordInLessonByTeacher(lessonId: number, courseId: number, wordId: number, user: IUserCredential) {
        const lesson = await this.lessonService.getLessonInCourseById(lessonId, courseId, user)

        const word = await LessonWord.findOne({
            where: { wordId, lessonId: lesson.id }
        })
        if (!word) throw new NotFoundError('Từ vựng không tồn tại trong bài học')

        await word.destroy()
    }

    public async getWordsOfLessonByStudent(lessonId: number, user: IUserCredential) {
        //1. check if lesson is existed
        const lesson = await Lesson.findOne({
            where: { id: lessonId },
            include: [{
                model: Course,
                where: { isPublic: true },
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
            include: [{
                model: WordKind,
                include: [
                    { model: Kind },
                    { model: Meaning, include: [{ model: Example }] },
                    { model: Idiom }
                ]
            }, {
                model: Lesson,
                where: { id: lesson.id },
                attributes: []
            }]
        })

        return words
    }

    async addExistedWordToFolder(folderId: number, wordId: number, user: IUserCredential) {
        const word = await Word.findOne({
            where: { id: wordId }
        })

        if (!word) throw new BadRequestError('Từ vựng không tồn tại')

        const folder = await Folder.findOne({
            where: { id: folderId, userId: user.id }
        })

        if (!folder) throw new BadRequestError('Thư mục không tồn tại')

        const folderWord = await FolderWord.findOne({
            where: { wordId, folderId }
        })

        if (folderWord) throw new BadRequestError('Từ vựng này đã tồn tại trong thư mục')

        await FolderWord.create({
            wordId, folderId
        })
    }

    async deleteWordInFolder(wordId: number, folderId: number, user: IUserCredential) {
        const folderWord = await FolderWord.findOne({
            where: { wordId, folderId },
            include: [{
                model: Folder,
                where: { userId: user.id }
            }]
        })
        if (!folderWord) throw new BadRequestError('Không tồn tại từ vựng hoặc thư mục')

        await FolderWord.destroy({
            where: { wordId, folderId }
        })
    }

    private async checkExistedLessonWord(lessonId: number, wordId: number) {
        const lessonWord = await LessonWord.findOne({
            where: { lessonId, wordId }
        })

        if (!lessonWord) throw new BadRequestError('Từ vựng không tồn tại trong bài học')
    }
}