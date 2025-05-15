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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
          const { token } = response.data;

          localStorage.setItem('token', token);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          toast.error('Session expired. Please login again.');
          return Promise.reject(error);
        }
      }else{
        toast.error('Session expired. Please login again.');
        return Promise.reject(error);
      }

    }
    return Promise.reject(error)
  },
)

export default axiosInstance;
