import axios from "./axiosInstance";
export const AddSize  = (data)=> axios.post(`/Sizes`, data);
export const UpdateSizeById  = (data,id)=> axios.put(`/Sizes/${id}`,data);
export const GetSizes = (page =1 )=>axios.get(`/Sizes?page=${page}`);
export const GetSizeByID = (id)=> axios.get(`/Sizes/${id}`)
export const DeleteSizeByID = (id)=> axios.delete(`/Sizes/delete/${id}`);