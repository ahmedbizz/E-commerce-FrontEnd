import axios from "./axiosInstance";
export const AddWareHouse  = (data)=> axios.post(`/WareHouse`, data);
export const UpdateWareHouseById  = (data,id)=> axios.put(`/WareHouse/${id}`,data, {
  headers: { "Content-Type": "application/json" }});
export const GetWareHouses = (page =1)=>axios.get(`/WareHouse?page=${page}`);
export const GetWareHouseByID = (id)=> axios.get(`/WareHouse/${id}`)
export const DeleteWareHouseByID = (id)=> axios.delete(`/WareHouse/${id}`);