import "express-async-errors";
import * as myRepository from "../data/auth.js";
import * as forumRepository from "../data/forum.js";
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from "ffprobe-static";
import fs from "fs";
import axios from 'axios'; 
import {config} from "../config.js";
import AWS from 'aws-sdk';
import path from 'path'; //

AWS.config.update(config.aws);
const s3 = new AWS.S3();
ffmpeg.setFfmpegPath(config.ff.ffmpeg);
ffmpeg.setFfprobePath(config.ff.ffprobe);

export async function createPost(req,res) {
    const user = await myRepository.findById(req.userID);
    // console.log(req.userID);
    console.log(req.files);
    const data = JSON.parse(req.body.jsonFile)
    console.log(data);
    const title = data.title;
    let content = data.content;
    let thumbnailURL = "";

    if(req.files) {
        if(data.video === true) {
            const  s3VideoUrl = req.files.video[0].location
            const outputPath = `public/thumbnails/${req.files.video[0].originalname}`.replace(/\.[^.]+$/, '.jpg');
            const extension = req.files.video[0].originalname.split(".").pop();
            thumbnailURL = await getThumbnail(s3VideoUrl, outputPath, extension);
            console.log(thumbnailURL);
        }
        else {
            thumbnailURL = req.files.image[0].location;
        }

        if(req.files.video) {
            const videos = req.files.video.map((element)=>element.location);

            if(videos.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<iframe[^>]*src="[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${videos[currentIndex++]}"`);
                });
            }
        }

        if(req.files.image) {
            const images = req.files.image.map((element)=>element.location);

            if(images.length > 0) {
                let currentIndex = 0;
                content = content.replace(/<img[^>]*?src="[^"]*"[^>]*>/gi, (match) => {
                    return match.replace(/src="([^"]*)"/i, `src="${images[currentIndex++]}"`);
                });
            }
        }
    }

    
    const result = await forumRepository.createPost({userID: user.id, title, body: content, thumbnailURL, nickname: user.nickname });

    if(result) res.status(200).json({success:true, 
                                    message:"Create a Post Success",
                                    createdAt: Date.now(),
                                    title,
                                    content,
                                    thumbnailURL,
                                    nickname: user.nickname,
                                    imageURL: user.imageURL});
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
