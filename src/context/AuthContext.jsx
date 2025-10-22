import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {ROLES} from "../utils/Role" 
import {useNavigate} from "react-router-dom";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRole] = useState(ROLES.GUEST);
  const navigate = useNavigate();


  //  دالة لفحص صلاحية التوكن
  const checkToken = () => {
    const token = Cookies.get("token");

    if (!token) {
      logoutUser(false); // false = لا تعمل navigate مرتين
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.warn(" Token expired — logging out...");
        logoutUser(false);
      } else {
        setUser(decoded);
        setRole(decoded.role?.toLowerCase());
      }
    } catch (error) {
      console.error(" Invalid token:", error);
      Cookies.remove("token");
      setRole(ROLES.GUEST);
      setUser(null);
    }
  };

  // 🕒 عند أول تحميل + تحقق كل 3 دقائق
  useEffect(() => {
    checkToken(); // فحص أولي
    setLoading(false);

    const interval = setInterval(() => {
      checkToken();
    }, 180000); // كل 3 دقائق

    return () => clearInterval(interval);
  }, []);


  const loginUser = (token) => {
    Cookies.set("token", token, { expires: 7 });
    const decoded = jwtDecode(token);
    (decoded)
    setUser(decoded);
    setRole(decoded.role?.toLowerCase());
    if (decoded.role?.toLowerCase() == ROLES.ADMIN) {
      navigate("/System", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const logoutUser = () => {
    Cookies.remove("token");
    setUser(null); 
    setRole(ROLES.GUEST);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{user, roleUser,loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
