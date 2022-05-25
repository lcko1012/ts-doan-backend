import { StatusCodes } from "http-status-codes";
import { audioUploadOptions, fileUploadOptions } from "middlewares/FileUploadMiddleware";
import { Authorized, CurrentUser, HttpCode, JsonController, Post, Req, UploadedFile } from "routing-controllers";
import StorageService from "services/StorageServices";
import { Service } from "typedi";
import fs from "fs";
import IUserCredential from "interfaces/IUserCredential";

@JsonController('/upload')
@Service()
export default class UploadController {
    constructor(
        private storageService: StorageService
    ){}

    @Post('/image')
    @Authorized()
    @HttpCode(StatusCodes.OK)
    async uploadFile(@UploadedFile("file", {options: fileUploadOptions}) file: Express.Multer.File,
                     @CurrentUser() currentUser: IUserCredential
    ) {
        const email = currentUser.email.split("@")[0];
        let publicUrl = await this.storageService.uploadFile(email, file.path);
        console.log(file)
        fs.unlink(file.path, err => {
            if (err) {
                console.error(err);
                throw err;
            }
        })
        console.log(file)
        
        return {
            url: publicUrl
        }
    }

    @Post('/audio')
    @Authorized()
    async uploadAudio(@UploadedFile("audio", {options: audioUploadOptions}) audio: Express.Multer.File, @CurrentUser() currentUser: IUserCredential) {
        const email = currentUser.email.split("@")[0];
        let publicUrl = await this.storageService.uploadFile(email, audio.path)

        fs.unlink(audio.path, err => {
            if (err) {
                console.error(err);
                throw err;
            }
        })

        return {
            audioLink: publicUrl
        }
    }
}