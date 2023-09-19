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
        console.log(body);
        const req = {
            url,
            method,
            headers: headers,
            data: body,
        };

        try {
            const res = await this.client(req);
            if(res.status === 401) this.authErrorEventBus.notify("Token has been expired!");
            return res.data;
        } catch(err) {
            throw err.response.data;
        }
    }
}