import axios from "./axiosInstance";

export const GetOrder = () => axios.get(`/Order`);
export const AddToOrder  = (data)=> axios.post(`/Order/AddToOrder`,data);
export const GetOrderById = (id) => axios.get(`/Order/${id}`);
export const UpdateOrderById  = (id,status)=> axios.patch(`/Order/${id}/status`,{ Status: status});

