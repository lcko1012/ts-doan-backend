import QuestionUpdateDto, {QuestionCreateDto} from "dto/QuestionDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import QuestionService from "services/QuestionService";

@JsonController("/question")
@Service()
export default class QuestionController { 
    constructor(
        readonly questionService: QuestionService
    ){}

    @Get('/test/:testId/lesson/:lessonId/teacher')
    @Authorized('ROLE_TEACHER')
    async get(
        @Param('testId') testId: number, 
        @Param('lessonId') lessonId: number,
        @CurrentUser() teacher: IUserCredential,
        @Res() res: Response
    ){
        const questions = await this.questionService.getListByTeacher(lessonId, testId, teacher)

        return res.send(questions)
    }

    @Post('/lesson/:lessonId/teacher') 
    @Authorized('ROLE_TEACHER')
    async create(
        @Param('lessonId') lessonId: number,
        @CurrentUser() teacher: IUserCredential, 
        @Res() res: Response,
        @Body() question: any,
    ){
        const newQuestion = await this.questionService.createByTeacher(lessonId, teacher, question);
        return res.send({
            newQuestion,
            message: 'Tạo câu hỏi thành công'
        })
    }

    @Put('/:questionId/lesson/:lessonId/teacher')
    @Authorized('ROLE_TEACHER')
    async update(
        @Param('questionId') questionId: number,
        @Param('lessonId') lessonId: number,
        @CurrentUser() teacher: IUserCredential, 
        @Res() res: Response,
        @Body() question: QuestionUpdateDto,
    ){
        console.log(question)
        await this.questionService.updateByTeacher(questionId, lessonId, teacher, question);
        return res.send({
            message: 'Cập nhật câu hỏi thành công'
        })
    }
}