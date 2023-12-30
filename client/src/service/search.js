export default class SearchService {
    constructor(http) {
        this.http = http;
    }

    async searchUser(nickname) {
        const data =await this.http.fetch(`users/search?nickname=${nickname}`,{
            method: "GET",
        });
        return data;
    }
}