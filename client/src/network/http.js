import axios from "axios";

export default class HttpClient {
    constructor(baseURL,authErrorEventBus) {
        this.client = axios.create({
            baseURL: baseURL,
            headers: {"Content-Type": "application/json"},
            withCredentials:true,
        })
        this.authErrorEventBus = authErrorEventBus;
    }

    async fetch(url, options) {
        const {body, method, headers} = options;
        console.log(url);
        const req = {
            url,
            method,
            headers: headers,
            data: body,
        };

        try {
            const res = await this.client(req);
            return res.data;
        } catch(err) {
            if(err.response.status === 401) {
                console.log(err);
                console.log(err.response.data.message);
                if(err.response.data.message === "Authentication Error") this.authErrorEventBus.notify(
                    "Your login session has expired. Please log in again.");
                throw err.response.data;
            }
            throw err.response.data;
        }
    }
}