import multer from "multer";

const multerStorage = multer.memoryStorage();

const imageUpload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
        files: 1
    }
}).single("image");

export default imageUpload;