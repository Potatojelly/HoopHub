import express from "express";
import "express-async-errors";
import {body} from "express-validator";
import {validate} from '../middleware/validator.js';
import * as forumController from "../controller/forum.js";
import {isAuth} from "../middleware/auth.js";
import { forumUpload } from '../upload/uploadFile.js';


const router = express.Router();

const validateFiles = [
    body("image")
        .customSanitizer((value,{req}) => {
            if(!req.files.image) {
                return true
            }

            req.files.image.forEach((element)=>{
                if(!element.mimetype.startsWith("image/")) {
                    throw new Error("Only image files are accepted.");
                }
            })

            return true;
        }),
    body("video")
        .customSanitizer((value,{req}) => {
            if(!req.files.video) {
                return true
            }

            req.files.video.forEach((element)=>{
                if(!element.mimetype.startsWith("video/")) {
                    throw new Error("Only video files are accepted.");
                }
            })
            
            return true;
        }),
    validate
]

router.post("/create-post", isAuth,  forumUpload.fields([{name:"image"},{name:"video"}]), validateFiles, forumController.createPost );


export default router;
