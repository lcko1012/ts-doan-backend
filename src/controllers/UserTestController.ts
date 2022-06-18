import { CurrentUser, Get, JsonController, Param, Params, Res } from "routing-controllers";
import { Service } from "typedi";
import {Response} from 'express'
import IUserCredential from "interfaces/IUserCredential";
import UserTestService from "services/UserTestService";

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
}