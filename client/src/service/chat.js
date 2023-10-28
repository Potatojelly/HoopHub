export default class ChatService {
    constructor(http) {
        this.http = http;
    }

    async getMyChatRooms() {
        const data = await this.http.fetch("/chat/get-chat-rooms", {
            method: "GET"
        });
        console.log(data);
        return data;
    }

    async createChatRoom(opponentID) {
        const data = await this.http.fetch(`/chat/create-chat-room/${opponentID}`, {
            method: "POST"
        });
        return data;
    }

    async getMessage(chatRoomID,page) {
        const data = await this.http.fetch(`/chat/get-message/${chatRoomID}/${page}`, {
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

    async saveLastReadMessage(chatRoomID,lastReadMessage) {
        const data = await this.http.fetch("/chat/save-last-read-message", {
            method: "PUT",
            body: JSON.stringify({
                chatRoomID,
                lastReadMessage,
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

}