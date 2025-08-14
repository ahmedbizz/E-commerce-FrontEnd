import axios from "./axiosInstance";

export const GetInventorys = () => axios.get(`/Inventory`);
export const GetInventoryById = (id) => axios.get(`/Inventory/${id}`);
export const addInventory  = (data)=> axios.post(`/Inventory`,data);
export const UpdateInventoryById  = (data,id)=> axios.put(`/Inventory/${id}`,data);
export const getCategories =() => axios.get('/Category/Inventory')
export const DeleteInventoryByID = (id)=> axios.delete(`/Inventory/${id}`)

