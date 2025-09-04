import { createContext, useState ,useEffect} from "react";
import {GetCart ,IncreaseItem,DecreaseItem,DeleteItem} from "../services/CartService"
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async () => {
    GetCart()
      .then((res) => {
        setCartItems(res.data.items);
      })
      .catch((err) => {
        console.log(err)
      })
    
  }

  useEffect(() => {
    fetchCart();
  }, []);

// Increase Item in Cart

 // زيادة عنصر في السلة
const IncreaseItemById = async (id) => {
  try {
  
    var res =  await IncreaseItem(id);
    setCartItems(res.data.items)
  } catch (err) {
    console.error("خطأ في زيادة العنصر:", err);
  }
};


 // نقص عنصر في السلة
 const DecreaseItemById = async (id) => {
  try {

    var res = await DecreaseItem(id);
    setCartItems(res.data.items)
  } catch (err) {
    console.error("خطأ في نقص العنصر:", err);
  }
};



    // for delete Category
    const DeleteItemById = async (id) => {
      try {
        const res = await DeleteItem(id);
        
        const updatedList = cartItems.filter((g) => g.id !== id);
        setCartItems(updatedList);
      
      } catch (err) {
        console.log(err.message);
      }
    };





  return (
    <CartContext.Provider value={{ cartItems, setCartItems ,IncreaseItemById,DecreaseItemById,DeleteItemById ,fetchCart}}>
      {children}
    </CartContext.Provider>
  );
}
