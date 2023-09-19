import "express-async-errors";
import * as userRepository from "../data/user.js";

export async function searchUser(req,res) {
    const nickname = req.query.nickname;
    const userID = req.userID;

    const result = await userRepository.searchUser({userID,nickname});

    if(!result) res.status(500).json({success: false, message:"Server Error"});

    if(result.length > 0) res.status(201).json({sucess: true, data:result});
    else if(result.length === 0) res.status(404).json({sucess: false, message:"Invalid User(s)"});
}