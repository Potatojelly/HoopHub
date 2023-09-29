import "express-async-errors";
import * as myRepository from "../data/auth.js";
import * as friendRepository from "../data/friend.js";

export async function getMyFriend(req,res) {
    const result = await friendRepository.getMyFriend(req.userID);

    if(result) res.status(200).json({success:true, myFriend:result});
    else res.status(500).json({success:false, myRequest:"Server Error"});
}

export async function getMyFriendRequest(req,res) {
    const result = await friendRepository.getMyFriendRequest(req.userID);

    if(result) res.status(200).json({success:true, myRequest:result});
    else res.status(500).json({success:false, myRequest:"Server Error"});
}

export async function getReceivedFriendRequest(req,res) {
    const result = await friendRepository.getReceivedFriendRequest(req.userID);

    if(result) res.status(200).json({success:true, receivedRequest:result});
    else res.status(500).json({success:false, receivedRequest:"Server Error"});
}

export async function sendFriendRequest(req,res) {
    const user = await myRepository.findByNickname(req.body.nickname);
    const checkDuplicated = await friendRepository.findFriendRequest(req.userID,user.id);
    if(checkDuplicated) return res.status(403).json({success:false,message:"Already Friends OR Requested"});

    const result = await friendRepository.sendFriendRequest(req.userID,user.id);

    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function cancelFriendRequest(req,res) {
    const user = await myRepository.findByNickname(req.params.nickname);
    const result = await friendRepository.cancelFriendRequest(req.userID,user.id);

    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false,message:"Server Error"});
}

export async function accceptFriendRequest(req,res) {
    const user = await myRepository.findByNickname(req.params.nickname);
    const result = await friendRepository.acceptFriendRequest(req.userID,user.id);
    if(!result) res.status(500).json({success:false,message:"Server Error"});

    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false,message:"Server Error"});
}

export async function rejectFriendRequest(req,res) {
    const user = await myRepository.findByNickname(req.params.nickname);
    const result = await friendRepository.rejectFriendRequest(req.userID,user.id);

    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false,message:"Server Error"});
}

export async function deleteFriend(req,res) {
    const user = await myRepository.findByNickname(req.params.nickname);
    const result = await friendRepository.deleteFriend(req.userID,user.id);

    if(result) res.status(200).json({success:true});
    else res.status(500).json({success:false,message:"Server Error"});
}