import {mongoose} from "mongoose";
import { useVirtualId } from "../db/database.js";

const userChatRoomSchema = mongoose.Schema(
    {
        user: {
            id: {type:Number},
            nickname: {type:String},
            imageURL: {type:String},
        },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
        lastReadMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null},

    },
    {
        timestamps: true,
    }
)

useVirtualId(userChatRoomSchema);

const UserChatRoom = mongoose.model("UserChatRoom", userChatRoomSchema);
export default UserChatRoom;
