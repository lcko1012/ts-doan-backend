import { BadRequestError, NotFoundError } from "routing-controllers";
import { Service } from "typedi";
import ExampleRepository from "../repository/ExampleRepository";


@Service()
export default class ExampleService {
    constructor(
        private exampleRepository: ExampleRepository,
    ) { }

    public getExamples = async (defId: number) => {
        return await this.exampleRepository.getExamples(defId);
    }

    public deleteExample = async (id: number) => {
        const example = await this.exampleRepository.findExample(id);

        if (!example) throw new NotFoundError('Example not found');

        return await example.destroy();
    }
}