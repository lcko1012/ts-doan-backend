import { Authorized, BadRequestError, Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, Put, QueryParam, QueryParams, Res } from "routing-controllers";
import { Service } from "typedi";
import ExampleService from "../services/ExampleService";
import {Response} from 'express'
import { StatusCodes } from "http-status-codes";

@JsonController('/example')
@Service()
export default class ExampleController {
    constructor(
        readonly exampleService: ExampleService,
    ){}

    @Get('/definition/:def_id')
    @HttpCode(StatusCodes.OK)
    async getExamples(@Param('def_id') defId: number, @Res() res: Response) {
        const examples = await this.exampleService.getExamples(defId)
        return res.send(examples)
    }

    // @Post()
    // @HttpCode(StatusCodes.CREATED)
    // async createExample(@Body() exampleRequest: ExampleRequest, @Res() res: Response) {
    //     const newExample = await this.exampleService.createExample(exampleRequest)
    //     return res.send({
    //         message: "Thêm ví dụ thành công",
    //         newExample
    //     })
    // }

    // @Put('/:id')
    // @HttpCode(StatusCodes.OK)
    // async updateExample(@Param('id') id: number, @Body() exampleRequest: ExampleRequest, @Res() res: Response) {
    //     console.log(id, exampleRequest)
    //     await this.exampleService.updateExample(id, exampleRequest)
    //     return res.send({
    //         message: "Cập nhật thành công"
    //     })
    // }

    @Delete('/:id')
    @HttpCode(StatusCodes.OK)
    async deleteExample(@Param('id') id: number, @Res() res: Response) {
        await this.exampleService.deleteExample(id)
        return res.send({
            message: 'Xóa ví dụ thành công'
        })
    }
}