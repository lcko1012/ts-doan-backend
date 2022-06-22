import { FolderCreateingDto } from "dto/FolderDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Res } from "routing-controllers";
import FolderService from "services/FolderService";
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
}