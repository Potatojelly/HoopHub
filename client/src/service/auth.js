export default class AuthService {
    constructor(http) {
        this.http = http;
    }

    async signup(email, nickname, username, password) {
        const data = await this.http.fetch("/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                email,
                nickname,
                username, 
                password,
            })
        });
        return data;
    }

    async login(username, password) {
        const data = await this.http.fetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            })
        });
        return data;
    }

    async logout() {
        return this.http.fetch("/auth/logout",{
            method:"POST",
        });
    }

    async resetPassword(username, password, newPassword) {
        const data =await this.http.fetch("/auth/reset-password", {
            method: "PUT",
            body: JSON.stringify({
                username,
                password,
                newPassword,
            })
        });
        return data;
    }

    async me() {
        return this.http.fetch("/auth/me",{
            method:"GET",
        });
    }
    
    async getMyFriendRequest() {
        const data = await this.http.fetch("/auth/my-friend-request", {
            method: "GET"
        });
        return data;
    }

    async getReceivedFriendRequest() {
        const data = await this.http.fetch("/auth/received-friend-request", {
            method: "GET"
        });
        return data;
    }

    async cancelMyFriendRequest(nickname) {
        const data = await this.http.fetch(`/auth/cancel-my-friend-request/${nickname}`,{
            method: "DELETE"
        });
        return data;
    }

    async acceptFriendRequest(nickname) {
        const data = await this.http.fetch(`/auth/accept-friend-request/${nickname}`,{
            method: "PUT"
        })
        return data;
    }

    async rejectFriendRequest(nickname) {
        const data = await this.http.fetch(`/auth/reject-friend-request/${nickname}`,{
            method: "DELETE"
        });
        return data;
    }

    async sendFriendRequest(nickname) {
        const data = await this.http.fetch("/auth/send-friend-request", {
            method: "POST",
            body: JSON.stringify({
                nickname,
            })
        })
        return data;
    }

}