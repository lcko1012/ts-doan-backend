import { Authorized, BadRequestError, Get, JsonController, Param } from "routing-controllers";
import StorageService from "services/StorageServices";
import { Service } from "typedi";

@JsonController('/stream')
@Service()
export default class StreamController {
    constructor(
        readonly storageService: StorageService
    ){}

    @Get('/:fileName')
    @Authorized()
    async getSignedUrl (
        @Param('fileName') fileName: string
    ) {
        if (!fileName) throw new BadRequestError('Không có tên video')
        const signedUrl = this.storageService.getSignedURL(fileName)
        return signedUrl;
    }
}