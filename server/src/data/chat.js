import ChatRoom from "../models/chatRoomSchema.js"
import Message from "../models/messageSchema.js";
import UserChatRoom from "../models/userChatRoomSchema.js"
import mongoose from 'mongoose';

export async function getChatRooms(userID) {
    try{
        const chatRooms = await ChatRoom.find({
                                        "users": userID,
                                        isDeleted:false,
                                        }).populate("users")
                                        .populate("leftUsers")
                                        .populate({path:"latestMessage",select: "sender content createdAt image"});                             
        if(chatRooms.length === 0) return chatRooms;
        const updatedChatRooms = await Promise.all(
            chatRooms.map(async (chatRoom)=>{
                const userChatRoom = await UserChatRoom.findOne({chat:chatRoom.id, user:userID})
                if(!userChatRoom)  return

                const count = userChatRoom.lastReadMessage !== null  ? 
                                await Message.count({"_id":{"$gt":userChatRoom.lastReadMessage},
                                                    chat:chatRoom.id}) :
                                await Message.count({chat:chatRoom.id}) 

                const updatedChatRoom = {...chatRoom._doc, unReadMessageCount: count, id:chatRoom._doc._id}
                return updatedChatRoom;
            })
        )
        return updatedChatRooms;
    }catch(err) {
        console.log(err);
    }
}

export async function createChatRoom(users,chatName) {
    const session = await mongoose.startSession();
    session.startTransaction();
    let chatRoom;
    try {
        const userIDs = users.map((user)=>user.id);
        chatRoom = await ChatRoom({users:[...userIDs],
                                    chatName,
                                    isGroupChat: chatName ? true : false,
                                    groupAdmin: userIDs.length !== 2 ? users[0].nickname : null}).save({session})

        
        const userChatRoomPromises =users.map(async (user)=> {
            const result = await UserChatRoom({user: user.id,
                                    chat:chatRoom.id}).save({session})
            return result;
        })
        const userChatRoomResults = await Promise.all(userChatRoomPromises);

        if (userChatRoomResults.every(result => !!result)) {
            const messageContent = users.reduce((prev,cur,index)=>{
                if(index===0) return `${cur.nickname} invited `
                if(index===users.length-1) return prev + `${cur.nickname}.`
                return prev + `${cur.nickname}, `
            },"")
            const message = Message({sender:{system:true},
                                        content:messageContent,
                                        chat:chatRoom.id});
            await message.save({session});
            chatRoom.latestMessage = message.id;
            await chatRoom.save();
            await session.commitTransaction();
            session.endSession();
            console.log("Transaction Committed!");
            return chatRoom;
        } else {
            throw new Error("UserChatRoom creation failed");
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction Failed:', error);
        return 
    }
}

export async function getMessage(roomID,offset,userID) {
    const chatRoom = await ChatRoom.findById(roomID).populate("users");
    const verification = chatRoom.users.find((user)=>user.id === userID )
    if(!verification) return {message: "Unauthorized"};
    return Message.find({chat: roomID}).populate("sender.user").skip(parseInt(offset)).sort({createdAt:-1}).limit(20)
    .then((result)=>{ return result.reverse();})
}

export async function sendMessage(user,content,roomID,init) {
    try {
        const chatRoom = await ChatRoom.findById(roomID)
                                        .populate({path:"latestMessage",select: "createdAt"})

        const message = Message({sender: {user:user.id},
                                        content,
                                        isInit:init,
                                        chat:roomID});
        await message.save();

        chatRoom.latestMessage = message.id;
        const latestMessage = await chatRoom.save();

        const userChatRoom = await UserChatRoom.findOne({chat:roomID,
            user:user.id});

        userChatRoom.lastReadMessage = message.id;
        const updatedUserChatRoom = await userChatRoom.save();


        return message;
    } catch (error) {
        console.error(error);
    }
}

export async function sendImageMessage(user,imageURL,roomID,init) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const chatRoom = await ChatRoom.findById(roomID)
                                        .populate({path:"latestMessage",select: "createdAt"})
                                        .session(session);

        const message = Message({sender:{user:user.id},
                                        image:true,
                                        content:imageURL,
                                        isInit:init,
                                        chat:roomID});
        await message.save({session});


        chatRoom.latestMessage = message.id;
        const latestMessage = await chatRoom.save({ session });

        if (latestMessage) {
            await session.commitTransaction();
            session.endSession();
            console.log("Transaction Committed!");
        } else {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction Failed: Update operation failed.");
        }

        return message;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction Failed:', error);
    }
}

export async function countUnreadMessage(user,roomID) {
    try{
        const userChatRoom = await UserChatRoom.findOne({chat:roomID,
            user:user.id});
        const count = await Message.count({"_id":{"$gt":userChatRoom.lastReadMessage},chat:roomID})
        
        return count;
    } catch (err) {
        console.log(err);
    }
}

export async function saveLastReadMessage(user,roomID) {
    try {
        const chatRoom = await ChatRoom.findById(roomID);

        const userChatRoom = await UserChatRoom.findOne({chat:roomID,
            user:user.id});

        if(userChatRoom) {
            userChatRoom.lastReadMessage = chatRoom.latestMessage;
            const updatedUserChatRoom = await userChatRoom.save();
            return updatedUserChatRoom;
        }
    } catch(error) {
        console.log(error);
    }
}

export async function exitChatRoom(user,chatRoomID) {
    const userID = user.id;
    const nickname = user.nickname;
    try {
        const chatRoom = await ChatRoom.findById(chatRoomID).populate("users").populate("leftUsers");

        // leaving message
        const systemMessage = Message({sender:{system:true},
                                        content:`${nickname} left the room`,
                                        chat:chatRoomID});
        await systemMessage.save();

        // update participants
        chatRoom.users = chatRoom.users.filter((user)=>user.id !== userID);
        chatRoom.leftUsers = [...chatRoom.leftUsers,userID]

        if(chatRoom.users.length < 1) chatRoom.isDeleted = true 

        // update the last message
        chatRoom.latestMessage = systemMessage.id;
        await chatRoom.save();

        // update the userChatRoom info
        const userChatRoom = await UserChatRoom.findOne({chat:chatRoomID,user:userID});
        userChatRoom.isDeleted = true;
        await userChatRoom.save();

        return true;
    } catch(error) {
        console.log(error);
    }
}

export async function invite(user,invitedUsers,chatRoomID) {
    try {
        const chatRoom = await ChatRoom.findById(chatRoomID).populate("users").populate("leftUsers");
        
        const userChatRoomPromises =invitedUsers.map(async (user)=> {
            const result = await UserChatRoom({user:user.id,
                                    lastReadMessage:chatRoom.latestMessage,
                                    chat:chatRoom.id}).save()
            return result;
        })

        const userChatRoomResults = await Promise.all(userChatRoomPromises);

        if (userChatRoomResults.every(result => !!result)) {
            const messageContent = invitedUsers.reduce((prev,cur,index)=>{
                if(index===invitedUsers.length-1) return prev + `${cur.nickname}.`
                return prev + `${cur.nickname}, `
            },`${user.nickname} invited `)

            const message = Message({sender:{system:true},
                                        content:messageContent,
                                        chat:chatRoom.id});
            await message.save();

            chatRoom.latestMessage = message.id;
            const userIDs = invitedUsers.map((user)=>user.id)
            chatRoom.users = [...chatRoom.users,...userIDs];
            await chatRoom.save();
            return chatRoom;
        } else {
            throw new Error("Invitation failed");
        }
    } catch (error) {

        console.error('Inivation Failed:', error);
        return 
    }
}

export async function kickout(user,kickedUser,chatRoomID) {
    const chatRoom = await ChatRoom.findById(chatRoomID).populate("users").populate("leftUsers");

    // leaving message
    const systemMessage = Message({sender:{system:true},
                                    content:`${user.nickname} kicked out ${kickedUser.nickname}`,
                                    chat:chatRoomID});
    await systemMessage.save();

    // update participants
    chatRoom.users = chatRoom.users.filter((user)=>user.id !== kickedUser.id);
    const check = chatRoom.leftUsers.find((user)=>user.id===kickedUser.id);
    if(!check) chatRoom.leftUsers = [...chatRoom.leftUsers,kickedUser.id]

    if(chatRoom.users.length < 1) chatRoom.isDeleted = true 

    // update the last message
    chatRoom.latestMessage = systemMessage.id;
    await chatRoom.save();

    const userChatRoom = await UserChatRoom.findOne({chat:chatRoomID,user:kickedUser.id});
    userChatRoom.isDeleted = true;
    await userChatRoom.save();

    return chatRoom;
}

export async function chatName(user,chatRoomID,changedChatName) {
    const chatRoom = await ChatRoom.findById(chatRoomID);

    // leaving message
    const systemMessage = Message({sender:{system:true},
        content:`${user.nickname} changed chat name to ${changedChatName}`,
        chat:chatRoomID});
    await systemMessage.save();

    // update 
    chatRoom.latestMessage = systemMessage.id;
    chatRoom.chatName = changedChatName;
    await chatRoom.save();

    return chatRoom;
}
