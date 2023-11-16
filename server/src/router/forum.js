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
router.put("/update-post/:postID", isAuth, forumUpload.fields([{name:"image"},{name:"video"}]), validateFiles, forumController.updatePost);
router.delete("/delete-post/:postID", isAuth, forumController.deletePost);
router.get("/get-posts/:keyword/:page/:postsPerPage",forumController.getPosts);
router.get("/get-post/:postID",forumController.getPost);

router.post("/create-comment",isAuth, forumController.createComment);
router.put("/update-comment/:postID/:commentID",isAuth, forumController.updateComment);
router.delete("/delete-comment/:postID/:commentID",isAuth, forumController.deleteComment);
router.get("/get-comments/:postID/:page/:commentsPerPage",isAuth, forumController.getComments);

router.post("/create-reply",isAuth, forumController.createReply);
router.put("/update-reply/:postID/:commentID/:replyID",isAuth, forumController.updateReply);
router.delete("/delete-reply/:postID/:commentID/:replyID",isAuth, forumController.deleteReply);

router.put("/update-view/:postID",isAuth, forumController.updateView);

router.get("/get-user-posts/:nickname/:currentPage/:postsPerPage",isAuth,forumController.getUserPosts);
router.get("/get-user-comments/:nickname/:currentPage/:commentsPerPage",isAuth,forumController.getUserComments);

router.get("/get-target-comment-number/:postID/:commentID",isAuth,forumController.getTargetCommentNumber);



export default router;
