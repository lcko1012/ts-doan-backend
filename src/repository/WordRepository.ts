
import Word from "../models/Word";
import { Service } from "typedi";
import { Op } from "sequelize";
import sequelize from "../models/index";
import Meaning from "../models/Meaning";
import Definition from "../models/Definition";
import Extra from "models/Extra";
import Example from "models/Example";

@Service()
export default class WordRepository {
    public async searchWord(word: string) {
        return await Word
            .scope('is_dict').scope('do_not_get_time')
            .findAll({
                where: {
                    vocab: {
                        [Op.like]: `${word}%`
                    }
                },
                limit: 10,
                include: [
                    {
                        model: Meaning.scope('do_not_get_time'),
                        include: [{ model: Definition.scope('do_not_get_time') }]
                    },
                ],
            })
    }

    public async findById(id: number) {
        return await Word.scope('is_dict')
        .findByPk(id);
    }

    public async getAllWords(page: number, size: number,
        keywordCondition: any, phoneticCondition: any, meaningCondition: any) {
        return await Word.findAndCountAll({
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
                    model: Meaning.scope('do_not_get_time'),
                    include: [
                        {
                            model: Definition.scope('do_not_get_time'),
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


    public async getByVocab(vocab: string) {
        return await Word.scope('is_dict').findOne({
            where: {
                vocab: vocab
            },
            include: [
                {
                    model: Meaning, 
                    include: [
                        {
                            model: Definition, include: [{model: Example}]
                    }, {model: Extra}]
                }
            ]
        })
    }
}