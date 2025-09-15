import axios from "./axiosInstance";
export const AddPaymentMethod  = (data)=> axios.post(`/PaymentMethod`, data);
export const UpdatePaymentMethodById  = (data,id)=> axios.put(`/PaymentMethod/${id}`,data);
export const GetPaymentMethods = (page =1 )=>axios.get(`/PaymentMethod?page=${page}`);
export const GetPaymentMethodByID = (id)=> axios.get(`/PaymentMethod/${id}`)
