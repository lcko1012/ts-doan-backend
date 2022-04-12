import { BadRequestError, Body, BodyParam, Get, HttpCode, JsonController, Param, Post, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import RegisterDto from "../dto/RegisterDto";
import LoginDto from "../dto/LoginDto";
import AuthService from "../services/AuthService";


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
    
    @Post('/login')
    async login(@Body() userData: LoginDto, @Res() res: Response){
        const {email, password} = userData
        const {accessToken, refreshToken} = await this.authService.login(email, password);
        return res.status(StatusCodes.OK)
                    .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        path: '/api/auth/refresh_token',
                        maxAge: 1000 * 60 * 60 * 24 * 7,
                        secure: process.env.NODE_ENV === 'production'
                    }).json({accessToken})
    }

}