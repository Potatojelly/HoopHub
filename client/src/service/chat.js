export default class ChatService {
    constructor(http,socket) {
        this.http = http;
        this.socket = socket;
    }

    async getMyChatRooms() {
        const data = await this.http.fetch("/chat/rooms", {
            method: "GET"
        });
        return data;
    }

    async createChatRoom(participants,chatName) {
        if(chatName === "") chatName = null;
        const data = await this.http.fetch(`/chat/rooms`, {
            method: "POST",
            body: JSON.stringify({participants,chatName})
        });
        return data;
    }

    async exitChatRoom(chatRoomID) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/participants`, {
            method: "PUT"
        });
        return data;
    }


    async getMessage(chatRoomID,offset) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/messages/${offset}`, {
            method: "GET",
        });
        return data;
    }

    async sendMessage(content,chatRoomID,init) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/messages`, {
            method: "POST",
            body: JSON.stringify({
                content,
                init,
            })
        });
        return data;
    }

    async sendImageMessage(formData,chatRoomID) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/images`, {
            method: "POST",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }

    async saveLastReadMessage(chatRoomID) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/save-last-read-message`, {
            method: "PUT",
        });
        return data;
    }
    async getUnreadMessageNumber(chatRoomID) {
        const data = await this.http.fetch(`/rooms/${chatRoomID}/unread-message-count`, {
            method: "GET",
        });
        return data;
    }

    async inviteUsers(chatRoomID,invitedUsers) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/invite`, {
            method: "PUT",
            body: JSON.stringify({
                invitedUsers,
            })
        });
        return data;
    }

    async kickoutUser(kickedUser,chatRoomID) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/kickout`, {
            method: "PUT",
            body: JSON.stringify({
                kickedUser,
            })
        });
        return data;
    }

    async changeChatName(chatRoomID,chatName) {
        const data = await this.http.fetch(`/chat/rooms/${chatRoomID}/name`, {
            method: "PUT",
            body: JSON.stringify({
                chatName,
            })
        });
        return data;
    }

    setUp(callback) {
        return this.socket.onSync("setup",callback);
    }

}