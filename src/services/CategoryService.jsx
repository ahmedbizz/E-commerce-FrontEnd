import axios from "./axiosInstance";
export const AddCategory  = (data)=> axios.post(`/Category`, data);
export const UpdateCategoryById  = (data,id)=> axios.put(`/Category/${id}`,data);
export const GetCategorys = ()=>axios.get('/Category');
export const GetCategoryByID = (id)=> axios.get(`/Category/${id}`)
export const DeleteCategoryByID = (id)=> axios.delete(`/Category/delete/${id}`)