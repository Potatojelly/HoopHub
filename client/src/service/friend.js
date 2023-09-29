export default class FriendService {
    constructor(http) {
        this.http = http;
    }

    async getMyFriend() {
        const data = await this.http.fetch("/friend/get-my-friend", {
            method: "GET"
        });
        return data;
    }

    async deleteMyFriend(nickname) {
        const data = await this.http.fetch(`/friend/delete-friend/${nickname}`, {
            method: "DELETE"
        });
        return data;
    }

    async getMyFriendRequest() {
        const data = await this.http.fetch("/friend/my-friend-request", {
            method: "GET"
        });
        return data;
    }

    async getReceivedFriendRequest() {
        const data = await this.http.fetch("/friend/received-friend-request", {
            method: "GET"
        });
        return data;
    }

    async sendFriendRequest(nickname) {
        const data = await this.http.fetch("/friend/send-friend-request", {
            method: "POST",
            body: JSON.stringify({
                nickname,
            })
        })
        return data;
    }

    async cancelMyFriendRequest(nickname) {
        const data = await this.http.fetch(`/friend/cancel-my-friend-request/${nickname}`,{
            method: "DELETE"
        });
        return data;
    }

    async acceptFriendRequest(nickname) {
        const data = await this.http.fetch(`/friend/accept-friend-request/${nickname}`,{
            method: "PUT"
        })
        return data;
    }

    async rejectFriendRequest(nickname) {
        const data = await this.http.fetch(`/friend/reject-friend-request/${nickname}`,{
            method: "DELETE"
        });
        return data;
    }
}