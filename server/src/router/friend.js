import express from "express";
import "express-async-errors";
import * as friendController from "../controller/friend.js";
import {isAuth} from "../middleware/auth.js";

const router = express.Router();

router.get("/get-my-friend", isAuth, friendController.getMyFriend);

router.get("/my-friend-request", isAuth, friendController.getMyFriendRequest);

router.get("/received-friend-request", isAuth, friendController.getReceivedFriendRequest);

router.post("/send-friend-request", isAuth, friendController.sendFriendRequest);

router.delete("/cancel-my-friend-request/:nickname", isAuth, friendController.cancelFriendRequest);

router.put("/accept-friend-request/:nickname", isAuth, friendController.accceptFriendRequest);

router.delete("/reject-friend-request/:nickname", isAuth, friendController.rejectFriendRequest);

router.delete("/delete-friend/:nickname", isAuth, friendController.deleteFriend);

export default router;