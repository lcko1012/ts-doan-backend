
import Word from "../models/Word";
import { Service } from "typedi";
import { Op } from "sequelize";
import sequelize from "../models/index";
import Meaning from "../models/Meaning";
import Idiom from "models/Idiom";
import Example from "models/Example";
import Kind from "../models/Kind";
import WordKind from "models/WordKind";

@Service()
export default class WordRepository {
    public async searchWord(word: string) {
        return await Word
            .scope(['is_dict', 'do_not_get_time'])
            .findAll({
                where: {
                    vocab: {
                        [Op.like]: `${word}%`
                    }
                },
                
                limit: 10,
                include: [
                    {
                        model: WordKind.scope('do_not_get_time'),
                        
                        include: [{
                            model: Kind,
                            attributes: ['name'],
                        }, {
                            model: Meaning,
                            attributes: ['name'],
                        }]
                    },
                ],
            })
    }

    public async findById(id: number) {
        return await Word.scope('is_dict').findOne({
            where:{id}
        })
    }

    public async getAllWords(page: number, size: number,
        keywordCondition: any, phoneticCondition: any, meaningCondition: any) {
        return await Word.scope(['is_dict', 'do_not_get_time']).findAndCountAll({
            offset: page * size,
            limit: size,
            where: {
                [Op.and]: [
                    keywordCondition,
                    phoneticCondition,
                ]
            },
            include: [
                {
                    model: WordKind.scope('do_not_get_time'),
                    include: [
                        {
                            model: Meaning,
                            attributes: ['name'],
                            where: meaningCondition
                        }
                    ]
                }
            ]
        })
    }

    public async getCount() {
        return await Word.count();
    }


    public async getByVocab(vocab: string, lessonId: number | null) {
        return await Word.findOne({
            where: {
                vocab,
                lessonId
            },
            include: [
                {
                    model: WordKind.scope('do_not_get_time'), 
                    include: [
                        {model: Kind.scope('do_not_get_time')},
                        {model: Meaning, include: [{model: Example}]}, 
                        {model: Idiom}]
                }
            ]
        })
    }

    public async getById(id: number, lessonId: number | null) {
        return await Word.findOne({
            where: {
                id,
                lessonId
            },
            include: [
                {
                    model: WordKind.scope('do_not_get_time'), 
                    include: [
                        {model: Kind.scope('do_not_get_time')},
                        {model: Meaning, include: [{model: Example}]}, 
                        {model: Idiom}]
                }
            ]
        })
    }

    public async getAllWordByLesson(
        lessonId: number, page: number, size: number,
        keywordCondition: any, phoneticCondition: any, meaningCondition: any) 
    {
        return await Word.findAndCountAll({
            offset: page * size,
            limit: size,
            where: {
                [Op.and]: [
                    keywordCondition,
                    phoneticCondition,
                    
                ],
                lessonId: lessonId
            },
            include: [
                {
                    model: WordKind.scope('do_not_get_time'),
                    include: [
                        {
                            model: Meaning,
                            attributes: ['name'],
                            where: meaningCondition
                        }
                    ]
                }
            ]
        })
    }

    public async createWord({vocab, phonetic, meaning, kindId}: {
        vocab: string, phonetic: string, meaning: string, kindId: number}, 
        lessonId: number | null) 
    {
        return await Word.create({
            vocab: vocab,
            phonetic: phonetic,
            wordKinds: [{
                kindId: kindId,
                meanings: [{
                    name: meaning,
                }]
            }],
            lessonId
        }, {
            include: [{
                model: WordKind,
                include: [{
                    model: Meaning,
                }]
            }]
        });
    }
}