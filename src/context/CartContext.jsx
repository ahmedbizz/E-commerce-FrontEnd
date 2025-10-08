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
      
        setCartItems(res.data.items|| []);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
      })
    
  }

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);


// Increase Item in Cart

 // زيادة عنصر في السلة
const IncreaseItemById = async (id) => {
  try {
  
    var res =  await IncreaseItem(id);
    setCartItems(res.data.items|| cartItems)
  } catch (err) {
    console.error("Error increasing item:", err);
  }
};


 // نقص عنصر في السلة
 const DecreaseItemById = async (id) => {
  try {

    var res = await DecreaseItem(id);
    setCartItems(res.data.items|| cartItems)
  } catch (err) {
    console.error("Error decreasing item:", err);
  }
};



    // for delete Category
    const DeleteItemById = async (id) => {
      try {
        const res = await DeleteItem(id);
        
        const updatedList = cartItems.filter((g) => g.id !== id);
        setCartItems(updatedList);
      
      } catch (err) {
        console.error("Error deleting item:", err.message);
    
      }
    };





  return (
    <CartContext.Provider value={{ cartItems, setCartItems ,IncreaseItemById,DecreaseItemById,DeleteItemById ,fetchCart}}>
      {children}
    </CartContext.Provider>
  );
}
