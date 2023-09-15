import express from "express";
import "express-async-errors";
import {body} from "express-validator";
import {validate} from '../middleware/validator.js';
import * as retrController from "../controller/retr.js";

const router = express.Router();

const validateUsername = [
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
    validate
]

const validateEmail= [
    body("email").isEmail().normalizeEmail().withMessage("invalid email"),
    validate
]

router.post("/username", validateEmail, retrController.retrieveUsername);

router.post("/password", validateUsername, retrController.retrievePassword);

export default router;