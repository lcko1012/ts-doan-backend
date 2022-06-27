import { Authorized, BadRequestError, Body, CurrentUser, Get, JsonController, Param, Post, QueryParam, Res } from "routing-controllers";
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
        @QueryParam('senderId') senderId: number,
        @QueryParam('receiverId') receiverId: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        if (!((user.id === senderId) || (user.id === receiverId))) 
        {
                throw new BadRequestError('Không thể xem tin nhắn')
        } 
        if (!senderId || !receiverId) throw new BadRequestError('Thiếu tham số')
        const messages = await this.messageService.getByTeacherIdAndUserId(senderId, receiverId)
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

    @Get('/user_list/teacher')
    @Authorized() 
    async getUserMessageHistory(
        @CurrentUser() teacher: IUserCredential,
        @Res() res: Response
    ){
        const list = await this.messageService.getUserListMsgByTeacher(teacher);
        return res.send(list)
    }

    // @Get('/:userId/teacher')
    // @Authorized() 
    // async getWithUserInforByTeacher(
    //     @Param('userId') userId: number,
    //     @CurrentUser() teacher: IUserCredential,
    //     @Res() res: Response
    // ){
    //     const result = await this.messageService.getWithUserInforByTeacher(userId, teacher)
    //     return res.send(result)
    // }

}