"use client";
import { createContext, useContext, useState } from "react";

// 1️⃣ Context create karo
const UserContext = createContext();

// 2️⃣ Provider component
export const UserProvider = ({ children }) => {
  // State 1: user info
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  // State 2: boolean flag
  const [flag, setFlag] = useState(false);

  // State 3: extra example (optional) - simple number
  const [count, setCount] = useState(0);

  return (
    <UserContext.Provider value={{ user, setUser, flag, setFlag, count, setCount }}>
      {children}
    </UserContext.Provider>
  );
};

// 3️⃣ Custom hook for easy access
export const useUserContext = () => useContext(UserContext);