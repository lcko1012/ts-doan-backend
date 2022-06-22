import TestCreateDto, { TestSubmitDto, TestUpdateDto } from "dto/TestDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Param, Params, Post, Put, Res } from "routing-controllers";
import TestService from "services/TestService";
import { Service } from "typedi";
import { Response } from 'express'

@JsonController('/test')
@Service()
export default class TestController { 
    constructor(
        readonly testService: TestService
    ) { }

    @Post('/teacher')
    @Authorized('ROLE_TEACHER')
    @HttpCode(200)
    async create(
        @Body() body: TestCreateDto,
        @CurrentUser() user: IUserCredential
    ){
        await this.testService.create(body, user);
        return {
            message: 'Tạo đề thi thành công'
        }
    }

    @Get('/:id/lesson/:lessonId/teacher')
    @Authorized('ROLE_TEACHER')
    async getBasic(
        @Param('id') id: number,
        @Param('lessonId') lessonId: number,
        @CurrentUser() teacher: IUserCredential,
        @Res() res: Response
    ){
        const test = await this.testService.getBasic(id, lessonId, teacher);
        return res.send(test);
    }

    @Put('/:id/teacher')
    @Authorized('ROLE_TEACHER')
    async update(
        @Param('id') id: number,
        @Body() body: TestUpdateDto,
        @CurrentUser() teacher: IUserCredential
    ){
        body.name = body.name.trim();
        await this.testService.update(id, body, teacher);
        return {
            message: 'Cập nhật thành công'
        };
    }

    @Get('/:id/course/:courseSlug/student')
    @Authorized('ROLE_USER')
    async getTestWithQuestionsByStudent(
        @Param('id') id: number,
        @Param('courseSlug') courseSlug: string,
        @CurrentUser() student: IUserCredential,
        @Res () res: Response
    ){
        const test = await this.testService.getTestWithQuestionsByStudent(courseSlug, id, student);

        return res.send(test)
    }

    //submit test
    @Post('/submit/course/:courseSlug/student')
    @Authorized('ROLE_USER')
    async submitTest(
        @Param('courseSlug') courseSlug: string,
        @Body() testSubmit: TestSubmitDto,
        @CurrentUser() student: IUserCredential,
        @Res () res: Response
    ){
        const result = await this.testService.submitTestByStudent(courseSlug,testSubmit.id, student, testSubmit);
        return res.send(result);
    }

    @Get('/:id/result/lesson/:lessonId/teacher')
    @Authorized('ROLE_TEACHER')
    async getResultListByTeacher(
        @Param('id') id: number,
        @Param('lessonId') lessonId: number,
        @CurrentUser() teacher: IUserCredential,
        @Res () res: Response
    ){
        const result = await this.testService.getResultListByTeacher(id, lessonId, teacher);
        return res.send(result)
    }

} 