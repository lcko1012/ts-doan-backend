import { IdiomDto } from "../dto/WordDto";
import { Body, Delete, JsonController, Param, Post, Put } from "routing-controllers";
import IdiomService from "../services/IdiomService";
import { Service } from "typedi";

@JsonController('/idiom')
@Service()
export default class IdiomController {
    constructor(
        readonly idiomService: IdiomService
    ) {}

    @Post()
    async createIdiom(@Body() newIdiom: IdiomDto) {
        await this.idiomService.createIdiom(newIdiom);
        return {
            message: 'Tạo mới thành ngữ thành công'
        }
    }

    @Put('/:id')
    async updateIdiom(@Param('id') id: number, @Body() newIdiom: IdiomDto){
        // await this.idiomService.upda
        await this.idiomService.updateIdiom(id, newIdiom)
        return {
            message: 'Cập nhật thành công'
        }
    }

    @Delete('/:id')
    async deleteIdiom(@Param('id') id: number){
        await this.idiomService.deleteIdiom(id)
        return {
            message: 'Xóa thành công'
        }
    }

}