import Example from "models/Example";
import { Service } from "typedi";
import Definition from "../models/Definition";
import Meaning from "../models/Meaning";
import Word from "../models/Word";

@Service()
export default class DefinitionRepository {
    public async findDefinition(definitionId: number, meaningId: number, wordId: number){
            return await Definition.findOne({
                where: {
                    id: definitionId
                },
                include: [{
                    model: Meaning,
                    where: {id: meaningId},
                    include:[{
                        model: Word,
                        where: {id: wordId}
                    }]
                }]
            })
        }

    public async findWithExamplesById(id: number) {
        return await Definition.findOne({
            where: {id},
            include: [{
                model: Example
            }]
        })
    }
}