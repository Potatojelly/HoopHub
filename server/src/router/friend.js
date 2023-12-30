import express from "express";
import "express-async-errors";
import * as friendController from "../controller/friend.js";
import {isAuth} from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuth, friendController.getMyFriend);

router.get("/requests", isAuth, friendController.getMyFriendRequest);

router.get("/requests/received", isAuth, friendController.getReceivedFriendRequest);

router.post("/requests", isAuth, friendController.sendFriendRequest);

router.delete("/requests/:nickname", isAuth, friendController.cancelFriendRequest);

router.put("/requests/:nickname/accept", isAuth, friendController.accceptFriendRequest);

router.delete("/requests/:nickname/reject", isAuth, friendController.rejectFriendRequest);

router.delete("/:nickname", isAuth, friendController.deleteFriend);

export default router;