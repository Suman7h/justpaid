"use client";
import { createContext, useContext, useState, useEffect } from "react";


interface UserContextType {
  user: { name: string;role:string;Id:Number; avatar: string } | null;
  isLoggedIn: boolean;
  login: (userData: { name: string;role:string;Id:Number; avatar: string }) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string;role:string;Id:Number; avatar: string } | null>(
    null
  );
  const isLoggedIn = !!user;

 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  
  const login = (userData: { name: string;role:string; Id:Number; avatar: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); 
  };

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
