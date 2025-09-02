import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for valid token cookie on mount
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3001/auth/me", {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.user) {
          setUser(res.data);
          setLoggedIn(true);
          console.log("User authenticated:", res.data);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loggedIn, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
