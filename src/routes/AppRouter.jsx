import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdsPanel from "../pages/AdsPanel";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import SignInSide from "../pages/SignInSide";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";

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
// Managment WhareHouse
import CreateWareHouse from "../pages/Management/ManagmentWareHouse/CreateWareHouse";
import DispalyWareHouse from "../pages/Management/ManagmentWareHouse/DisplayWareHouse";
import UpdateWareHouse from "../pages/Management/ManagmentWareHouse/UpdateWareHouse";
// Mangment Product
import AddProduct from "../pages/Management/ProductManagment/AddProduct";
import DisplayProducts from "../pages/Management/ProductManagment/DisplayProducts";
import UpdateProduct from "../pages/Management/ProductManagment/UpdateProduct";
// Managment inventory
import CreateInventory from "../pages/Management/ManagmentInventory/CreateInventory";
import DispalyInventory from "../pages/Management/ManagmentInventory/DisplayInventory";
import UpdateInventory from "../pages/Management/ManagmentInventory/UpdateInventory";
export default function AppRouter() {
  const { user } = useContext(AuthContext);

  const isAdmin = Array.isArray(user?.role) 
  ? user.role.some(r => r.toLowerCase() === "admin") 
  : typeof user?.role === "string" && user?.role.toLowerCase() === "admin";

  return (
    <Routes>
      <Route path="/login" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
      {isAdmin ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Main />} />
          {/* Managment Product */}
          <Route path="/product/create" element={<AddProduct />} />
          <Route path="/products" element={<DisplayProducts />} />
          <Route path="/product/:id" element={<UpdateProduct />} />
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
          {/* Management WhareHouse */}
          <Route path="/wareHouses" element={<DispalyWareHouse />} />
          <Route path="/wareHouse/create" element={<CreateWareHouse />} />
          <Route path="/wareHouse/:id" element={<UpdateWareHouse />} />
          {/* Managment Inventory */}
          <Route path="/inventorys" element={<DispalyInventory />} />
          <Route path="/inventory/create" element={<CreateInventory />} />
          <Route path="/inventory/:id" element={<UpdateInventory />} />

      
          
        </Route>
      ) : (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>
            <AdsPanel/> <Home />
          </div>} />
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
