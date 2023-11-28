import "express-async-errors";
import * as myRepository from "../data/auth.js";
import * as chatRepository from "../data/chat.js";


export async function getChatRooms(req,res) {
    const userID = req.userID;
    const chats = await chatRepository.getChatRooms(userID);
    if(chats) res.status(200).json({ success: true, chats});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function createChatRoom(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const participants = req.body.participants;
    const users = [user,...participants];
    const chatName = req.body.chatName
    const result = await chatRepository.createChatRoom(users,chatName);
    if(result) res.status(200).json({ success: true, chat:result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function getMessage(req,res) {
    const userID = req.userID;
    const result = await chatRepository.getMessage(req.params.chatRoomID,req.params.offset,userID);
    if(result?.message) res.status(401).json(result);
    if(result) res.status(200).json({ success: true, result, prevOffset: parseInt(req.params.offset)});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function sendMessage(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const result = await chatRepository.sendMessage(user,req.body.content,req.body.chatRoomID,req.body.init);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function sendImageMessage(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const imageURL = req.file.location;
    const data = JSON.parse(req.body.jsonFile);
    const result = await chatRepository.sendImageMessage(user,imageURL,data.chatRoomID,data.isInit);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function countUnreadMessage(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const result = await chatRepository.countUnreadMessage(user,req.params.chatRoomID);
    if(result || result === 0) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function saveLastReadMessage(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const result = await chatRepository.saveLastReadMessage(user,req.body.chatRoomID);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function exitChatRoom(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const result = await chatRepository.exitChatRoom(user,req.params.chatRoomID);
    if(result) res.status(200).json({ success: true});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function invite(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const chatRoomID = req.body.chatRoomID;
    const invitedUsers = req.body.invitedUsers
    const result = await chatRepository.invite(user,invitedUsers,chatRoomID);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function kickout(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const chatRoomID = req.body.chatRoomID;
    const kickedUser= req.body.kickedUser;
    const result = await chatRepository.kickout(user,kickedUser,chatRoomID);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}

export async function chatName(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"User not found"});
    }
    const changedChatName = req.body.chatName;
    const chatRoomID = req.body.chatRoomID;
    const result = await chatRepository.chatName(user,chatRoomID,changedChatName);
    if(result) res.status(200).json({ success: true, result});
    else res.status(500).json({success:false, message:"Server Error"});
}