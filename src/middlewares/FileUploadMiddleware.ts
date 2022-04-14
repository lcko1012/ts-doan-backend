import multer from "multer";


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
            callback(new Error("Invalid file type"));
        }
    },
    
    limits: {
        fileSize: 1024 * 1024 * 2,
        fieldNameSize: 255
    }
}