import axios from 'axios'

export default {
    install: (app, options) => {
        const axiosInstance = axios.create({
            baseURL: options.baseUrl,
            headers: {
                Authorization: options.token ? `Bearer ${options.token}` : '',
            }
        });

        app.provide('axios', axiosInstance);
    }
}