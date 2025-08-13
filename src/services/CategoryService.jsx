import axios from "./axiosInstance";
export const AddCategory  = (data)=> axios.post(`/Category`, data);
export const UpdateCategoryById  = (data,id)=> axios.put(`/Category/${id}`,data, {
  headers: { "Content-Type": "application/json" }});
export const GetCategorys = (page =1 )=>axios.get(`/Category?page=${page}`);
export const GetCategoryByID = (id)=> axios.get(`/Category/${id}`)
export const DeleteCategoryByID = (id)=> axios.delete(`/Category/delete/${id}`);