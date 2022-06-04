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
import { KindType } from "interfaces/Word";
import WordKind from "models/WordKind";
import IUserCredential from "interfaces/IUserCredential";
import Course from "models/Course";
import Lesson from "models/Lesson";

@Service()
export default class WordService {
    constructor(
        private wordRepository: WordRepository,
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
        var result = await this.wordRepository.getByVocab(vocab);
        if (!result) throw new NotFoundError("Từ vựng không tồn tại");
        return result
    }

    public async getById(id: number) {
        const word = await this.wordRepository.findById(id);
        if (!word) throw new NotFoundError("Từ vựng không tồn tại");

        return word;
    }

    public async createWordDict(newWord: CreateWordDto) {
        const { vocab, phonetic, meaning, kindId } = newWord;
        var word = await this.wordRepository.getByVocab(vocab);
        if (word) throw new BadRequestError("Từ vựng đã tồn tại");

        return await this.wordRepository.createWord({vocab, phonetic, meaning, kindId}, null)
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
        lessonSlug: string, courseSlug: string,
        user: IUserCredential, pageRequest: PageRequest) {
        const lesson = await Lesson.findOne({
            where: { slug: lessonSlug },
            include: [{
                model: Course,
                where: { slug: courseSlug, teacherId: user.id }
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
        lessonSlug: string, courseSlug: string,
        newWord: CreateWordDto, user: IUserCredential) 
    {
        const lesson = await Lesson.findOne({
            where: {slug: lessonSlug},
            include: [{model: Course, where: {slug: courseSlug, teacherId: user.id}}]
        })

        if (!lesson) throw new NotFoundError('Bài học không tồn tại')
        
        const { vocab, phonetic, meaning, kindId } = newWord;
        const existedWord = await Word.findOne({
            where: {vocab, lessonId: lesson.id},
        })
        if (existedWord) throw new BadRequestError('Từ vựng đã tồn tại trong bài học này')

        return await this.wordRepository.createWord({vocab, phonetic, meaning, kindId}, 
                                                    lesson.id)
    }
}