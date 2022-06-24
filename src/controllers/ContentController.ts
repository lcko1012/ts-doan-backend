import { ContentCreateingDto } from "dto/ContentDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, BadRequestError, Body, CurrentUser, JsonController, Param, Post, Put, Res, Get, QueryParam, Delete } from "routing-controllers";
import ContentService from "services/ContentService";
import { Service } from "typedi";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

@JsonController('/content')
@Service()
export default class ContentController { 
    constructor(
        readonly contentService: ContentService
    ) { }

    @Post('/teacher')
    @Authorized('ROLE_TEACHER')
    async create(
        @Body() body: ContentCreateingDto,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ) {
        console.log(body)
        if (body.type === 'CONTENT_VIDEO' && !body.path) throw new BadRequestError('Bạn chưa chọn video');
        else if (body.type === 'CONTENT_ARTICLE' && !body.content) throw new BadRequestError('Bạn chưa viết bài');

        const result = await this.contentService.create(body, user);

        return res.status(StatusCodes.CREATED).send(result)
    }

    @Put('/:id/teacher')
    @Authorized('ROLE_TEACHER')
    async update(
        @Body() body: ContentCreateingDto,
        @Param('id') id: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        if (body.type === 'CONTENT_VIDEO' && !body.path) throw new BadRequestError('Bạn chưa chọn video');
        else if (body.type === 'CONTENT_ARTICLE' && !body.content) throw new BadRequestError('Bạn chưa viết bài');
        await this.contentService.update(id, body, user);

        return res.status(StatusCodes.OK).send()
    }

    @Get('/:id/teacher')
    @Authorized('ROLE_TEACHER')
    async get(
        @Param('id') id: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ) {
        const content = await this.contentService.getByTeacher(id, user);
        return res.send(content);
    }

    @Delete('/:id/teacher')
    @Authorized('ROLE_TEACHER')
    async delete(
        @Param('id') id: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        await this.contentService.delete(id, user);
        return res.status(StatusCodes.OK).send()
    }

    @Get('/:id/student')
    @Authorized('ROLE_USER')
    async getByStudent(
        @Param('id') id: number,
        @CurrentUser() user: IUserCredential,
        @Res() res: Response
    ){
        const content = await this.contentService.getByStudent(id, user);
        return res.send(content);
    }
}