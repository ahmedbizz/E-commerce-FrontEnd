import axios from "./axiosInstance";
export const AddTargetGroup   = (data)=> axios.post(`/TargetGroup`, data);
export const UpdateTargetGroupById  = (data,id)=> axios.put(`/TargetGroup/${id}`,data);
export const GetTargetGroups = (page =1 )=>axios.get(`/TargetGroup?page=${page}`);
export const GetTargetGroupByID = (id)=> axios.get(`/TargetGroup/${id}`)
export const DeleteTargetGroupByID = (id)=> axios.delete(`/TargetGroup/${id}`);