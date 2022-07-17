import { MeaningUpdateDto } from "../dto/MeaningDto";
import { Response } from "express";
import { Body, Delete, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import MeaningService from "../services/MeaningService";
import { Service } from "typedi";

@JsonController('/meaning')
@Service()
export default class MeaningController {
    constructor(
        readonly meaningService: MeaningService
    ) { }

    @Get('/:id/examples')
    async getMeanings(@Param('id') id: number, @Res() res: Response) {
        const meaning = await this.meaningService.getMeaningWithExamples(id);
        return res.send(meaning);
    }

    @Post()
    async createMeaning(@Body() meaning: MeaningUpdateDto, @Res() res: Response) {
        await this.meaningService.createMeaning(meaning);
        return res.send({
            message: "Tạo định nghĩa thành công"
        });
    }

    @Put('/:id')
    async updateMeaning(@Param('id') id: number,
                        @Body() meaning: MeaningUpdateDto,
                        @Res() res: Response) 
    {
        await this.meaningService.updateMeaning(id, meaning);
        return res.send({
            message: "Cập nhật thành công",
        })
    }

    @Delete('/:id')
    async deleteMeaning(@Param('id') id: number, @Res() res: Response) {
        await this.meaningService.deleteMeaningById(id);
        return res.send({
            message: "Xóa thành công"
        })
    }
} 
