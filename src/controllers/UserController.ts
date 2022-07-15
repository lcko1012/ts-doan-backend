import UserService from "../services/UserService";
import { Service } from "typedi";
import { Authorized, BadRequestError, CurrentUser,Put, Get, HttpCode, JsonController, Param, Params, QueryParam, QueryParams, Res, Body } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import IUserCredential from "interfaces/IUserCredential";
import {Response} from 'express'
import PageRequest from "dto/PageDto";
import UserUpdate from "dto/UserDto";

@JsonController()
@Service()
export default class UserController {
    constructor(
        private userService: UserService,
    ){}

    @Get('/whoami')
    @Authorized()
    @HttpCode(StatusCodes.OK)
    async whoami(@CurrentUser() currentUser: IUserCredential) {
        const user = await this.userService.getUserByEmail(currentUser.email);
        return user;
    }
    
    @Get('/user/course')
    @Authorized()
    async getWithCourses(
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ) {
        const result = await this.userService.getWithCourses(currentUser.id);
        return res.send(result);
    }

    @Get('/user/test')
    @Authorized()
    async getWithTests(
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        const result = await this.userService.getWithTests(currentUser.id);
        return res.send(result);
    }

    @Get('/user/folder')
    @Authorized()
    async getWithFolders(
        @QueryParams() pageRequest: PageRequest,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        const result = await this.userService.getWithFolders(currentUser.id, pageRequest);
        return res.send(result);
    }

    @Get('/user/by_id/:id')
    @Authorized()
    async getUserDetails(
        @Param('id') id: number,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        const result = await this.userService.getUserById(id);
        return res.send(result);
    }

    @Put('/user')
    @Authorized()
    async updateUser(
        @CurrentUser() currentUser: IUserCredential,
        @Body() data: UserUpdate,
        @Res() res: Response
    ){
        await this.userService.update(currentUser, data)
        return res.send({
            message: 'Cập nhật thành công'
        })
    }

    @Get('/teacher/:nameLink')
    async getTeacherInfo(
        @Param('nameLink') nameLink: string,
        @Res() res: Response
    ){
        if (!nameLink) throw new BadRequestError('Thiếu thông tin tên giảng viên')
        const infor = await this.userService.getTeacherInfo(nameLink)
        return res.send(infor)
    }
}