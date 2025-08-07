import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
