import { DefinitionUpdatingDto } from "dto/DefinitionDto";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Body, Delete, Get, HttpCode, JsonController, Param, Patch, Put, Res } from "routing-controllers";
import DefinitionService from "services/DefinitionService";
import { Service } from "typedi";

@JsonController('/definition')
@Service()
export default class DefinitionController {
    constructor(
        readonly definitionService: DefinitionService,
    ){}

    @Get('/:id')
    @HttpCode(StatusCodes.OK)
    async getDefinition(@Param('id') id:number, @Res() res: Response) {
        const definition = await this.definitionService.getDefinitionById(id)
        return res.send(definition)
    }

    @Put('/:id')
    @HttpCode(StatusCodes.OK)
    async updateDefinition(@Param('id') id:number, 
                        @Body() definition: DefinitionUpdatingDto,
                        @Res() res: Response) {

                            await this.definitionService.updateDefinition(id, definition)
        return res.send({
            message: "Cập nhật thành công",
        })
    }

    @Delete('/:id')
    @HttpCode(StatusCodes.OK)
    async deleteDefinition(@Param('id') id:number, @Res() res: Response) {
        await this.definitionService.deleteDefinitionById(id)
        return res.send({
            message: "Xóa thành công"
        })
    }
}