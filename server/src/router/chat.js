import express from "express";
import "express-async-errors";
import {body} from "express-validator";
import {validate} from '../middleware/validator.js';
import * as chatController from "../controller/chat.js";
import {isAuth} from "../middleware/auth.js";
import { chatUpload } from '../upload/uploadFile.js';

const router = express.Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

router.get("/get-chat-rooms", isAuth, chatController.getChatRooms);

router.post("/create-chat-room/:opponentID", isAuth, chatController.createChatRoom);

router.get("/get-message/:chatRoomID/:page",isAuth, chatController.getMessage);

router.post("/send-message",isAuth, chatController.sendMessage);

router.get("/count-unread-message/:chatRoomID",isAuth, chatController.countUnreadMessage);

router.put("/save-last-read-message",isAuth, chatController.saveLastReadMessage);

router.post("/send-image-message",isAuth, chatUpload.single("image"), validateImage, chatController.sendImageMessage);

export default router;