import {db} from "../db/database.js";
import User from "../models/userSchema.js"

export async function updateStatusMsg(user) {
    const {username, statusMsg} = user;
    return db.query("UPDATE users SET status_msg=$1 WHERE username=$2",[statusMsg,username])
        .then((result)=>result.rowCount)
        .catch((err)=>console.log(err));
}

export async function updateImage(user) {
    const {username, mongoID, imageURL} = user;
    const updatedUser = await User.findById(mongoID);
    updatedUser.imageURL = imageURL;
    updatedUser.save();
    return db.query("UPDATE users SET image_url=$1 WHERE username=$2",[imageURL,username])
        .then((result)=>result.rowCount)
        .catch((err)=>console.log(err));
}



