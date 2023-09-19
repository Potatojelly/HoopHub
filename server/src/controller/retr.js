import "express-async-errors";
import bcrypt from "bcrypt";
import * as myRepository from "../data/auth.js";
import nodemailer from "nodemailer";
import {config} from "../config.js";

export async function retrieveUsername(req, res) {
    const {email} = req.body;

    const user = await myRepository.findByEmail(email);
    if(!user) {
        return res.status(401).json({success:false, email:"There is no account with this email"})
    }

    const content = {
        from: config.mail.auth.user,
        to: email,
        subject: 'Your "Forgot My Username" Request',
        html: getHTMLForm("username",user.username),
    };

    const result = await transporter.sendMail(content);
    if(result.accepted[0]) return res.status(200).json(({success:true, message:`Your username has sent to ${email}`}))
    else return res.status(500).json(({success:false, message:"Server Error"}));
}

export async function retrievePassword(req,res) {
    const {username} = req.body;

    const user = await myRepository.findByUsername(username);

    if(!user) {
        return res.status(401).json({success:false, username:"There is no account with this username"});
    }

    const tempPassword = generateTemporaryPassword();
    const hashed = await bcrypt.hash(tempPassword,parseInt(process.env.BYCRYPT_SALT_ROUNDS));
    const result = await myRepository.resetPassword({username,newPassword:hashed});

    if(result) {
        const content = {
            from: config.mail.auth.user,
            to: user.email,
            subject: 'Your "Forgot My Password" Request',
            html: getHTMLForm("temporary password",tempPassword),
        };
        const mailResult = await transporter.sendMail(content);
        if(mailResult) return res.status(200).json({success:true, message:`Your temporary password has sent to ${user.email}`})
    }

    return res.status(500).json(({success:false, message:"Server Error"}))
}

const generateTemporaryPassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
    }
    return randomString;
}
const transporter = nodemailer.createTransport(config.mail);

const getHTMLForm = (target,value) => {
    return `
        <head>
            <style>
                .orange-box {
                    border: 2px solid orange;
                    padding: 10px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="orange-box">Your ${target} is <span style="font-weight: bold;">${value}</span></div>
        </body>
    `
}