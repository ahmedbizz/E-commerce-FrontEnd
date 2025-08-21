import axios from "./axiosInstance";
export const AddBrand  = (data)=> axios.post(`/Brands`, data);
export const UpdateBrandById  = (data,id)=> axios.put(`/Brands/${id}`,data);
export const GetBrands = (page =1 )=>axios.get(`/Brands?page=${page}`);
export const GetBrandByID = (id)=> axios.get(`/Brands/${id}`)
export const GetBrandByType = (id)=> axios.get(`/Brands/byType/${id}`)
export const GetProductsByBrand = (id)=> axios.get(`/Brands/products/${id}`)
export const DeleteBrandByID = (id)=> axios.delete(`/Brands/delete/${id}`);