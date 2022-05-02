import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import { ExampleRequest } from "../dto/ExampleDto";
import Example from "../models/Example";
import DefinitionRepository from "../repository/DefinitionRepository";
import ExampleRepository from "../repository/ExampleRepository";


@Service()
export default class ExampleService {
    constructor(
        private exampleRepository: ExampleRepository,
        private definitionRepository: DefinitionRepository,
    ) { }

    public getExamples = async (defId: number) => {
        return await this.exampleRepository.getExamples(defId);
    }

    public createExample = async (exampleRequest: ExampleRequest) => {
        const { definitionId, meaningId, wordId, example } = exampleRequest;
        const definition = await this.definitionRepository.findDefinition(definitionId, meaningId, wordId);

        if (!definition) throw new NotFoundError('Definition not found');

        const newExample = await Example.create({
            sentence: example.sentence,
            mean: example.mean,
            definitionId: definition.id
        })

        return newExample
    }

    public updateExample = async (id: number, exampleRequest: ExampleRequest) => {
        const { definitionId, meaningId, wordId, example } = exampleRequest;
        const existedExample = await this.exampleRepository
                                    .findExampleWithAssociation(id,
                                        definitionId, meaningId, wordId);
        
        if (!existedExample) throw new NotFoundError('Không tìm thấy ví dụ');

        existedExample.sentence = example.sentence;
        existedExample.mean = example.mean;
        await existedExample.save();
    }

    public deleteExample = async (id: number) => {
        const example = await this.exampleRepository.findExample(id);

        if (!example) throw new NotFoundError('Example not found');

        return await example.destroy();
    }
}