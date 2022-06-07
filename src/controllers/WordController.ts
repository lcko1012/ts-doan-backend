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

    @Get('/:id/admin')
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

    //get by id
    @Get('/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async getWordsOfLessonByTeacher(
        @QueryParams() pageRequest: PageRequest,
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @CurrentUser() user: IUserCredential, @Res() res: Response)
    {
        const {list, count} = await this.wordService.getWordsByLesson(lessonId, 
                                            courseId, user, pageRequest);

        return res.send({
            list, count
        });
    }

    @Post('/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async createOfLessonByTeacher(
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @Body() newWord: CreateWordDto,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response) 
    {
        const word = await this.wordService.createWordLessonByTeacher(lessonId, courseId,
                                                                    newWord, user);
        return res.send({
            message: "Thêm từ thành công",
            word
        });
    }

    @Post('/exist/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async addExistedWordToLesson(
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @BodyParam('wordId') wordId: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response)
    {
        const newWord = await this.wordService.addExistedWordToLesson(lessonId, courseId, wordId, user);

        return res.send({
            message: "Thêm từ thành công",
            newWord
        })
    }

    @Get('/:wordId/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async getWordInLessonByTeacher(
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @Param('wordId') wordId: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response)
    {
        const word = await this.wordService.getWordInLesson(lessonId, courseId, wordId, user);
        return res.send(word)
    }

    @Put('/:wordId/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async updateWordInLessonByTeacher(
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @Param('wordId') wordId: number,
        @Body() newWord: UpdateWordDto,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response)
    {
        newWord.audios = newWord.audios ? JSON.stringify(newWord.audios) : null;

        if (!newWord.lessonId) throw new BadRequestError('')
        await this.wordService.updateWordInLessonByTeacher(lessonId, courseId, wordId, newWord, user);
        return res.send({
            message: "Cập nhật từ thành công"
        })
    }

    @Delete('/:wordId/lesson/:lessonId/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async deleteWordInLessonByTeacher(
        @Param('lessonId') lessonId: number,
        @Param('courseId') courseId: number,
        @Param('wordId') wordId: number,
        @CurrentUser() user: IUserCredential,
    )
    {
        await this.wordService.deleteWordInLessonByTeacher(lessonId, courseId, wordId, user);
        return {
            message: "Xóa thành công"
        }
    }
}