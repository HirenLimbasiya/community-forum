"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { connectSocket } from "@/lib/socket";
import { createUser, loginUser } from "@/services/userService";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const router = useRouter();

  const setUpSocket = () => {
    //may be more thing come
    connectSocket();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuthenticated = Boolean(token);
    if (isAuthenticated) {
      setUpSocket();
    }
    setIsAuthenticated(isAuthenticated);
    setIsCalled(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginUser({ email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setUpSocket();
        setIsAuthenticated(true);
        router.push("/topic");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    router.push("/");
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const { data } = await createUser({ name, email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setUpSocket();
        setIsAuthenticated(true);
        router.push("/topic");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {isCalled && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
