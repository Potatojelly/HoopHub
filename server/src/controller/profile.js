import bcrypt from "bcrypt";
import "express-async-errors";
import * as myRepository from "../data/auth.js";
import * as profileRepository from "../data/profile.js";
import {config} from "../config.js";

export async function getProfile(req,res) {
    const user = await myRepository.findById(req.userID);

    if(user) res.status(200).json({
                                    success:true,
                                    nickname:user.nickname,
                                    statusMsg:user.statusMsg, 
                                    imageURL:user.imageURL,
                                    message:"Update Status Message Success"});
    else res.status(500).json({sucess:false, message:"Server Error"});
}

export async function updateStatusMsg(req,res) {
    const user = await myRepository.findById(req.userID);
    const {statusMsg} = req.body;

    const result = await profileRepository.updateStatusMsg({username:user.username, statusMsg});

    if(result) res.status(200).json({success:true, message:"Update Status Message Success"});
    else res.status(500).json({success:false, statusMsg:"Server Error"});
}

export async function updateImage(req,res) {
    const user = await myRepository.findById(req.userID);
    console.log(user.username);
    const imageURL = req.file.location;

    const result = await profileRepository.updateImage({username:user.username, imageURL});

    if(result) res.status(200).json({success:true, message:"Update Profile Image Success"});
    else res.status(500).json({success:false, imageURL:"Server Error"});
}
