import { Body, Delete, JsonController, Param, Post } from "routing-controllers";
import WordKindService from "../services/WordKindService";
import { Service } from "typedi";

@JsonController('/word_kind')
@Service()
export default class WordKindController {
    constructor(
        readonly wordKindService: WordKindService,
    ){}

    @Post()
    async createWordKind(@Body() data: {wordId: number, kindId: number}) {
        const {wordId, kindId} = data;
        await this.wordKindService.createWordKind(wordId, kindId);
        return {
            message: 'Đã tạo loại từ mới'            
        }
    }

    @Delete("/:wordId/:kindId")
    async deleteWordKind(@Param('wordId') wordId: number, @Param('kindId') kindId: number) {
        await this.wordKindService.deleteWordKind(wordId, kindId);
        return {
            message: 'Đã xóa loại từ và định nghĩa'
        }
    }
}