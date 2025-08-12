import axios from "./axiosInstance";
export const AddGroup  = (data)=> axios.post(`/groups`, data, {
  headers: {
    "Content-Type": "application/json"
  }
});
export const GetGroups = ()=>axios.get('/groups');
export const GetGroupByID = (id)=> axios.get(`/groups/${id}`)


export const DeleteGroupByID = (id)=> axios.delete(`/groups/${id}`)
export const UpdateGroupById  = (data,id)=> axios.put(`/groups/${id}`,data);

// for assgin Role To Group
export const AssginRoleToGroup = (id,data) => axios.post(`/groups/assign/Roles/${id}`,data);
// for assgin User Tp Group
export const AssginUserToGroup = (id,data) => axios.post(`/groups/assign/Users/${id}`,data);
export const GetUserInGroupByID = (id)=> axios.get(`/groups/${id}/users`)

