import { Service } from "typedi";
import DefinitionRepository from "repository/DefinitionRepository";
import { BadRequestError } from "routing-controllers";
import { DefinitionUpdatingDto } from "dto/DefinitionDto";
import Definition from "models/Definition";
import sequelize from "models";
import { ExampleType } from "dto/WordDto";
import Example from "models/Example";

@Service()
export default class DefinitionService {
    constructor(
        private definitionRepository: DefinitionRepository,
    ){}

    public async getDefinitionById(id: number) {
       const definition = await this.definitionRepository.findWithExamplesById(id);
       if (!definition) throw new BadRequestError('Định nghĩa không tồn tại');
       return definition;
    }

    public async updateDefinition(id: number, newDefinition: DefinitionUpdatingDto) {
        const definition = await this.getDefinitionById(id);
         
        var transaction;
        try {
            transaction = await sequelize.transaction();
            await definition.update({
                mean: newDefinition.mean,
            }, {transaction});

            Promise.all(
                newDefinition.examples.map(async (example: ExampleType) => {
                    const existingExample = await Example.findOne({
                        where: {
                            id: example.id ? example.id : null,
                            definitionId: definition.id,
                        },
                        transaction,
                    });
                    if (existingExample) {
                        await existingExample.update({
                            sentence: example.sentence,
                            mean: example.mean,
                        }, {transaction});
                    } else {
                        await Example.create({
                            sentence: example.sentence,
                            mean: example.mean,
                            definitionId: definition.id,
                        }, {transaction});
                    }
                }),
            ).then(() => {
                transaction.commit();
                console.log("horray")
            }).catch((err) => {
                console.log(err.message)
                throw new BadRequestError("Đã có lỗi xảy ra");
            })
        }catch(err) {
            if (transaction) await transaction.rollback();
        }
    }

    public async deleteDefinitionById(id: number) {
        const definition = await this.getDefinitionById(id);
        await definition.destroy()
    }
}