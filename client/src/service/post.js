export default class PostService {
    constructor(http) {
        this.http = http;
    }

    async createPost(formData) {
        const data = await this.http.fetch("/forum/create-post", {
            method: "POST",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }
}