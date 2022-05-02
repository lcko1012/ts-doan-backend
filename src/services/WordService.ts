import { Service } from "typedi";
import fs from "fs";
import Word from "models/Word";
import WordRepository from "../repository/WordRepository";
import PageRequest from "dto/PageDto";
import { UpdateWordDto, MeaningType, ExampleRequest, ExampleClass } from "../dto/WordDto";
import { BadRequestError, NotFoundError } from "routing-controllers";
import sequelize from "../models";
import { Model, Op } from "sequelize";
import Meaning from "models/Meaning";
import Definition from "models/Definition";
import Extra from "models/Extra";
import Example from "models/Example";


@Service()
export default class WordService {
    constructor(
        private wordRepository: WordRepository,
    ) { }

    public async createDictionary() {
        fs.readFile(__dirname + '../../dictionary/dict_0.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err)
                throw new BadRequestError("Đã có lỗi xảy ra")
            }
            else {
                const databases = JSON.parse(data)

                const promises = []

                sequelize.transaction(transaction => {
                    databases.map(item => {
                        // var newPromise = Word.findOrCreate({
                        //     where: {vocab: item.vocab},
                        //     defaults: {
                        //         phonetic: item.phonetic,
                        //     },
                        //     transaction: transaction                            
                        // })
                        // console.log(item.meaning)

                        //change mean of extras of meaning to string
                        item.meaning.map(meaning => {
                            meaning.extras.map(extra => {
                                extra.mean = JSON.stringify(extra.mean)
                            })
                        })

                        var newPromise = Word.findOrCreate({
                            where: {vocab: item.vocab},
                            defaults: {
                                phonetic: item.phonetic,
                                meanings: item.meaning,
                            },
                        
                            transaction: transaction,
                            include: [
                                {
                                    model: Meaning,
                                    include: [
                                        {
                                            model: Definition,
                                            include: [
                                                {
                                                    model: Example
                                                }
                                            ]
                                        },
                                        {
                                            model: Extra
                                        },
                                    ]
                                }
                            ],

                        })   
                        promises.push(newPromise)
                    })
                    return Promise.all(promises).then(() => {
                        console.log("done")
                    }).catch(err => {
                        console.log(err)
                        throw new BadRequestError("Đã có lỗi xảy ra")
                    })
                })
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
        var meaningCondition = meaning ? { mean: { [Op.like]: `%${meaning}%` } } : {};

        const result = await this.wordRepository.getAllWords(page, size,
            keywordCondition, phoneticCondition, meaningCondition
        );

        const list = result.rows
        // this.handleMeaning(list)

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
        if (!word) throw new NotFoundError("Word not found");

        return word;
    }

    public async updateWord(id: number, newWord: UpdateWordDto) {
        const word = await this.getById(id)

        word.vocab = newWord.vocab;
        word.phonetic = newWord.phonetic;
        // word.meaning = newWord.meaning;
        word.audios = newWord.audios;

        const editedWord = (await word.save()).get({plain: true})
        editedWord.meaning = editedWord.meaning ? JSON.parse(editedWord.meaning) : editedWord.meaning;
        return editedWord;
    }

    public async deleteWord(id: number) {
        const word = await this.getById(id)
        await word.destroy();
    }
}