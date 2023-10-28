import multerS3 from 'multer-s3';
import multer from "multer";
import AWS from "aws-sdk";
import {config} from "../config.js";

AWS.config.update(config.aws);

const s3 = new AWS.S3();

export const profileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bucket.profile,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req,file,cb) {
            const timestamp = Date.now();
            const customName = "ProfileImg";
            const extension = file.originalname.split(".").pop();
            const fileName = timestamp+"-"+customName+"."+extension;
            cb(null,fileName);
        }, 
    }),
});

export const forumUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bucket.forum,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req,file,cb) {
            console.log("formUPload", file);
            const timestamp = Date.now();
            const customName = "ForumFile";
            const extension = file.originalname.split(".").pop();
            const fileName = timestamp+"-"+customName+"."+extension;
            cb(null,fileName);
        }, 
    }),
});

export const chatUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.bucket.chat,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function(req,file,cb) {
            const timestamp = Date.now();
            const customName = "ChatImg";
            const extension = file.originalname.split(".").pop();
            const fileName = timestamp+"-"+customName+"."+extension;
            cb(null,fileName);
        }, 
    }),
});

