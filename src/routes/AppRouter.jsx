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
// Group Managment
import DispalyGroup from "../pages/Management/GroupManagment/DisplayGroups";
import CreateGroup from "../pages/Management/GroupManagment/CreateGroup";
import UpdateGroup from "../pages/Management/GroupManagment/UpdateGrop"
// User Managment
import DisplayUsers from "../pages/Management/UserMangment/DisplayUsers";
import CreateUser from "../pages/Management/UserMangment/CreateUser";
import UpdateUser from "../pages/Management/UserMangment/UpadteUser";
import AssginUserToGroupUI from "../pages/Management/UserMangment/AssginUserToGroupUI";
import AssginRoleToGroupUI from "../pages/Management/GroupManagment/AssginRoleToGroupUI";
// Category Managment
import CreateCategory from "../pages/Management/ManagmentCategory/CreateCategory";
import DispalyCategory from "../pages/Management/ManagmentCategory/DisplayCategory";
import UpdateCategory from "../pages/Management/ManagmentCategory/UpdateCategory";
export default function AppRouter() {
  const { user } = useContext(AuthContext);
  console.log(user)
  const isAdmin = Array.isArray(user?.role) 
  ? user.role.some(r => r.toLowerCase() === "admin") 
  : typeof user?.role === "string" && user?.role.toLowerCase() === "admin";
  console.log("isAdmin-->",isAdmin)
  return (
    <Routes>
      <Route path="/login" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
      {isAdmin ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="/product/create" element={<AddProduct />} />
          {/* Role Managment */}
          <Route path="/role/create" element={<CreateRoleUi />} />
          <Route path="/role" element={<DispalyRole />} />
          {/* // Group Managment */}
          <Route path="/groups" element={<DispalyGroup />} />
          <Route path="/group/create" element={<CreateGroup />} />
          <Route path="/group/:id" element={<UpdateGroup />} />
          <Route path="/assgin/users/:id" element={<AssginUserToGroupUI />} />
          <Route path="/assgin/roles/:id" element={<AssginRoleToGroupUI />} />
          {/* // User Managment */}
          <Route path="/users" element={<DisplayUsers />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/user/:id" element={<UpdateUser />} />
          <Route path="*" element={<NotFound />} />
          {/* Managment Category */}
          <Route path="/categorys" element={<DispalyCategory />} />
          <Route path="/categorys/create" element={<CreateCategory />} />
          <Route path="/categorys/:id" element={<UpdateCategory />} />
          
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
