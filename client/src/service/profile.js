export default class ProfileService {
    constructor(http) {
        this.http = http;
    }

    async getProfile() {
        const data = await this.http.fetch("/profile/get-profile", {
            method: "GET",
        });
        return data;
    }

    async getUserProfile(nickname) {
        const data = await this.http.fetch(`/profile/get-profile/${nickname}`, {
            method: "GET",
        });
        return data;
    }

    async updateStatusMsg(statusMsg) {
        const data = await this.http.fetch("/profile/update-status-message", {
            method: "PUT",
            body: JSON.stringify({
                statusMsg,
            })
        });
        return data;
    }

    async updateProfileImg(formData) {
        const data = this.http.fetch("/profile/update-image", {
            method: "PUT",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }

}