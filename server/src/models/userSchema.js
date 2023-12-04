import {mongoose} from "mongoose";
import { useVirtualId } from "../db/database.js";
import {config} from "../config.js";

const userSchema = mongoose.Schema(
    {
        userID: {type:Number},
        nickname: {type:String},
        imageURL: {type:String ,default: config.profile.defaultProfileURL},
    },
)

useVirtualId(userSchema);

const User = mongoose.model("User", userSchema);
export default User;
