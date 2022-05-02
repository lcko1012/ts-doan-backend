import { Service } from "typedi";
import Definition from "../models/Definition";
import Example from "../models/Example";
import Meaning from "../models/Meaning";
import Word from "../models/Word";

@Service()
export default class ExampleRepository {
    public async getExamples(defId:number) {
        return await Example.findAll({
            where: {
                definitionId: defId
            }
        });
    }

    public async findExample(id: number) {
        return await Example.findByPk(id);
    }

    public async findExampleWithAssociation(exampleId: number, definitionId: number,
                                            meaningId: number, wordId: number){
        return await Example.findOne({
            where: {id: exampleId},
            include: [{
                model: Definition,
                where: {id: definitionId},
                include: [{
                    model: Meaning,
                    where: {id: meaningId},
                    include: [{
                        model: Word,
                        where: {id: wordId}
                    }]
                }]
            }]
        })
    }
}