import axios from "./axiosInstance";
export const GetTargetGroup = ()=>axios.get(`/TargetGroup`);