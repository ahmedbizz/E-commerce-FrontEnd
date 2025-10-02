import axios from "axios";
const API_URL = "https://localhost:5013";
import Cookies from "js-cookie";


export const login = async (data) =>{
  const res =  await axios.post(`${API_URL}/api/Account/login`, data);
  const token  = res.data.token
  
  if(token){
    Cookies.set("token", token, { expires: 3 });
  }
  return res.data
}


export const register = (data) => axios.post(`${API_URL}/api/Account/Register`, data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
