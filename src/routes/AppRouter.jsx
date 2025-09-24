import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdsPanel from "../pages/AdsPanel";
import Panel from "../components/Panel/Panel";
import ProductDetails from "../pages/ProductDetails";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import DisplayUserOrders from "../pages/DisplayUserOrders";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import SignInSide from "../pages/SignInSide";
import SignUp from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";

import Main from "../pages/Management/Main";
// Role Management
import CreateRoleUi from "../pages/Management/RoleManagment/CreateRoleUi";
import DispalyRole from "../pages/Management/RoleManagment/DispalyRole";
// Group Managment
import DispalyGroup from "../pages/Management/GroupManagment/DisplayGroups";
import CreateGroup from "../pages/Management/GroupManagment/CreateGroup";
import UpdateGroup from "../pages/Management/GroupManagment/UpdateGrop";
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
// Brand Managment
import CreateBrand from "../pages/ManagmentBrans/CreateBrands";
import DispalyBrand from "../pages/ManagmentBrans/DisplayBrans";
import UpdateBrand from "../pages/ManagmentBrans/UpdateBrands";
// Managment WhareHouse
import CreateWareHouse from "../pages/Management/ManagmentWareHouse/CreateWareHouse";
import DispalyWareHouse from "../pages/Management/ManagmentWareHouse/DisplayWareHouse";
import UpdateWareHouse from "../pages/Management/ManagmentWareHouse/UpdateWareHouse";
// Mangment Product
import AddProduct from "../pages/Management/ProductManagment/AddProduct";
import DisplayProducts from "../pages/Management/ProductManagment/DisplayProducts";
import UpdateProduct from "../pages/Management/ProductManagment/UpdateProduct";
//  Managment Size
import CreateSize from "../pages/Management/ManagmentSize/CreateSize";
import DispalySize from "../pages/Management/ManagmentSize/DispalySizes";
import UpdateSize from "../pages/Management/ManagmentSize/UpdateSize";
// Managment TargetGroup
import CreateTargetGroup from "../pages/Management/ManagmentTargetGroup/CreateTargetGroup";
import DisplayTargetGroup from "../pages/Management/ManagmentTargetGroup/DisplayTargetGroup";
import UpdateTargetGroup from "../pages/Management/ManagmentTargetGroup/UpdateTargetGroup";
// Managment inventory
import CreateInventory from "../pages/Management/ManagmentInventory/CreateInventory";
import DispalyInventory from "../pages/Management/ManagmentInventory/DisplayInventory";
import UpdateInventory from "../pages/Management/ManagmentInventory/UpdateInventory";
// Managment Order
import DispalyOrder from "../pages/Management/ManagementOrder/DisplayOrder";

//Managmenet Payment methods
import CreatePaymentMethod from "../pages/Management/ManagmentPaymentMethod/CreatePaymentMethod";
import DispalyPaymentMethod from "../pages/Management/ManagmentPaymentMethod/DispalyPaymentMethod";
import UpdatePaymentMethod from "../pages/Management/ManagmentPaymentMethod/UpdatePaymentMethod";

import { ROLES } from "../utils/Role";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<SignInSide />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route element={<PrivateRoute isPublic={true} />}>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <>
                <AdsPanel />
                <Panel />
                <Home />
              </>
            }
          />
        </Route>
      </Route>

      <Route element={<PrivateRoute role={ROLES.USER} />}>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={
              <>
                <AdsPanel />
                <Panel />
                <Home />
              </>
            }
          />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="products/all" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<DisplayUserOrders />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute role={ROLES.ADMIN} />}>
        <Route path="/System" element={<MainLayout />}>
          <Route index element={<DispalyOrder />} />
          {/* Managment Product */}
          <Route path="product/create" element={<AddProduct />} />
          <Route path="products" element={<DisplayProducts />} />
          <Route path="product/edit/:id" element={<UpdateProduct />} />
          {/* Role Managment */}
          <Route path="role/create" element={<CreateRoleUi />} />
          <Route path="role" element={<DispalyRole />} />
          {/* // Group Managment */}
          <Route path="groups" element={<DispalyGroup />} />
          <Route path="group/create" element={<CreateGroup />} />
          <Route path="group/edit/:id" element={<UpdateGroup />} />
          <Route path="assgin/users/:id" element={<AssginUserToGroupUI />} />
          <Route path="assgin/roles/:id" element={<AssginRoleToGroupUI />} />
          {/* // User Managment */}
          <Route path="users" element={<DisplayUsers />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="user/edit/:id" element={<UpdateUser />} />

          {/* Managment Category */}
          <Route path="categorys" element={<DispalyCategory />} />
          <Route path="categorys/create" element={<CreateCategory />} />
          <Route path="categorys/edit/:id" element={<UpdateCategory />} />
          {/* Managment Category */}
          <Route path="Brands" element={<DispalyBrand />} />
          <Route path="Brands/create" element={<CreateBrand />} />
          <Route path="Brands/edit/:id" element={<UpdateBrand />} />
          {/* Managment Size */}
          <Route path="Sizes" element={<DispalySize />} />
          <Route path="Size/create" element={<CreateSize />} />
          <Route path="Size/edit/:id" element={<UpdateSize />} />
          {/* Managment PaymentMethod */}
          <Route path="PaymentMethods" element={<DispalyPaymentMethod />} />
          <Route path="PaymentMethod/create" element={<CreatePaymentMethod />} />
          <Route path="PaymentMethod/edit/:id" element={<UpdatePaymentMethod />} />
          {/* Managment TargetGroup */}
          <Route path="TargetGroups" element={<DisplayTargetGroup />} />
          <Route path="TargetGroup/create" element={<CreateTargetGroup />} />
          <Route path="TargetGroup/:id" element={<UpdateTargetGroup />} />

          {/* Management WhareHouse */}
          <Route path="wareHouses" element={<DispalyWareHouse />} />
          <Route path="wareHouse/create" element={<CreateWareHouse />} />
          <Route path="wareHouse/:id" element={<UpdateWareHouse />} />
          {/* Managment Inventory */}
          <Route path="inventorys" element={<DispalyInventory />} />
          <Route path="inventory/create" element={<CreateInventory />} />
          <Route path="inventory/:id" element={<UpdateInventory />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
