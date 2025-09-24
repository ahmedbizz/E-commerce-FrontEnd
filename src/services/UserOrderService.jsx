import axios from "./axiosInstance";

export const GetOrder = (id) => axios.get(`/Order/UserOrders/${id}`);
export const CancelOrder  = (orderId)=> axios.post(`/Order/Cancel/${orderId}`);
export const GetOrderById = (id) => axios.get(`/Order/${id}`);
export const UpdateOrderById  = (id,status)=> axios.patch(`/Order/${id}/status`,{ Status: status});

