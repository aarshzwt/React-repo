import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Sending token:', token); 
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error('Request failed, please try again.');
    return Promise.reject(error);
  }
);

export default axiosInstance;
