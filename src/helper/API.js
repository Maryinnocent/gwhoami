//const { default: axios } = require("axios");

import axios from "axios";

const Instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json"
    }
});

// Instance.interceptors.request.use((config) => {
//     config.headers['Content-Type'] = 'application/json';
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export const apiPostCall = (path, params) => {
    return Instance.post(path, params).then(res => res.data)
    .catch(Err => {
        return {isError: true, Error: Err}
    });
}

export const qPostCall = (path, params) => {
     return Instance.post(path, params).then(res => res.data);
}


export const apiGetCall = (path, params) => {
    return Instance.get(path, {params: {...params}}).then(res => res.data)
    .catch(Err => {
        return {isError: true, Error: Err}
    });
}