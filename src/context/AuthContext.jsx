import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {ROLES} from "../utils/Role" 
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleUser, setRole] = useState(ROLES.GUEST);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role?.toLowerCase());
        setUser(decoded);
      } catch {
        Cookies.remove("token");
        setRole(ROLES.GUEST);
      }
      
    }
    setLoading(false); 
  }, []);

  const loginUser = (token) => {
    Cookies.set("token", token, { expires: 7 });
    const decoded = jwtDecode(token);
    setUser(decoded);
    setRole(decoded.role?.toLowerCase());
  };

  const logoutUser = () => {
    Cookies.remove("token");
    setRole(ROLES.GUEST);
  };

  return (
    <AuthContext.Provider value={{user, roleUser,loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
