import { Authorized, CurrentUser, Get, JsonController, Param, Params, QueryParams, Res } from "routing-controllers";
import { Service } from "typedi";
import {Response} from 'express'
import IUserCredential from "interfaces/IUserCredential";
import UserTestService from "services/UserTestService";
import { UserTestRequestDto } from "dto/PageDto";

@JsonController('/user_test')
@Service()
export default class UserTestController {
    constructor(
        readonly userTestService: UserTestService
    ) { }
    
    @Get('/:id')
    async get(
        @Param('id') id: number, 
        @CurrentUser() student: IUserCredential,
        @Res() res: Response)
    {
        const userTest = await this.userTestService.getDetailsByStudent(id, student)
        return res.send(userTest);
    }

    @Get('/')
    async getListByStudent(
        @CurrentUser() student: IUserCredential,
        @Res() res: Response
    ){
        const userTests = await this.userTestService.getListByStudent(student)
        return res.send(userTests)
    }

    @Get('/test/:testId/lesson/:lessonId/teacher')
    @Authorized('ROLE_TEACHER')
    async getListByTeacher(
        @CurrentUser() teacher: IUserCredential,
        @Param('testId') testId: number,
        @Param('lessonId') lessonId: number,
        @QueryParams() userTestRequest: UserTestRequestDto,
        @Res() res: Response
    ){
        const list = await this.userTestService.getListByTeacher(testId, lessonId, teacher, userTestRequest)
        return res.send({
            count: list.count,
            tests: list.tests
        })
    }

    @Get('/:id/teacher')
    @Authorized('ROLE_TEACHER')
    async getByTeacher(
        @Param('id') id: number,
        @CurrentUser() teacher: IUserCredential,
        @Res() res: Response
    ){
        console.log(id)
        const result = await this.userTestService.getDetailsByTeacher(id, teacher)
        
        return res.send(result)
    }
}