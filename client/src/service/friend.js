export default class FriendService {
    constructor(http) {
        this.http = http;
    }

    async getMyFriend() {
        const data = await this.http.fetch("/friends", {
            method: "GET"
        });
        return data;
    }

    async deleteMyFriend(nickname) {
        const data = await this.http.fetch(`/friends/${nickname}`, {
            method: "DELETE"
        });
        return data;
    }

    async getMyFriendRequest() {
        const data = await this.http.fetch("/friends/requests", {
            method: "GET"
        });
        return data;
    }

    async getReceivedFriendRequest() {
        const data = await this.http.fetch("/friends/requests/received", {
            method: "GET"
        });
        return data;
    }

    async sendFriendRequest(nickname) {
        const data = await this.http.fetch('/friends/requests', {
            method: "POST",
            body: JSON.stringify({
                nickname,
            })
        })
        return data;
    }

    async cancelMyFriendRequest(nickname) {
        const data = await this.http.fetch(`/friends/requests/${nickname}`,{
            method: "DELETE"
        });
        return data;
    }

    async acceptFriendRequest(nickname) {
        const data = await this.http.fetch(`/friends/requests/${nickname}/accept`,{
            method: "PUT"
        })
        return data;
    }

    async rejectFriendRequest(nickname) {
        const data = await this.http.fetch(`/friends/requests/${nickname}/reject`,{
            method: "DELETE"
        });
        return data;
    }
}