import axios from "./axiosInstance";
export const AddTaxCategory  = (data)=> axios.post(`/TaxCategory`, data);
export const UpdateTaxCategoryById  = (data,id)=> axios.put(`/TaxCategory/${id}`,data);
export const GetTaxCategorys = (page =1 )=>axios.get(`/TaxCategory?page=${page}`);
export const GetTaxCategoryByID = (id)=> axios.get(`/TaxCategory/${id}`)
export const DeleteTaxCategoryByID = (id)=> axios.delete(`/TaxCategory/${id}`);