import { StatusCodes } from "http-status-codes";
import { Authorized, BadRequestError, Body, Delete, Get, HttpCode, JsonController, Param, Patch, Put, QueryParam, QueryParams, Res } from "routing-controllers";
import WordService from "../services/WordService";
import { Service } from "typedi";
import Role from "../models/Role";
import PageRequest from "../dto/PageDto";
import { ExampleRequest, UpdateWordDto } from "../dto/WordDto";
import {Response} from 'express'

@JsonController('/word')
@Service()
export default class WordController {
    constructor(
        readonly wordService: WordService,
    ){}

    @Get('/createDictionary')
    @HttpCode(StatusCodes.OK)
    async createDictionary(@Res() res: Response) {
        await this.wordService.createDictionary();

        return res.send({
            message: "Tạo từ điển thành công"
        })
    }

    @Get()
    @HttpCode(StatusCodes.OK)
    // @Authorized()
    async searchWord (@QueryParams() pageRequest: PageRequest, @Res() res: Response) {
        if (!pageRequest.keyword) {
            throw new BadRequestError("Từ khóa không được để trống");
        }
        const keyword = pageRequest.keyword.toLowerCase();
        const result = await this.wordService.searchWord(keyword);
        return res.send(result);
    }

    @Get('/admin')
    @HttpCode(StatusCodes.OK)
    @Authorized(Role.ROLE_ADMIN)
    async getAllWords(@QueryParams() pageRequest: PageRequest, @Res() res: Response) {
        const {list, count} = await this.wordService.getAllWords(pageRequest);
        return res.send({list, count});
    }

    @Get('/:id')
    async getById(@Param('id') id: number, @Res() res: Response) {
        const word = await this.wordService.getById(id);
        return res.send(word);
    }

    @Get('/vocab/:vocab')
    @Authorized()
    async getWordDetails(@Param('vocab') vocab: string, @Res() res: Response) {
        if (!vocab) throw new BadRequestError("Vocab is required");
        
        const result = await this.wordService.getWordByVocab(vocab);
        return res.send(result)
    }

    @Put('/:id/admin')
    @HttpCode(StatusCodes.OK)
    @Authorized(Role.ROLE_ADMIN)
    async updateWord(@Param('id') id: number,
                    @Body() newWord: UpdateWordDto) {
        newWord.meaning = JSON.stringify(newWord.meaning)
        const word = await this.wordService.updateWord(id, newWord);
        return word;
    }


    @Delete('/:id/admin')
    @HttpCode(StatusCodes.OK)
    @Authorized(Role.ROLE_ADMIN)
    async deleteWord(@Param('id') id: number) {
        await this.wordService.deleteWord(id);
        return {
            message: "Xóa từ thành công"
        }
    }
}