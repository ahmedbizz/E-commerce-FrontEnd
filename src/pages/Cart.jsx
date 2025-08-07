import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cartItems } = useContext(CartContext);

  return (
    <div>
      <h2>السلة</h2>
      {cartItems.length === 0 ? (
        <p>السلة فارغة</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>{item.name} - {item.quantity} × {item.price} ريال</li>
          ))}
        </ul>
      )}
    </div>
  );
}
