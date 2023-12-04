import {mongoose} from "mongoose";
import { useVirtualId } from "../db/database.js";

const userChatRoomSchema = mongoose.Schema(
    {
        user: {type:mongoose.Schema.Types.ObjectId, ref: "User"},
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        lastReadMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null},
        isDeleted: {type:Boolean, default: false},
    },
    {
        timestamps: true,
    }
)

useVirtualId(userChatRoomSchema);

const UserChatRoom = mongoose.model("UserChatRoom", userChatRoomSchema);
export default UserChatRoom;
