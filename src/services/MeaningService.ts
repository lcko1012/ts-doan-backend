import { MeaningUpdateDto } from "../dto/MeaningDto";
import { ExampleType } from "../dto/WordDto";
import sequelize from "../models";
import Example from "../models/Example";
import Meaning from "../models/Meaning";
import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export default class MeaningService {
    constructor(){}
    public async getMeaningWithExamples(id: number) { 
        const meaning = await Meaning.scope('with_examples').findOne({
            where: {id}
        })
        if(!meaning) throw new BadRequestError("Định nghĩa không tồn tại")
        return meaning;
    }

    public async createMeaning(newMeaning: MeaningUpdateDto) {
        console.log(newMeaning)
        var transaction;
        try{
            transaction = await sequelize.transaction();
            const meaning = await Meaning.create({
                name: newMeaning.name,
                wordKindId: newMeaning.wordKindId,
            }, {transaction});

            Promise.all(
                newMeaning.examples?.map(async (example: ExampleType ) => {
                    await Example.create({
                        sentence: example.sentence,
                        meaningId: meaning.id
                    }, {transaction})
                }
            )).then(() => {
                transaction.commit();
                console.log("horray")
            }).catch(err => {
                console.log(err.message)
                throw new BadRequestError("Đã có lỗi xảy ra");
            })
        }catch(err) {
            if(transaction) await transaction.rollback();
        }
    }

    public async updateMeaning(id: number, newMeaning: MeaningUpdateDto) {
        const meaning = await this.getMeaningWithExamples(id);

        var transaction;
        try {
            transaction = await sequelize.transaction();
            await meaning.update({
                name: newMeaning.name,
            },{transaction});

            Promise.all(
                newMeaning.examples?.map(async (example: ExampleType ) => {
                    const existedExample = await Example.findOne({
                        where: {
                            id: example.id ? example.id : null,
                            meaningId: meaning.id,
                        },
                        transaction
                    });

                    if (existedExample) {
                        await existedExample.update({
                            sentence: example.sentence,
                            mean: example.mean,
                        }, {transaction})
                    }
                    else {
                        await Example.create({
                            sentence: example.sentence,
                            mean: example.mean,
                            meaningId: meaning.id,
                        })
                    }
                })
            ).then(() => {
                transaction.commit();
                console.log("horray")
            }).catch(err => {
                console.log(err.message)
                throw new BadRequestError("Đã có lỗi xảy ra");
            })
        }catch(err) {
            if (transaction) await transaction.rollback();
        }
    }

    public async deleteMeaningById(id: number) {
        const meaning = await this.getMeaningWithExamples(id);
        await meaning.destroy();
    }
}