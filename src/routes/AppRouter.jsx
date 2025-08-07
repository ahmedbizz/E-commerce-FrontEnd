import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import NotFound from "../pages/NotFound";
import MainLayout from "../layouts/MainLayout";
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from './PrivateRoute';
import AddProduct from "../pages/AddProduct";

export default function AppRouter() {
  return (
   
      <Routes>

        <Route path="/" element={<MainLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
