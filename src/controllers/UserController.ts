import UserService from "../services/UserService";
import { Service } from "typedi";
import { Authorized, CurrentUser, Get, HttpCode, JsonController } from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import IUserCredential from "interfaces/IUserCredential";

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
    
}