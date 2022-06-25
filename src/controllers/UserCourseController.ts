import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, QueryParam, Res } from "routing-controllers";
import { Service } from "typedi";
import {Response} from 'express'
import UserCourseSerivice from "services/UserCourseService";
import IUserCredential from "interfaces/IUserCredential";

@JsonController('/user_course')
@Service()
export default class UserCourseController {
    constructor (
        readonly userCourseService: UserCourseSerivice
    ) {}

    
    @Get('/course/:courseId/teacher')
    @Authorized('ROLE_TEACHER')
    async findUserByEmailByTeacher(
        @QueryParam('email') email: string,
        @Param('courseId') courseId: number,
        @Res() res: Response
    ){
        if (!email) throw new BadRequestError('Email không được để trống');
        const user = await this.userCourseService.findUserByEmailByTeacher(email, courseId);
        return res.send(user)
    }

    @Post('/teacher')
    @Authorized('ROLE_TEACHER')
    async addUserToCouseByTeacher (
        @Body() data: {userId: number, courseId: number},
        @CurrentUser() teacher: IUserCredential
    ){
        const {userId, courseId} = data
        if (!userId || !courseId) throw new BadRequestError('Thông tin không được để trống');

        await this.userCourseService.addUserToCouseByTeacher(userId, courseId, teacher);

        return {
            message: 'Thêm học viên vào khóa học thành công'
        }
    }
}