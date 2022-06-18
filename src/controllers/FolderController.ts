import { FolderCreateingDto } from "dto/FolderDto";
import IUserCredential from "interfaces/IUserCredential";
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Service } from "typedi";

@JsonController('/folder')
@Service()
export default class FolderController {
    constructor() { }

    //get by owner
    @Get('/:id/user')
    @Authorized()
    async getDetailsByOwner( 
        @Param('id') id: number,
        @CurrentUser() currentUser: IUserCredential,
    ){

    }

    @Post()
    @Authorized()
    async createFolder(
        @Body() newFolder: FolderCreateingDto,
        @CurrentUser() currentUser: IUserCredential,
    ){
        
    }
}