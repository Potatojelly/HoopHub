import "express-async-errors";
import * as myRepository from "../data/auth.js";
import * as forumRepository from "../data/forum.js";
import ffmpeg from 'fluent-ffmpeg';
import fs from "fs";
import axios from 'axios'; 
import {config} from "../config.js";
import AWS from 'aws-sdk';
import path from 'path'; //

AWS.config.update(config.aws);
const s3 = new AWS.S3();
ffmpeg.setFfmpegPath(config.ff.ffmpeg);
ffmpeg.setFfprobePath(config.ff.ffprobe);

export async function getComments(req,res) {
    const currentPage = req.params.page;
    const commentsPerPage = parseInt(req.params.commentsPerPage);
    const postID = req.params.postID;
    let result = await forumRepository.getComments(postID,currentPage,commentsPerPage);
    if(result) res.status(200).json({ success: true, ...result });
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function createComment(req,res) {
    const userID = req.userID;
    const postID = req.body.post_id;
    const body = req.body.body;
    const result = await forumRepository.createComment({userID,postID,body});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function updateComment(req,res) {
    const commentID = req.params.commentID;
    const postID = req.params.postID;
    const body = req.body.body;
    const result = await forumRepository.updateComment({postID,commentID,body});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function deleteComment(req,res) {
    const commentID = req.params.commentID;
    const postID = req.params.postID;
    const result = await forumRepository.deleteComment({postID,commentID});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function createReply(req,res) {
    const userID = req.userID;
    const postID = req.body.post_id;
    const commentID = req.body.comment_id;
    const body = req.body.body;
    const result = await forumRepository.createReply({userID,postID,commentID,body});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function updateReply(req,res) {
    const commentID = req.params.commentID;
    const replyID = req.params.replyID;
    const postID = req.params.postID;
    const body = req.body.body;
    const result = await forumRepository.updateReply({postID,commentID,replyID,body});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}


export async function deleteReply(req,res) {
    const commentID = req.params.commentID;
    const replyID = req.params.replyID;
    const postID = req.params.postID;
    const body = req.body.body;
    const result = await forumRepository.deleteReply({postID,commentID,replyID});
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}


export async function updateView(req,res) {
    const postID = req.params.postID;
    const result = await forumRepository.updateView(postID);
    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}


export async function getPosts(req,res) {
    const keyword = req.params.keyword === "null" ? null : req.params.keyword;
    const currentPage = req.params.page;
    const postsPerPage = parseInt(req.params.postsPerPage);
    const result = await forumRepository.getPosts(keyword,currentPage,postsPerPage);
    if(result) res.status(200).json({success:true, ...result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function getPost(req,res) {
    const postID = req.params.postID;
    const result = await forumRepository.getPost(postID);
    if(result) res.status(200).json({success:true, post:{...result}});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function deletePost(req,res) {
    const postID = req.params.postID;
    const result = await forumRepository.deletePost(postID);
    if(result === 1) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function createPost(req,res) {
    const user = await myRepository.findById(req.userID);
    const data = JSON.parse(req.body.jsonFile)
    const title = data.title;
    let content = data.content;
    let thumbnailURL = "";

    if( Object.keys(req.files).length > 0) {
        if(req.files.video) {
            const videos = req.files.video.map((element)=>element.location);
            if(videos.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<iframe[^>]*src="blob[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${videos[currentIndex++]}"`);
                });
            }
        }

        if(req.files.image) {
            const images = req.files.image.map((element)=>element.location);
            if(images.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<img[^>]*?src="blob[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${images[currentIndex++]}"`);
                });
            }
        }
    } 

    if(content && content[0].startsWith("<img")) {
        const url = content[0].match(/src="([^"]+)"/);
        thumbnailURL = url[1];
    } else if(content && content[0].startsWith("<iframe")) {
        const url = content[0].match(/src="([^"]+)"/);
        const s3VideoUrl = url[1];
        const outputPath = "public/thumbnails/tempThumbnail.jpg";
        const extension = s3VideoUrl.split(".").pop();
        thumbnailURL = await getThumbnail(s3VideoUrl, outputPath, extension);
    }
    
    const result = await forumRepository.createPost({userID: user.id, title, body: content, thumbnailURL });

    if(result) res.status(200).json({success:true, 
                                    ...result,
                                    nickname: user.nickname,
                                    image_url: user.imageURL,
                                    total_comments:0});
    else res.status(500).json({success:false, imageURL:"Server Error"});
}

export async function updatePost(req,res) {
    const user = await myRepository.findById(req.userID);
    const postID = req.params.postID;
    const post = await forumRepository.getPost(postID);
    const data = JSON.parse(req.body.jsonFile);
    const title = data.title;
    let changeThumbnail = false;
    let content = data.content;
    let thumbnailURL = "";

    if( Object.keys(req.files).length > 0) {
        if(req.files.video) {
            const videos = req.files.video.map((element)=>element.location);
            if(videos.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<iframe[^>]*src="blob[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${videos[currentIndex++]}"`);
                });
            }
        }

        if(req.files.image) {
            const images = req.files.image.map((element)=>element.location);
            if(images.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<img[^>]*?src="blob[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${images[currentIndex++]}"`);
                });
            }
        }
    } 

    // compare 
    const newUrl = []
    const newContent = content.match(/(<iframe[^>]*src="[^"]*"[^>]*>|<img[^>]*src="[^"]*"[^>]*>)/gi);
    if(newContent) {
        newContent.forEach((srcValue)=>{
            const result = srcValue.match(/src="([^"]+)"/);
            newUrl.push(result[1]);
        })
    }

    const oldUrl = [] 
    const oldContent = post.body.match(/(<iframe[^>]*src="[^"]*"[^>]*>|<img[^>]*src="[^"]*"[^>]*>)/gi);
    if(oldContent) {
        oldContent.forEach((srcValue)=>{
            const result = srcValue.match(/src="([^"]+)"/);
            oldUrl.push(result[1]);
        })
    }

    // extract thumbnail
    if(newContent && newContent[0].startsWith("<img")) {
        const url = newContent[0].match(/src="([^"]+)"/);
        thumbnailURL = url[1];
    } else if(newContent && newContent[0].startsWith("<iframe")) {
        const url = newContent[0].match(/src="([^"]+)"/);
        const s3VideoUrl = url[1];
        const outputPath = "public/thumbnails/tempThumbnail.jpg";
        const extension = s3VideoUrl.split(".").pop();
        thumbnailURL = await getThumbnail(s3VideoUrl, outputPath, extension);
    }

    
    const result = await forumRepository.updatePost({postID, title, body: content, thumbnailURL });

    // delete s3
    const toBeDeleted = oldUrl.filter(item => !newUrl.includes(item));

    if(toBeDeleted.length > 0) {
        toBeDeleted.forEach((url)=>{
            s3.deleteObject({Bucket: config.bucket.forum, Key: url},(err,data)=>{
                if (err) {
                    console.error('Failed to delete the file:', err);
                } else {
                    console.log('The file has been deleted.');
                }
            })
        })
    }

    if(post.thumbnail_url) {
        s3.deleteObject({Bucket: config.bucket.forum, Key: post.thumbnail_url},(err,data)=>{
            if (err) {
                console.error('Failed to delete the thumbnail:', err);
            } else {
                console.log('The thumbnail has been deleted.');
            }
        })
    }

    if(result) res.status(200).json({success:true, 
                                    ...result,
                                    nickname: user.nickname,
                                    image_url: user.imageURL,
                                    total_comments:post.total_comments});
    else res.status(500).json({success:false, imageURL:"Server Error"});
}

async function getThumbnail(s3VideoUrl, outputPath, extension) {
    try {
        const response = await axios({
            method: "get",
            url: s3VideoUrl,
            responseType: "stream",
        });

        await response.data.pipe(fs.createWriteStream(`temp_video.${extension}`));
        await new Promise((resolve,reject) => {
            response.data.on("end", () => {
                ffmpeg(`temp_video.${extension}`)
                    .on('end', () => {
                        console.log('Complete extracting thumbnail');
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error('Error:', err);
                        reject();
                    })
                    .screenshot({
                        count: 1,
                        folder: path.dirname(outputPath),
                        filename: path.basename(outputPath),
                    });
            });
        });

        const timestamp = Date.now();
        const customName = "Thumbnail";
        const fileName = timestamp+"-"+customName+".jpg";

        const fileStream = fs.createReadStream(outputPath);
        const uploadParams = {
            Bucket: config.bucket.forum,
            Key: fileName, 
            ACL: "public-read",
            Body: fileStream,
            ContentType: 'image/jpg', 
        };

        const result = await new Promise((resolve,reject) => {
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error('S3 upload error:', err);
                    reject();
                } else {
                    console.log('S3 upload complete:', data.Location);
                    resolve(data.Location);
                }
            });
        });

        

        fs.unlinkSync('temp_video.mp4');
        fs.unlinkSync(outputPath);

        return result;
    } catch(error) {
        console.error('Download error:', error);
        throw error;
    }
}

export async function getUserPosts(req,res) {
    const userNickname = req.params.nickname;
    const currentPage = req.params.currentPage;
    const postsPerPage = req.params.postsPerPage;
    const user =  await myRepository.findByNickname(userNickname);
    const myPosts = await forumRepository.getUserPosts(user.id,currentPage,postsPerPage);
    if(myPosts) res.status(200).json({success:true, ...myPosts});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function getUserComments(req,res) {
    const userNickname = req.params.nickname;
    const currentPage = req.params.currentPage;
    const commentsPerPage = req.params.commentsPerPage;
    const user =  await myRepository.findByNickname(userNickname);
    const myComments = await forumRepository.getUserComments(user.id,currentPage,commentsPerPage);
    if(myComments) res.status(200).json({success:true, ...myComments});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function getTargetCommentNumber(req,res) {
    const userID = req.userID;
    const postID = req.params.postID;
    const commentID = req.params.commentID;
    const comment_number = await forumRepository.getTargetCommentNumber(postID,commentID);
    if(comment_number) res.status(200).json({success:true, comment_number:parseInt(comment_number)});
    else res.status(500).json({success:false, message:"Server Error"});
}



