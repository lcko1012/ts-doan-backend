import { StatusCodes } from "http-status-codes";
import { Get, HttpCode, JsonController } from "routing-controllers";
import WordService from "../services/WordService";
import { Service } from "typedi";

@JsonController('/word')
@Service()
export default class WordController {
    constructor(
        readonly wordService: WordService,
    ){}

    @Get('/createDictionary')
    @HttpCode(StatusCodes.OK)
    async createDictionary() {
        await this.wordService.createDictionary();
        return {
            message: "Create dictionary successfully"
        }
    }
}