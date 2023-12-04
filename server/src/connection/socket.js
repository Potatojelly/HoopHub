import {Server} from "socket.io";
import jwt from "jsonwebtoken";
import {config} from "../config.js";

class Socket {
    constructor(server) {
        const connectedClients = {};

        this.io = new Server(server,{
            cors: {
                origin: [config.origin.clientURL]
            }
        });

        this.io.use((socket,next)=>{
            const token = socket.handshake.auth.token;
            if(!token) {
                return next(new Error("Authentication error"));
            }
            jwt.verify(token, config.jwt.secretKey, (error,decoded)=>{
                if(error) {
                    return next(new Error("Authentication error"))
                }
                next();
            });
        })

        this.io.on("connection",(socket)=>{

            socket.on("setup",(nickname)=>{
                connectedClients[socket.id] = nickname;
                console.log(`Client "${nickname}" connected!`);
                socket.join(nickname);
                socket.emit("connected");
                console.log(connectedClients);
            })

            socket.on("disconnect",()=>{
                const nickname = connectedClients[socket.id];
                socket.leave(nickname);
                if (nickname) {
                    console.log(`Client ${nickname} disconnected.`);
                    delete connectedClients[socket.id]; 
                }
                console.log(connectedClients);
            })

            socket.on("join chat",(room)=>{
                socket.join(room);
                console.log(`${connectedClients[socket.id]} has joined the chat: ${room}`);
            })

            socket.on("new chat room",(newChatRoomReceived)=>{
                newChatRoomReceived.receiver.forEach((user)=>{
                    socket.in(user.nickname).emit("new chat message received",newChatRoomReceived);
                })
            })

            socket.on("new message",(newMessageRecevied)=>{
                const chat = newMessageRecevied.chat;
                chat.users.forEach((user)=>{
                    if(user.nickname === newMessageRecevied.sender.user?.nickname)  return;
                    socket.in(user.nickname).emit("new message received",newMessageRecevied);
                })
            });

            socket.on("exit", (exitMessageRecevied)=>{
                const chat = exitMessageRecevied.chat;
                chat.users.forEach((user)=>{
                    if(user.nickname === exitMessageRecevied.sender.user?.nickname)  return;
                    socket.in(user.nickname).emit("exit message received",exitMessageRecevied);
                })
            });

            socket.on("invite", (inviteMessageRecevied)=>{
                const chat = inviteMessageRecevied.chat;
                chat.users.forEach((user)=>{
                    if(user.nickname === inviteMessageRecevied.sender.user?.nickname)  return;
                    socket.in(user.nickname).emit("invite message received",inviteMessageRecevied);
                })
            });

            socket.on("kickout", (kickoutMessageRecevied)=>{
                const chat = kickoutMessageRecevied.chat;
                chat.users.forEach((user)=>{
                    if(user.nickname === kickoutMessageRecevied.sender.user?.nickname)  return;
                    socket.in(user.nickname).emit("kickout message received",kickoutMessageRecevied);
                })
            });

            
            socket.on("change chat name", (chatNameRecevied)=>{
                const chat = chatNameRecevied.chat;
                chat.users.forEach((user)=>{
                    if(user.nickname === chatNameRecevied.sender.user?.nickname)  return;
                    socket.in(user.nickname).emit("change chat name message received",chatNameRecevied);
                })
            });
        })

    }
}

let socket

export function initSocket(server) {
    if(!socket) {
        socket = new Socket(server);
    }
}

export function getSocketIO() {
    if(!socket) {
        throw new Error("Please call init first");
    }
    return socket.io;
}