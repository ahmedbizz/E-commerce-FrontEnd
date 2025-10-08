import { Routes, Route, useLocation } from "react-router-dom";
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
// WhareHouse
import CreateWareHouse from "../pages/Management/ManagmentWareHouse/CreateWareHouse";
import DispalyWareHouse from "../pages/Management/ManagmentWareHouse/DisplayWareHouse";
import UpdateWareHouse from "../pages/Management/ManagmentWareHouse/UpdateWareHouse";
// Product
import AddProduct from "../pages/Management/ProductManagment/AddProduct";
import DisplayProducts from "../pages/Management/ProductManagment/DisplayProducts";
import UpdateProduct from "../pages/Management/ProductManagment/UpdateProduct";
// Size
import CreateSize from "../pages/Management/ManagmentSize/CreateSize";
import DispalySize from "../pages/Management/ManagmentSize/DispalySizes";
import UpdateSize from "../pages/Management/ManagmentSize/UpdateSize";
// Taxes
import CreateTaxes from "../pages/Management/ManagmentTax/CreateTaxes";
import DispalyTaxes from "../pages/Management/ManagmentTax/DispalyTaxes";
import UpdateTaxes from "../pages/Management/ManagmentTax/UpdateTaxes";
// TargetGroup
import CreateTargetGroup from "../pages/Management/ManagmentTargetGroup/CreateTargetGroup";
import DisplayTargetGroup from "../pages/Management/ManagmentTargetGroup/DisplayTargetGroup";
import UpdateTargetGroup from "../pages/Management/ManagmentTargetGroup/UpdateTargetGroup";
// Inventory
import CreateInventory from "../pages/Management/ManagmentInventory/CreateInventory";
import DispalyInventory from "../pages/Management/ManagmentInventory/DisplayInventory";
import UpdateInventory from "../pages/Management/ManagmentInventory/UpdateInventory";
// Order
import DispalyOrder from "../pages/Management/ManagementOrder/DisplayOrder";
import ReturnPayPal from "../pages/ReturnPayPal";
// PaymentMethod
import CreatePaymentMethod from "../pages/Management/ManagmentPaymentMethod/CreatePaymentMethod";
import DispalyPaymentMethod from "../pages/Management/ManagmentPaymentMethod/DispalyPaymentMethod";
import UpdatePaymentMethod from "../pages/Management/ManagmentPaymentMethod/UpdatePaymentMethod";

import { AnimatePresence, motion } from "framer-motion";
import { ROLES } from "../utils/Role";

export default function AppRouter() {
const location = useLocation();

return ( <AnimatePresence mode="wait"> <Routes location={location} key={location.pathname}>
{/* صفحات عامة */}
<Route
path="/login"
element={
<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -30 }}
transition={{ duration: 0.35, ease: "easeInOut" }}
> <SignInSide />
</motion.div>
}
/>
<Route
path="/SignUp"
element={
<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -30 }}
transition={{ duration: 0.4 }}
> <SignUp />
</motion.div>
}
/>

```
    {/* صفحات المستخدم العامة */}
    <Route element={<PrivateRoute isPublic={true} />}>
      <Route
        path="/"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}

          >
            <MainLayout />
          </motion.div>
        }
      >
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

    {/* صفحات المستخدم */}
    <Route element={<PrivateRoute role={ROLES.USER} />}>
      <Route
        path="/"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}

          >
            <MainLayout />
          </motion.div>
        }
      >
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
        <Route
          path="product/:id"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}

            >
              <ProductDetails />
            </motion.div>
          }
        />
        <Route
          path="products/all"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}

            >
              <Products />
            </motion.div>
          }
        />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<DisplayUserOrders />} />
        <Route path="ReturnPayPal" element={<ReturnPayPal />} />
      </Route>
    </Route>

    {/* صفحات الإدارة */}
    <Route element={<PrivateRoute role={ROLES.ADMIN} />}>
      <Route
        path="/System"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}

          >
            <MainLayout />
          </motion.div>
        }
      >
        <Route index element={<DispalyOrder />} />
        <Route path="product/create" element={<AddProduct />} />
        <Route path="products" element={<DisplayProducts />} />
        <Route path="product/edit/:id" element={<UpdateProduct />} />
        <Route path="role/create" element={<CreateRoleUi />} />
        <Route path="role" element={<DispalyRole />} />
        <Route path="groups" element={<DispalyGroup />} />
        <Route path="group/create" element={<CreateGroup />} />
        <Route path="group/edit/:id" element={<UpdateGroup />} />
        <Route path="assgin/users/:id" element={<AssginUserToGroupUI />} />
        <Route path="assgin/roles/:id" element={<AssginRoleToGroupUI />} />
        <Route path="users" element={<DisplayUsers />} />
        <Route path="users/create" element={<CreateUser />} />
        <Route path="user/edit/:id" element={<UpdateUser />} />
        <Route path="categorys" element={<DispalyCategory />} />
        <Route path="categorys/create" element={<CreateCategory />} />
        <Route path="categorys/edit/:id" element={<UpdateCategory />} />
        <Route path="Brands" element={<DispalyBrand />} />
        <Route path="Brands/create" element={<CreateBrand />} />
        <Route path="Brands/edit/:id" element={<UpdateBrand />} />
        <Route path="Sizes" element={<DispalySize />} />
        <Route path="Size/create" element={<CreateSize />} />
        <Route path="Size/edit/:id" element={<UpdateSize />} />
        <Route path="Taxes" element={<DispalyTaxes />} />
        <Route path="Taxe/create" element={<CreateTaxes />} />
        <Route path="Taxe/edit/:id" element={<UpdateTaxes />} />
        <Route path="PaymentMethods" element={<DispalyPaymentMethod />} />
        <Route path="PaymentMethod/create" element={<CreatePaymentMethod />} />
        <Route path="PaymentMethod/edit/:id" element={<UpdatePaymentMethod />} />
        <Route path="TargetGroups" element={<DisplayTargetGroup />} />
        <Route path="TargetGroup/create" element={<CreateTargetGroup />} />
        <Route path="TargetGroup/:id" element={<UpdateTargetGroup />} />
        <Route path="wareHouses" element={<DispalyWareHouse />} />
        <Route path="wareHouse/create" element={<CreateWareHouse />} />
        <Route path="wareHouse/:id" element={<UpdateWareHouse />} />
        <Route path="inventorys" element={<DispalyInventory />} />
        <Route path="inventory/create" element={<CreateInventory />} />
        <Route path="inventory/:id" element={<UpdateInventory />} />
      </Route>
    </Route>

    <Route
      path="*"
      element={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}

        >
          <NotFound />
        </motion.div>
      }
    />
  </Routes>
</AnimatePresence>


);
}
