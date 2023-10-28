import {mongoose} from "mongoose";
import { useVirtualId } from "../db/database.js";
import { Timestamp } from 'mongodb';

const messageSchema = mongoose.Schema(
    {
        sender: {
            system: {type: Boolean, default: false},
            id: {type:Number},
            nickname: {type:String},
            imageURL: {type:String},
        },
        isInit: {type: Boolean},
        image: {type:Boolean, default: false},
        content: {type:String, trim: true},
        chat: {type: mongoose.Schema.Types.ObjectID,ref: "Chat"}

    },
    {
        timestamps: true,
    }
)

useVirtualId(messageSchema);
const Message = mongoose.model("Message",messageSchema)
export default Message;