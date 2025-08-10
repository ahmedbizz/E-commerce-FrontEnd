import axios from "axios";
const API_URL = "https://localhost:7137";


export const login = async (data) =>{
  const res =  await axios.post(`${API_URL}/api/Account/login`, data);
  const token  = res.data.token

  if(token){
    localStorage.setItem('token',token);
  }
  return res.data
}


export const register = (data) => axios.post(`${API_URL}/api/Account/Register`, data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
