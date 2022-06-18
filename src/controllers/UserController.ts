import UserService from "../services/UserService";
import { Service } from "typedi";
import { Authorized, CurrentUser, Get, HttpCode, JsonController, Params, Res } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import IUserCredential from "interfaces/IUserCredential";
import {Response} from 'express'
import PageRequest from "dto/PageDto";

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
        @Params() pageRequest: PageRequest,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        
    }
}