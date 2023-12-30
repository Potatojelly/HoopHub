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

router.get("/posts/:keyword/:page/:postsPerPage",forumController.getPosts);
router.post("/posts", isAuth,  forumUpload.fields([{name:"image"},{name:"video"}]), validateFiles, forumController.createPost );
router.get("/posts/:postID",forumController.getPost);
router.put("/posts/:postID", isAuth, forumUpload.fields([{name:"image"},{name:"video"}]), validateFiles, forumController.updatePost);
router.delete("/posts/:postID", isAuth, forumController.deletePost);

router.post("/comments",isAuth, forumController.createComment);
router.put("/posts/:postID/comments/:commentID",isAuth, forumController.updateComment);
router.delete("/posts/:postID/comments/:commentID",isAuth, forumController.deleteComment);
router.get("/posts/:postID/comments",isAuth, forumController.getComments);

router.post("/replies",isAuth, forumController.createReply);
router.put("/posts/:postID/comments/:commentID/replies/:replyID",isAuth, forumController.updateReply);
router.delete("/posts/:postID/comments/:commentID/replies/:replyID",isAuth, forumController.deleteReply);

router.put("/posts/:postID/views",isAuth, forumController.updateView);

router.get("/users/:nickname/posts/:currentPage/:postsPerPage",isAuth,forumController.getUserPosts);
router.get("/users/:nickname/comments/:currentPage/:commentsPerPage",isAuth,forumController.getUserComments);

router.get("/posts/:postID/comments/:commentID/target-comment-number",isAuth,forumController.getTargetCommentNumber);



export default router;
