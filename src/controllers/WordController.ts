import { StatusCodes } from "http-status-codes";
import { Authorized, BadRequestError, Body, BodyParam, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Params, Patch, Post, Put, QueryParam, QueryParams, Res } from "routing-controllers";
import WordService from "../services/WordService";
import { Service } from "typedi";
import Role from "../models/Role";
import PageRequest from "../dto/PageDto";
import { CreateWordDto, ExampleRequest, UpdateWordDto } from "../dto/WordDto";
import { Response } from 'express'
import IUserCredential from "interfaces/IUserCredential";

@JsonController('/word')
@Service()
export default class WordController {
    constructor(
        readonly wordService: WordService,
    ) { }

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
    @Authorized()
    async searchWord(@QueryParams() pageRequest: PageRequest, @Res() res: Response) {
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
        const { list, count } = await this.wordService.getAllWords(pageRequest);
        return res.send({ list, count });
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

    @Post('/admin')
    @Authorized(Role.ROLE_ADMIN)
    async createWordDict(@Body() newWord: CreateWordDto, @Res() res: Response) {
        const word = await this.wordService.createWordDict(newWord);
        return res.send({
            message: "Thêm từ thành công",
            word
        });
    }

    @Put('/:id/admin')
    @HttpCode(StatusCodes.OK)
    @Authorized(Role.ROLE_ADMIN)
    async updateWord(@Param('id') id: number,
        @Body() newWord: UpdateWordDto) 
    {
        newWord.audios = newWord.audios ? JSON.stringify(newWord.audios) : null;
        await this.wordService.updateWord(id, newWord);
        return {
            message: "Cập nhật từ thành công"
        };
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

    @Get('/lesson/:lessonSlug/course/:courseSlug/teacher')
    @Authorized('ROLE_TEACHER')
    async getWordsOfLessonByTeacher(
        @QueryParams() pageRequest: PageRequest,
        @Param('lessonSlug') lessonSlug: string,
        @Param('courseSlug') courseSlug: string,
        @CurrentUser() user: IUserCredential, @Res() res: Response)
    {
        const {list, count} = await this.wordService.getWordsByLesson(lessonSlug, 
                                            courseSlug, user, pageRequest);

        return res.send({
            list, count
        });
    }

    @Post('/lesson/:lessonSlug/course/:courseSlug/teacher')
    @Authorized('ROLE_TEACHER')
    async createOfLessonByTeacher(
        @Param('lessonSlug') lessonSlug: string,
        @Param('courseSlug') courseSlug: string,
        @Body() newWord: CreateWordDto,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response) 
    {
        const word = await this.wordService.createWordLessonByTeacher(lessonSlug, courseSlug,
                                                                    newWord, user);
        return res.send({
            message: "Thêm từ thành công",
            word
        });
    }

}