import axios from "./axiosInstance";

export const GetCart = () => axios.get(`/Cart/me`);
export const AddToCart  = (data)=> axios.post(`/Cart/AddToCart`,data);
