import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ManageDashboard from "../components/ManageDashboard/ManageDashboard";
import { Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext"; 
import { Box, CircularProgress } from "@mui/material";
import MobileNavbar from "../components/Navbar/MobileNavbar";

export default function MainLayout() {
  const { user, loading } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    handleResize(); // لتعيين القيمة عند التحميل أول مرة
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <>
      {isAdmin ? (
        <ManageDashboard />
      ) : isMobile ? (
        <MobileNavbar />
      ) : (
        <Navbar />
      )}

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
