import multer from "multer";
import { BadRequestError } from "routing-controllers";


const allowedExtensions = ["image/png", "image/jpeg", "image/jpg"];

export const fileUploadOptions = {
    storage: multer.diskStorage({
        filename: (req, file, callback) => {
            callback(null, Date.now() + "-" + file.originalname);
        }
    }),

    fileFilter(req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if (allowedExtensions.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new BadRequestError("Sai định dạng ảnh"));
        }
    },
    
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
        fieldNameSize: 255
    }
}

const allowedAudio = ['audio/mpeg']

export const audioUploadOptions = {
    storage: multer.diskStorage({
        filename: (req, file, callback) => {
            callback(null, Date.now() + "-" + file.originalname);
        }
    }),

    fileFilter(req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        if (allowedAudio.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new BadRequestError("Sai định dạng âm thanh"));
        }
    },
    
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
        fieldNameSize: 255
    }
}