import axios from "./axiosInstance";

export const getAllProducts = () => axios.get(`/Product`);
export const getProductById = (id) => axios.get(`/Product/${id}`);
export const addProduct  = ()=> axios.post(`/Product`);

