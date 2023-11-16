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
        leftUsers: {type:Array, default: null},
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
        groupAdmin: {type:String, default: null},  
        isDeleted: {type:Boolean, default: false},
    },
    {
        timestamps: true,
    }
)

useVirtualId(chatRoomSchema);

const ChatRoom = mongoose.model("ChatRoom",chatRoomSchema);
export default ChatRoom
