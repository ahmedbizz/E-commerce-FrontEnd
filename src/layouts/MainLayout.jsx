import Navbar from "../components/Navbar/Navbar";
import ManageDashboard from "../components/ManageDashboard/ManageDashboard";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 


export default function MainLayout() {
  const { user } = useContext(AuthContext);
  const isAdmin = Array.isArray(user?.role) && user.role.some(r => r === "Admin");
  return (
    <> 
    {isAdmin?
    <ManageDashboard/>:
    <Navbar />

    }
    
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
