import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "express-async-errors";
import * as myRepository from "../data/auth.js";
import {config} from "../config.js";

export async function signup(req,res) {
    let errors = {};

    const {email, nickname, username, password} = req.body;
    const emailUser = await myRepository.findByEmail(email);
    const usernameUser = await myRepository.findByUsername(username);
    const nicknameUser =  await myRepository.findByNickname(nickname);

    if(emailUser) errors.email = "The email address has already been used";
    if(usernameUser) errors.username = "The username has already been used";
    if(nicknameUser) errors.nickname = "The nickname has already been used";

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors)
    }

    const hashed = await bcrypt.hash(password,parseInt(config.bcrpyt.saltRounds));
    const userID = await myRepository.createUser({
        email,
        nickname,
        username,
        password: hashed,
    });
    if(userID) {
        const result = await myRepository.createUserProfile(userID,nickname);
        if(result) res.status(201).json({username});
    } 
    else res.status(500).json({message:"Server Error"});
}

export async function login(req,res) {
    const {username, password} = req.body;
    const user = await myRepository.findByUsername(username);
    if(!user) {
        return res.status(401).json({username: "Invalid username"});
    }

    const isValidPassword = await bcrypt.compare(password,user.password);
    if(!isValidPassword) {
        return res.status(401).json({password: "Invalid password"});
    }

    const token = createJwtToken(user.id);
    setToken(res,token);
    res.status(201).json({token,username,imageURL:user.imageURL,statusMsg:user.statusMsg, nickname:user.nickname});
}

export async function logout(req,res) {
    res.cookie("token","");
    res.status(200).json({message:"User has been logged out"});
}

export async function resetPassword(req,res) {
    const {username, password, newPassword} = req.body;

    const user = await myRepository.findByUsername(username);
    if(!user) {
        return res.status(401).json({username: "Invalid username"});
    }

    const isValidPassword = await bcrypt.compare(password,user.password);
    if(!isValidPassword) {
        return res.status(401).json({password: "Invalid current password"});
    }

    const hashed = await bcrypt.hash(newPassword,parseInt(config.bcrpyt.saltRounds));
    const result = await myRepository.resetPassword({username, newPassword:hashed});

    if (result) res.status(200).json({username,message:"Reset Password Success"});
    else res.status(500).json({message:"Server Error"});
}

export async function me(req,res) {
    const user = await myRepository.findById(req.userID);
    if(!user) {
        return res.status(401).json({message:"Token has expired"});
    }
    res.status(200).json({token:req.token, username:user.username});
}

function createJwtToken(id) {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: parseInt(config.jwt.expireInSec)});
}

function setToken(res, token) {
    const options = {
        maxAge: parseInt(config.jwt.expireInSec) * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }
    res.cookie("token",token,options)
}