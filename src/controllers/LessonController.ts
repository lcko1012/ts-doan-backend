import { LessonCreatingDto } from "dto/LessonDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Res } from "routing-controllers";
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
}