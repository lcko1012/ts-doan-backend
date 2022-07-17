import { Body, Get, JsonController, Param, Params, Put, QueryParams, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from 'express'
import KindService from "../services/KindService";

@JsonController('/kind')
@Service()
export default class KindController {
    constructor(
        readonly kindService: KindService
    ) { }

    //Get all kinds
    @Get()
    async getKinds(@Res() res: Response) {
        const kinds = await this.kindService.getAllKinds();
        return res.send(kinds);
    }

    //Get kinds of word (except for those kinds already exist)
    @Get('/word/:id')
    async getKindsOfWord(@Res() res: Response, @Param('id') id: number) {
        const kinds = await this.kindService.getKindsForWord(id);
        return res.send(kinds);
    }

    @Put('/word/:wordId')
    async updateKindsOfWord(@Res() res: Response, @Param('wordId') wordId: number, @Body() data: any) {
        console.log(data)
        const {oldKindId, newKindId} = data;
        await this.kindService.updateKindsOfWord(wordId, oldKindId, newKindId);
        return res.send({
            message: 'Đã cập nhật từ loại',
        })
    }
}