import express from "express";
import "express-async-errors";
import {isAuth} from "../middleware/auth.js";
import * as userController from "../controller/user.js";

const router = express.Router();

router.get("/user", isAuth, userController.searchUser)

export default router;