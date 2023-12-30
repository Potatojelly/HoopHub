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

router.get("/rooms", isAuth, chatController.getChatRooms);

router.post("/rooms", isAuth, chatController.createChatRoom);

router.get("/rooms/:chatRoomID/messages/:offset",isAuth, chatController.getMessage);

router.post("/rooms/:chatRoomID/messages",isAuth, chatController.sendMessage);

router.get("/rooms/:chatRoomID/unread-message-count",isAuth, chatController.countUnreadMessage);

router.put("/rooms/:chatRoomID/save-last-read-message",isAuth, chatController.saveLastReadMessage);

router.post("/rooms/:chatRoomID/images",isAuth, chatUpload.single("image"), validateImage, chatController.sendImageMessage);

router.put("/rooms/:chatRoomID/participants",isAuth,chatController.exitChatRoom);

router.put("/rooms/:chatRoomID/invite",isAuth,chatController.invite);

router.put("/rooms/:chatRoomID/kickout",isAuth,chatController.kickout);

router.put("/rooms/:chatRoomID/name",isAuth,chatController.chatName);

export default router;