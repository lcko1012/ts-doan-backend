import { BadRequestError, Body, BodyParam, Get, HttpCode, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import RegisterDto from "../dto/RegisterDto";
import LoginDto from "../dto/LoginDto";
import AuthService from "../services/AuthService";
import PasswordDto from "dto/PasswordDto";


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
            throw new BadRequestError('Mật khẩu không khớp');
        }

        await this.authService.register(userData);

        return {
            message: "Kiểm tra email để kích hoạt tài khoản"
        }
    }

    @Post('/activate')
    @HttpCode(StatusCodes.ACCEPTED)
    async activate(@BodyParam('token') token: string) {
        await this.authService.activate(token);

        return {
            message: "Kích hoạt tài khoản thành công",
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

    @Post('/forgot_password')
    async forgotPassword(@BodyParam('email') email: string){
        if (!email) {
            throw new BadRequestError('Email không được để trống');
        }

        await this.authService.createPasswordResetToken(email);

        return {
            message: "Hãy kiểm tra email của bạn để lấy lại mật khẩu"
        }
    }

    @Get('/validate_password_reset_token/:token')
    async validatePasswordResetToken(@Param('token') token: string){
        await this.authService.validatePasswordResetToken(token);
        
        return {
            message: "Xác thực mã thành công"
        }
    }

    @Put('/reset_password/:token')
    async resetPassword(@Param('token') token: string, 
                        @Body() newPassword: PasswordDto) {
        if (newPassword.password !== newPassword.password_confirmation) {
            throw new BadRequestError('Mật khẩu không khớp');
        }

        await this.authService.resetPassword(token, newPassword.password);

        return {
            message: "Đặt lại mật khẩu thành công"
        }
    }

    @Get('/logout')
    async logout(@Res() res: Response) {
        res.clearCookie('refreshToken', {path: '/api/auth/refresh_token'});
        return res.send({message: "Đăng xuất thành công"});
    }
}