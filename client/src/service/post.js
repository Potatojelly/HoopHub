export default class PostService {
    constructor(http) {
        this.http = http;
    }

    async getPosts(keyword,page,postsPerPage) {
        const data = await this.http.fetch(`/forum/posts/${keyword}/${page}/${postsPerPage}`, {
            method: "GET"
        });
        return data;
    }

    async getPost(postID) {
        const data = await this.http.fetch(`/forum/posts/${postID}`, {
            method: "GET"
        });
        return data;
    }

    async createPost(formData,signal,uplaodProgressCallback) {
        const data = await this.http.fetch("/forum/posts", {
            method: "POST",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
            signal,
            onUploadProgress: uplaodProgressCallback
        });
        return data;
    }

    async updatePost(formData,postID,signal,uplaodProgressCallback) {
        const data = await this.http.fetch(`/forum/posts/${postID}`, {
            method: "PUT",
            body: formData,
            headers: {"Content-Type": "multipart/form-data"},
            signal,
            onUploadProgress: uplaodProgressCallback
        });
        return data;
    }

    async deletePost(postID) {
        const data = await this.http.fetch(`/forum/posts/${postID}`, {
            method: "DELETE",
        });
        return data;
    }

    async createComment(postID,comment) {
        const data = await this.http.fetch("/forum/comments", {
            method: "POST",
            body: JSON.stringify({
                post_id: postID,
                body: comment, 
            }),
        });
        return data; 
    }

    async updateComment(postID,commentID,comment) {
        const data = await this.http.fetch(`/forum/posts/${postID}/comments/${commentID}`, {
            method: "PUT",
            body: JSON.stringify({
                body: comment, 
            }),
        });
        return data; 
    }

    async deleteComment(postID,commentID) {
        const data = await this.http.fetch(`/forum/posts/${postID}/comments/${commentID}`, {
            method: "DELETE",
        });
        return data; 
    }

    async createReply(postID,commentID,reply) {
        const data = await this.http.fetch("/forum/replies", {
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
        const data = await this.http.fetch(`/forum/posts/${postID}/comments/${commentID}/replies/${replyID}`, {
            method: "PUT",
            body: JSON.stringify({
                body: reply, 
            }),
        });
        return data; 
    }

    async deleteReply(postID,commentID,replyID) {
        const data = await this.http.fetch(`/forum/posts/${postID}/comments/${commentID}/replies/${replyID}`, {
            method: "DELETE",
        });
        return data; 
    }

    async getComments(postID,page,commentsPerPage) {
        const data = await this.http.fetch(`/forum/posts/${postID}/comments?page=${page}&commentsPerPage=${commentsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async updateView(postID) {
        const data = await this.http.fetch(`/forum/posts/${postID}/views`, {
            method: "PUT",
        });
        return data; 
    }

    async getUserPosts(nickname,currentPage,postsPerPage) {
        const data = await this.http.fetch(`/forum/users/${nickname}/posts/${currentPage}/${postsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async getUserComments(nickname,currentPage,commentsPerPage) {
        const data = await this.http.fetch(`/forum/users/${nickname}/comments/${currentPage}/${commentsPerPage}`, {
            method: "GET",
        });
        return data; 
    }

    async getTargetCommentNumber(postID,commentID) {
        const data = await this.http.fetch(`/forum/posts/${postID}/comments/${commentID}/target-comment-number`, {
            method: "GET",
        });
        return data; 
    }
}