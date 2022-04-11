import RegisterDto from "../dto/RegisterDto";
import { BadRequestError, Body, BodyParam, Get, HttpCode, JsonController, Post, Res } from "routing-controllers";
import AuthService from "../services/AuthService";
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import LoginDto from "../dto/LoginDto";


@JsonController('/auth')
@Service()
export default class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Get()
    async getIndex() {
        return {
            message: "hello"
        }
    }

    @Post('/register') 
    @HttpCode(StatusCodes.ACCEPTED)
    async register(@Body() userData: RegisterDto) {
        console.log(userData)
        if (userData.password !== userData.password_confirmation) {
            throw new BadRequestError('Passwords do not match');
        }

        await this.authService.register(userData);

        return {
            message: "Please check your email to activate your account"
        }
    }

    @Post('/activate')
    @HttpCode(StatusCodes.ACCEPTED)
    async activate(@BodyParam('token') token: string) {
        await this.authService.activate(token);

        return {
            message: "Account activated",
        }
    }  
}