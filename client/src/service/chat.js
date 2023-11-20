export default class ChatService {
    constructor(http,socket) {
        this.http = http;
        this.socket = socket;
    }

    async getMyChatRooms() {
        const data = await this.http.fetch("/chat/get-chat-rooms", {
            method: "GET"
        });
        console.log(data);
        return data;
    }

    async createChatRoom(participants,chatName) {
        console.log(participants);
        console.log(chatName);
        if(chatName === "") chatName = null;
        const data = await this.http.fetch(`/chat/create-chat-room`, {
            method: "POST",
            body: JSON.stringify({participants,chatName})
        });
        return data;
    }

    async exitChatRoom(chatRoomID) {
        const data = await this.http.fetch(`/chat/exit-chat-room/${chatRoomID}`, {
            method: "PUT"
        });
        return data;
    }


    async getMessage(chatRoomID,offset) {
        const data = await this.http.fetch(`/chat/get-message/${chatRoomID}/${offset}`, {
            method: "GET",
        });
        return data;
    }

    async sendMessage(content,chatRoomID,init) {
        const data = await this.http.fetch("/chat/send-message", {
            method: "POST",
            body: JSON.stringify({
                chatRoomID,
                content,
                init,
            })
        });
        return data;
    }

    async sendImageMessage(formData) {
        const data = await this.http.fetch("/chat/send-image-message", {
            method: "POST",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }

    async saveLastReadMessage(chatRoomID) {
        const data = await this.http.fetch("/chat/save-last-read-message", {
            method: "PUT",
            body: JSON.stringify({
                chatRoomID,
            })
        });
        return data;
    }
    async getUnreadMessageNumber(chatRoomID) {
        const data = await this.http.fetch(`/chat/count-unread-message/${chatRoomID}`, {
            method: "GET",
        });
        return data;
    }

    async inviteUsers(chatRoomID,invitedUsers) {
        const data = await this.http.fetch(`/chat/invite`, {
            method: "PUT",
            body: JSON.stringify({
                invitedUsers,
                chatRoomID,
            })
        });
        return data;
    }

    async kickoutUser(kickedUser,chatRoomID) {
        console.log(kickedUser);
        console.log(chatRoomID);
        const data = await this.http.fetch(`/chat/kickout`, {
            method: "PUT",
            body: JSON.stringify({
                kickedUser,
                chatRoomID,
            })
        });
        return data;
    }

    async changeChatName(chatRoomID,chatName) {
        const data = await this.http.fetch(`/chat/chatName`, {
            method: "PUT",
            body: JSON.stringify({
                chatRoomID,
                chatName,
            })
        });
        return data;
    }

    setUp(callback) {
        return this.socket.onSync("setup",callback);
    }

}