import axios from "./axiosInstance";

export const GetCart = () => axios.get(`/Cart/me`);
export const AddToCart  = (data)=> axios.post(`/Cart/AddToCart`,data);
export const IncreaseItem = (id,number = 1) => axios.post(`/Cart/Increase/${id}?number=${number}`)
export const DecreaseItem = (id,number = 1) => axios.post(`/Cart/Decrease/${id}?number=${number}`)
export const DeleteItem = (id) => axios.post(`/Cart/DeleteItem/${id}`)