import axios from "axios";
import Cookies from "js-cookie";


export const login = async (data) =>{
  const res =  await axios.post(`${import.meta.env.VITE_API_URL}/Account/login`, data);
  const token  = res.data.token
  
  if(token){
    Cookies.set("token", token, { expires: 3 });
  }
  return res.data
}


export const register = (data) => axios.post(`${import.meta.env.VITE_API_URL}/Account/Register`, data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
