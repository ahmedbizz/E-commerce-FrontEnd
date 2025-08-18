import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'https://localhost:7137/api',
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
    if (error.response && error.response.status === 401) {
      // توكن منتهي أو غير صالح
      isRedirecting = true;  // منع التوجيه المتكرر
      Cookies.remove("token"); // مسح التوكن
      window.location.href = "/login"; // إعادة توجيه لتسجيل الدخول
    }
    return Promise.reject(error);
  }
);

export default instance;
