import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with the API base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

// You can add interceptors to modify requests or responses globally
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
