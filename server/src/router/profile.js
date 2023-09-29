import express from "express";
import "express-async-errors";
import {body} from "express-validator";
import {validate} from '../middleware/validator.js';
import * as profileController from "../controller/profile.js";
import {isAuth} from "../middleware/auth.js";
import { fileUpload } from '../upload/uploadFile.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const router = express.Router();

const validateStatusMsg = [
    body("statusMsg").trim(),
    validate
]

const validateImage = [
    body("image")
        .customSanitizer((value,{req}) => {
            if(!req.file || !req.file.mimetype.startsWith("image/")) {
                throw new Error("Only image files are accepted.");
            }
            if(req.file.size > MAX_FILE_SIZE) {
                throw new Error("File size can be up to 5MB ");
            }

            return true;
        }),
    validate
]

router.get("/get-profile", isAuth, profileController.getProfile);

router.put("/update-status-message", isAuth, validateStatusMsg, profileController.updateStatusMsg);

router.put("/update-image", isAuth, fileUpload.single("image"), validateImage, profileController.updateImage);

export default router;