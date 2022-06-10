import { LessonCreatingDto } from "dto/LessonDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, BadRequestError, Body, BodyParam, CurrentUser, Delete, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import LessonService from "services/LessonService";
import { Service } from "typedi";
import { Response } from 'express'

@JsonController('/lesson')
@Service()
export default class LessonController {
    constructor(
        readonly lessonService: LessonService
    ) { }

    @Post()
    @Authorized('ROLE_TEACHER')
    async createLesson(
        @Body() lesson: LessonCreatingDto,
        @CurrentUser() user: IUserCredential) 
    {
        await this.lessonService.createLesson(lesson, user)
        
        return {
            message: "Tạo bài học thành công"
        }
    }

    @Get('/:lessonId/flashcard/teacher')
    @Authorized('ROLE_TEACHER')
    async getFlashcard(@Param('lessonId') lessonId: number ,@CurrentUser() user: IUserCredential, @Res() res: Response) {
        const words = await this.lessonService.getFlashcard(lessonId, user);
        return res.send(words);
    }

    @Delete('/:lessonId')
    @Authorized('ROLE_TEACHER')
    async deleteLesson(@Param('lessonId') lessonId: number, @CurrentUser() user: IUserCredential) {
        await this.lessonService.delete(lessonId, user);
        return {
            message: 'Xóa bài học thành công'
        }
    }

    @Put('/:lessonId')
    @Authorized('ROLE_TEACHER')
    @HttpCode(200)
    async updateName(
        @Param('lessonId') lessonId: number,
        @BodyParam('name') name: string,
        @CurrentUser() user: IUserCredential
    ){
        if (!name) throw new BadRequestError('Tên bài học không được để trống')
        await this.lessonService.updateName(lessonId, name, user);
        return {
            message: 'Đã cập nhật tên bài học'
        }
    }
}