export default class SearchService {
    constructor(http) {
        this.http = http;
    }

    async searchUser(nickname) {
        const data =await this.http.fetch(`search/user?nickname=${nickname}`,{
            method: "GET",
        });
        return data;
    }
}