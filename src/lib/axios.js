import Axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axios = Axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  withCredentials: true
});

export default axios;
