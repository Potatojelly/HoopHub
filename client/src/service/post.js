export default class PostService {
    constructor(http) {
        this.http = http;
    }

    async getPosts(keyword,page,postsPerPage) {
        const data = await this.http.fetch(`/forum/get-posts/${keyword}/${page}/${postsPerPage}`, {
            method: "GET"
        });
        return data;
    }

    async getPost(postID) {
        const data = await this.http.fetch(`/forum/get-post/${postID}`, {
            method: "GET"
        });
        return data;
    }

    async createPost(formData) {
        const data = await this.http.fetch("/forum/create-post", {
            method: "POST",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }

    async updatePost(formData,postID) {
        const data = await this.http.fetch(`/forum/update-post/${postID}`, {
            method: "PUT",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        return data;
    }

    async deletePost(postID) {
        const data = await this.http.fetch(`/forum/delete-post/${postID}`, {
            method: "DELETE",
        });
        return data;
    }

    async createComment(postID,comment) {
        const data = await this.http.fetch("/forum/create-comment", {
            method: "POST",
            body: JSON.stringify({
                post_id: postID,
                body: comment, 
            }),
        });
        return data; 
    }

    async updateComment(postID,commentID,comment) {
        const data = await this.http.fetch(`/forum/update-comment/${postID}/${commentID}`, {
            method: "PUT",
            body: JSON.stringify({
                body: comment, 
            }),
        });
        return data; 
    }

    async deleteComment(postID,commentID) {
        const data = await this.http.fetch(`/forum/delete-comment/${postID}/${commentID}`, {
            method: "DELETE",
        });
        return data; 
    }

    async createReply(postID,commentID,reply) {
        const data = await this.http.fetch("/forum/create-reply", {
            method: "POST",
            body: JSON.stringify({
                post_id: postID,
                comment_id: commentID,
                body: reply, 
            }),
        });
        return data; 
    }

    async updateReply(postID,commentID,replyID,reply) {
        const data = await this.http.fetch(`/forum/update-reply/${postID}/${commentID}/${replyID}`, {
            method: "PUT",
            body: JSON.stringify({
                body: reply, 
            }),
        });
        return data; 
    }

    async deleteReply(postID,commentID,replyID) {
        const data = await this.http.fetch(`/forum/delete-reply/${postID}/${commentID}/${replyID}`, {
            method: "DELETE",
        });
        return data; 
    }

    async getComments(postID,page,commentsPerPage) {
        const data = await this.http.fetch(`/forum/get-comments/${postID}/${page}/${commentsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async updateView(postID) {
        const data = await this.http.fetch(`/forum/update-view/${postID}`, {
            method: "PUT",
        });
        return data; 
    }

    async getUserPosts(nickname,currentPage,postsPerPage) {
        const data = await this.http.fetch(`/forum/get-user-posts/${nickname}/${currentPage}/${postsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async getUserComments(nickname,currentPage,commentsPerPage) {
        const data = await this.http.fetch(`/forum/get-user-comments/${nickname}/${currentPage}/${commentsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async getTargetCommentNumber(postID,commentID) {
        const data = await this.http.fetch(`/forum/get-target-comment-number/${postID}/${commentID}`, {
            method: "GET",
        });
        return data; 
    }
}