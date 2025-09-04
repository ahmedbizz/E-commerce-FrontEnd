import Navbar from "../components/Navbar/Navbar";
import ManageDashboard from "../components/ManageDashboard/ManageDashboard";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { Box, CircularProgress } from "@mui/material";

export default function MainLayout() {
  const { user, loading } = useContext(AuthContext);
  const isAdmin = Array.isArray(user?.role) 
  ? user.role.some(r => r.toLowerCase() === "admin") 
  : typeof user?.role === "string" && user?.role.toLowerCase() === "admin";

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
  return (
    <> 
    {isAdmin?
    <ManageDashboard/>:
    < Navbar />

    }
    
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
