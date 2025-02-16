'use client'
import { cookies } from "next/headers";
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  loading: boolean;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  // Fetch user session on mount
  useEffect(() => {
    const checkSession = async () => {
        
      try {
        const res = await fetch("http://localhost:8080/auth/get-session", {
          credentials: "include", // Ensure cookies are sent
        });
        console.log(res)
        if (res.ok) {
          const data = await res.json();
          console.log(data.user)
          setUser(data.user); // Set the user from session
        }
      } catch (error) {
        console.error("Session fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });
  
      if (!res.ok) {
        throw new Error("Logout failed");
      }
  
      setUser(null); // Only clear user state after a successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
