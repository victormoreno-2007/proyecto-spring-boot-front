import axios from "axios";

// const API_URL = 'http://localhost:8080/api/v1';
const API_URL = 'https://victor-2007-proeycto-spring-boot.hf.space';

export const api = axios.create({
    baseURL : API_URL,
    headers : {
        'Content-Type': 'application/json',
    }
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem('accessToken');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);