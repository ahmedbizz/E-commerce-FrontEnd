import axios from "./axiosInstance";

export const GetProducts = () => axios.get(`/Product`);
export const GetProductById = (id) => axios.get(`/Product/${id}`);
export const addProduct  = (data)=> axios.post(`/Product`,data);
export const UpdateProductById  = (data,id)=> axios.put(`/Product/${id}`,data);
export const getCategories =() => axios.get('/Category/product')
export const DeleteProductByID = (id)=> axios.delete(`/Product/${id}`)

