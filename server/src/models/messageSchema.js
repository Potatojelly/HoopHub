import {mongoose} from "mongoose";
import { useVirtualId } from "../db/database.js";

const messageSchema = mongoose.Schema(
    {
        sender: {
            system: {type: Boolean, default: false},
            user: {type:mongoose.Schema.Types.ObjectId, ref: "User",default:null},
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