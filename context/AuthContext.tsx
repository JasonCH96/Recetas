'use client'

import { useContext, useEffect, useState, createContext } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";

class userInput {
  email: string;
  password: string;
}

type IAuthContext = {
  currentUser: User | undefined;
  login(user: userInput): Promise<UserCredential>;
  signup(user: userInput): Promise<UserCredential>;
  logout(history: unknown): void;
}

type ContextProp = {
  children: React.ReactNode
} 

const AuthContext = createContext({} as IAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: ContextProp) {
  const [currentUser, setCurrentUser] = useState<User>();

  function signup({ email, password }: userInput) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login({ email, password }: userInput) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(history: unknown) {
    auth.signOut();
    console.log(history)
    // history?.push("/login");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user)
      }
    });

    return unsubscribe;
  }, []);

  const value: IAuthContext = {
    currentUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
