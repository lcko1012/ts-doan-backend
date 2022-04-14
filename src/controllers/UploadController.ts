import { StatusCodes } from "http-status-codes";
import { fileUploadOptions } from "middlewares/FileUploadMiddleware";
import { Authorized, HttpCode, JsonController, Post, Req, UploadedFile } from "routing-controllers";
import StorageService from "services/StorageServices";
import { Service } from "typedi";
import fs from "fs";

@JsonController('/upload')
@Service()
export default class UploadController {
    constructor(
        private storageService: StorageService
    ){}

    @Post()
    @Authorized()
    @HttpCode(StatusCodes.OK)
    async uploadFile(@UploadedFile("file", {options: fileUploadOptions}) file: Express.Multer.File) {
        let publicUrl = await this.storageService.uploadFile(file.path);

        fs.unlink(file.path, err => {
            if (err) {
                console.error(err);
                throw err;
            }
        })

        return {
            url: publicUrl
        }
    }
}