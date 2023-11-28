import socket from "socket.io-client";
import { fetchToken } from '../context/AuthContext';

const baseURL = process.env.REACT_APP_BASE_URL;
const getAccessToken = ()=>fetchToken();

export default class Socket {
    constructor() {
        this.io = socket(baseURL, {
            auth: (cb) => cb({token: getAccessToken()}),
        })

        this.io.on("setup",(socket)=>{
        })

        this.io.on("connect_error",(error)=>{
            console.log("socket error",error.message);
        });
    }

    onSync(event, callback) {
        if(!this.io.connected) {
            this.io.connect();
        }

        this.io.on(event,(message)=>callback(message));
        return () => this.io.off(event);
    }
}

let chatSocket 

export function initSocket() {
    if(!chatSocket) {
        chatSocket = new Socket();
        chatSocket.io.on("disconnect", () => {
            chatSocket = null;
        });
    }
}

export function getSocketIO() {
    if(!chatSocket) {
        throw new Error("Please call init first");
    }
    return chatSocket.io;
}