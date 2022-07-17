import { FolderCreateingDto } from "../dto/FolderDto";
import IUserCredential from "../interfaces/IUserCredential";
import { Authorized, BadRequestError, Body, BodyParam, CurrentUser, Delete, Get, JsonController, Param, Post, Put, Res } from "routing-controllers";
import FolderService from "../services/FolderService";
import { Service } from "typedi";
import {Response} from 'express'

@JsonController('/folder')
@Service()
export default class FolderController {
    constructor(
        readonly folderService: FolderService,
    ) { }

    //get by owner
    @Get('/:id')
    @Authorized()
    async getDetailsByOwner( 
        @Param('id') id: number,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        const folder = await this.folderService.getDetails(id, currentUser)
        return res.send(folder)
    }

    @Post()
    @Authorized()
    async createFolder(
        @Body() newFolder: FolderCreateingDto,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        const folder = await this.folderService.create(newFolder, currentUser);
        return res.send({
            folder,
            message: "Thư mục đã được tạo",
        })
    }

    @Delete('/:id')
    @Authorized()
    async delete(
        @Param('id') id: number,
        @CurrentUser() currentUser: IUserCredential,
        @Res() res: Response
    ){
        await this.folderService.delete(id, currentUser);
        return res.send({
            message: 'Đã xóa thư mục'
        })
    }

    @Put('/:id')
    @Authorized()
    async updateName(
        @Param('id') id: number,
        @CurrentUser() currentUser: IUserCredential,
        @BodyParam('name') name: string,
        @Res() res: Response
    ){
        if (!name) throw new BadRequestError('Tên thư mục không được để trống')
        await this.folderService.updateName(id, currentUser, name);
        return res.send({
            message: 'Đã cập nhật'
        })
    }
}