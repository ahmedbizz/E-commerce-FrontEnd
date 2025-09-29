import axios from 'axios';
import Cookies from 'js-cookie';
let isRedirecting = false;
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});
// إضافة التوكن لكل request
instance.interceptors.request.use(config => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor لفحص الردود
instance.interceptors.response.use(
  response => response,
  error => {
  
    if (error.response && error.response.status === 401 && !isRedirecting) {
      if (window.location.pathname !== "/login") {
        isRedirecting = true;
        Cookies.remove("token");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
