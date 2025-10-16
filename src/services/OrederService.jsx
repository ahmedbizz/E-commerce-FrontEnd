import axios from "./axiosInstance";

export const GetOrder = () => axios.get(`/Order`);
export const CreatePayment  = (data)=> axios.post(`/Order/CreatePayment`,data);
export const CashOnDelivery  = (data)=> axios.post(`/Order/CashOnDelivery`,data);
export const GetOrderById = (id) => axios.get(`/Order/${id}`);
export const UpdateOrderById  = (id,status)=> axios.patch(`/Order/${id}/status`,{ Status: status});

export const CapturePayment = (paymentId, providerOrderId) => axios.post(`/Order/CapturePayment`, {
  paymentId: Number(paymentId),
  providerOrderId
});