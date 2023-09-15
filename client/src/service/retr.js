export default class RetrieveService {
    constructor(http) {
        this.http = http;
    }

    async retrieveUsername(email) {
        const data = await this.http.fetch("/retrieve/username",{
            method: "POST",
            body: JSON.stringify({
                email,
            })
        });
        return data;
    }

    async retrievePassword(username) {
        const data = await this.http.fetch("/retrieve/password",{
            method: "POST",
            body: JSON.stringify({
                username,
            })
        });
        return data;
    }
}