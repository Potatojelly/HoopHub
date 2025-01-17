import express from "express";
import "express-async-errors";
import {body} from "express-validator";
import {validate} from '../middleware/validator.js';
import * as authController from "../controller/auth.js";
import {isAuth} from "../middleware/auth.js";

const router = express.Router();

const validateResetPassword = [
    body("password")
        .trim()
        .isLength({min: 5}) .withMessage("password should be at least 5 characters"),
    body("newPassword")
        .trim()
        .isLength({min: 5}) .withMessage("password should be at least 5 characters"),
    validate
]

const validateLogin = [
    body("username")
        .trim()
        .notEmpty()
        .isLength({min: 5}).withMessage("username should be at least 5 characters")
        .isLength({max : 20}).withMessage("nickname can be up to 20 characters")
        .custom((value)=>{
            if (/[!@#$%^&*(),.?":{}|<>]/.test(value) || /\s/.test(value)) {
                throw new Error("username cannot contain special characters or spaces");
            }
            return true;
        }),
    body("password")
        .trim()
        .isLength({min: 5}) .withMessage("password should be at least 5 characters"),
    validate
]

const validateSignup = [
    body("email").isEmail().normalizeEmail().withMessage("invalid email"),
    body("nickname")
        .isLength({min : 5}).withMessage("nickname should be at least 5 characters")
        .isLength({max : 20}).withMessage("nickname can be up to 20 characters")
        .custom((value)=>{
            if (/[!@#$%^&*(),.?":{}|<>]/.test(value) || /\s/.test(value)) {
                throw new Error("nickname cannot contain special characters or spaces");
            }
            return true;
        }),
    ...validateLogin,
]

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateLogin, authController.login);

router.post("/logout", authController.logout);

router.get("/me", isAuth, authController.me);

router.put("/password/reset", validateResetPassword, authController.resetPassword);


export default router;
