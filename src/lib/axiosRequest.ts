import axios from 'axios';

const AUTH_SERVER_HOST =
    import.meta.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_AUTH_SERVER_HOST_PROD
        : import.meta.env.VITE_AUTH_SERVER_HOST_PROD;

export class AxiosRequest {
    static post = async (url, params, options?) => {
        console.log(`dam url : `, `${AUTH_SERVER_HOST}${url}`);
        return axios.post(`${AUTH_SERVER_HOST}${url}`, params, options);
    };
}
