import axios from "./axiosInstance";
export const AddUser  = (data)=> axios.post(`/UserManagement/CreateUser`, data, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
export const UpdateUserById  = (data,id)=> axios.put(`/UserManagement/UpdateUser/${id}`,data);
export const GetUsers = (page =1)=>axios.get(`/UserManagement/Users?page=${page}`);
export const GetUserByID = (id)=> axios.get(`/UserManagement/User/${id}`)
export const DeleteUserByID = (id)=> axios.delete(`/UserManagement/DeleteUser/${id}`)