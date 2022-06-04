import { LessonCreatingDto } from "dto/LessonDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, JsonController, Post } from "routing-controllers";
import LessonService from "services/LessonService";
import { Service } from "typedi";

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

    // @Get('/:slug/post/words')
    // @Authorized('ROLE_TEACHER')
    // async getWords()
    // {
        
    // }
}