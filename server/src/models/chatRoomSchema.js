import {mongoose} from "mongoose";
import { useVirtualId } from '../db/database.js';

const chatRoomSchema = mongoose.Schema(
    {
        chatName: {type:String, default: null, trim:true},
        isGroupChat: {type: Boolean, default: false},
        users: [
            {
                id: {type:Number},
                nickname: {type:String},
                imageURL: {type:String},
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
        groupAdmin: {type:String, default: null},  
    },
    {
        timestamps: true,
    }
)

useVirtualId(chatRoomSchema);

const ChatRoom = mongoose.model("ChatRoom",chatRoomSchema);
export default ChatRoom
