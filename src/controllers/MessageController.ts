import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Post, QueryParam, Res } from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";
import MessageService from "services/MessageService";
import { MessageDto } from "dto/MessageDto";
import IUserCredential from "interfaces/IUserCredential";

@JsonController('/message')
@Service()
export default class MessageController {
    constructor(
        readonly messageService: MessageService 
    ){}

    @Get()
    @Authorized() 
    async getByTeacherIdAndUserId(
        @QueryParam('teacherId') teacherId: number,
        @QueryParam('userId') userId: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        if (!teacherId || !userId) throw new BadRequestError('Thiếu tham số')
        const messages = await this.messageService.getByTeacherIdAndUserId(teacherId, user.id)
        return res.send(messages)
    }

    @Post()
    @Authorized() 
    async send(
        @Body() data: MessageDto,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        const message = await this.messageService.send(data, user);
        return res.send(message)
    }
}