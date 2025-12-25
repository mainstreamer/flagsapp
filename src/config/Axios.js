import api from '../config/Api';
const axios = require('axios');

axios.defaults.baseURL = api.url;
// axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

// Add token from localStorage to every request
const token = localStorage.getItem('accessToken');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Intercept requests to always include latest token
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;