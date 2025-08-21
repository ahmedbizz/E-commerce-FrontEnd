
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({role,isPublic}) {
  const { user } = useAuth();

  const isHasRole = Array.isArray(user?.role) 
  ? user.role.some(r => r.toLowerCase() === role) 
  : typeof user?.role === "string" && user?.role.toLowerCase() === role;


if(isPublic){
  return <Outlet /> 
}
if(!user){
  return <Navigate to="/login" replace/>
}
if(role && !isHasRole){
  return <Navigate to="/login" replace/>
}
return <Outlet /> 

}
