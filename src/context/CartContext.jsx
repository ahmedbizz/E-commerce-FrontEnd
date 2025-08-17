import { createContext, useState ,useEffect} from "react";
import {GetCart ,IncreaseItem,DecreaseItem,DeleteItem} from "../services/CartService"
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async () => {
    GetCart()
      .then((res) => {
    console.log(res)
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
    console.log(res.data)
    setCartItems(res.data.items)
  } catch (err) {
    console.error("خطأ في زيادة العنصر:", err);
  }
};


 // نقص عنصر في السلة
 const DecreaseItemById = async (id) => {
  try {

    var res = await DecreaseItem(id);
    console.log(res.data)
    setCartItems(res.data.items)
  } catch (err) {
    console.error("خطأ في نقص العنصر:", err);
  }
};

 // حذف عنصر في السلة
 const DeleteItemById = async (id) => {
  try {

    var res = await DeleteItem(id);
    if(res.data.items){setCartItems(res.data.items)}
  
  } catch (err) {
    console.error("خطأ في حذف العنصر:", err);
  }
};





  return (
    <CartContext.Provider value={{ cartItems, setCartItems ,IncreaseItemById,DecreaseItemById,DeleteItemById ,fetchCart}}>
      {children}
    </CartContext.Provider>
  );
}
