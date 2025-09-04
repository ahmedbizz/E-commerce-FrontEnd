
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";
export default function PrivateRoute({role, isPublic = false}) {
  const { user, roleUser ,loading} = useAuth();
if (loading) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress
        sx={{ animation: "rotate 1.5s linear infinite" }}
        size={80}
      />
    </Box>
  );
}
if(isPublic){
return <Outlet /> 
}
if(!user){
return <Navigate to="/login" replace/>
}
if (roleUser !== role) {
return <Navigate to="*" replace />;
}



return <Outlet /> 


}
