import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import SignInSide from "../pages/SignInSide";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import AddProduct from "../pages/AddProduct";
import Main from "../pages/Management/Main";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// Role Management
import CreateRoleUi from "../pages/Management/RoleManagment/CreateRoleUi";
import DispalyRole from "../pages/Management/RoleManagment/DispalyRole";
import CreateGroup from "../pages/Management/GroupManagment/CreateGroup";
export default function AppRouter() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/login" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
      {user &&
      user.role &&
      user.role.some((r) => r.toLowerCase() === "admin") ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="/product/create" element={<AddProduct />} />
          <Route path="/role/create" element={<CreateRoleUi />} />
          <Route path="/role" element={<DispalyRole />} />
          <Route path="/group/create" element={<CreateGroup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      ) : (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route element={<PrivateRoute />}>  
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      )}
    </Routes>
  );
}
