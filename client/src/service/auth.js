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

    async me() {
        return this.http.fetch("/auth/me",{
            method:"GET",
        });
    }
}