import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import SignInSide from '../pages/SignInSide';
import SignUp from '../pages/SignUp';
import PrivateRoute from './PrivateRoute';
import AddProduct from "../pages/AddProduct";

export default function AppRouter() {
  return (
   
      <Routes>



        <Route path="/login" element={<SignInSide />} />
        <Route path="/SignUp" element={<SignUp />} />

        <Route path="/" element={<MainLayout />}>

          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route element={<PrivateRoute />}>
            <Route path="/product/create" element={<AddProduct/>}/>
          <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    
  );
}
