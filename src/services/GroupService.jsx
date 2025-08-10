import axios from "./axiosInstance";
export const AddGroup  = (data)=> axios.post(`/groups`, data, {
  headers: {
    "Content-Type": "application/json"
  }
});
export const GetGroups = ()=>axios.get('/groups');
export const DeleteGroupByID = (id)=> axios.delete(`/groups/${id}`)