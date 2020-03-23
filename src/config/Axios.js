import api from '../config/Api';

const axios = require('axios');
axios.defaults.baseURL = api.url;

export default axios;
