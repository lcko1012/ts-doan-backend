import aws from "aws-sdk"
import { Service } from "typedi"
import path from "path"
import {readFileSync} from "fs"
import fileType from "file-type"

const BUCKET_NAME = process.env.BUCKET_NAME
const REGION = process.env.REGION
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const BUKCET_PRIVATE_NAME = process.env.BUCKET_PRIVATE_NAME
const CLOUDFONT_DOMAIN_NAME = process.env.CLOUDFONT_DOMAIN_NAME

@Service()
export default class StorageService {
    readonly s3 = new aws.S3({
        region: REGION,
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
    })

    constructor() {}

    public async uploadFile(email: string, filePath: string) {
        const key = `${email}/${path.basename(filePath)}`;

        const buffer = readFileSync(filePath);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Body: buffer,
            Key: key,
            ContentType: (await fileType.fromBuffer(buffer)).mime
        }

        await this.s3.upload(uploadParams).promise();

        return `${CLOUDFONT_DOMAIN_NAME}/${key}`;
    }

    public async getSignedURL(fileName: string){
        var params = {
            Bucket: BUKCET_PRIVATE_NAME,
            Key: fileName,
        }
        const presignedUrl = this.s3.getSignedUrl("getObject", params);
        
        return presignedUrl
    }
}