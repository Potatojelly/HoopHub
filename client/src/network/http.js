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
        const {body, method, headers, signal, onUploadProgress} = options;
        console.log(url);
        const req = {
            url,
            method,
            headers: headers,
            data: body,
            signal,
            onUploadProgress,
        };

        try {
            const res = await this.client(req);
            return res.data;
        } catch(err) {;
            if(axios.isCancel(err)) throw err.name;
            if(err.response.status === 401) {
                if(err.response.data.message === "Authentication Error") this.authErrorEventBus.notify(
                    "Your login session has expired. Please log in again.");
                throw err.response.data;
            }
            throw err.response.data;
        }
    }
}