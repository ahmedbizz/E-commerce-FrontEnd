import { createContext, useState ,useEffect} from "react";
import {GetCart} from "../services/CartService"
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async () => {
    GetCart()
      .then((res) => {
      console.log(res.data)
        setCartItems(res.data.items);
      })
      .catch((err) => {
        console.log(err)
      })
    
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
