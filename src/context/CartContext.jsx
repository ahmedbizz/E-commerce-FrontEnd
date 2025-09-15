import { createContext, useState ,useEffect ,useContext } from "react";
import {GetCart ,IncreaseItem,DecreaseItem,DeleteItem} from "../services/CartService"
import { AuthContext } from "../context/AuthContext";
export const CartContext = createContext();
export function CartProvider({ children }) {
  const { user} = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async () => {
    GetCart()
      .then((res) => {
        console.log(res.data.items);
        setCartItems(res.data.items);
      })
      .catch(() => {
        return;
      })
    
  }

  useEffect(() => {
    fetchCart();
  }, [user]);


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
