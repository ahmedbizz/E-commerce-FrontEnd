import axios from "./axiosInstance";
export const CreateRole  = (data)=> axios.post(`/Role`, data, {
  headers: {
    "Content-Type": "application/json"
  }
});
export const GetRoles = (page) =>
  axios.get(`/Role`, {
    params: {
      page: page,

    }
  });

export const DeleteRoleByID = (id)=> axios.delete(`/Role/${id}`)