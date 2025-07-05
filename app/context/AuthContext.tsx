"use client"
import { auth, provider } from "@/firebase/firebase";
import { User as FirebaseUser,User,signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithPopup, getAdditionalUserInfo, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ExtendedFirebaseUser extends FirebaseUser {
  user: {}| any,
}
// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email:string,password:string,isRemembered:boolean) => Promise<boolean>;
  logout: () => void;
  signup:(usr:any)=>Promise<FirebaseUser | null>
  user:ExtendedFirebaseUser | null | false | User;
  
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [user, setUser] = useState<ExtendedFirebaseUser | null| User>(null);
  const login = async (email: string, password: string, isRemembered: boolean) => {
    return setPersistence(auth, isRemembered?browserLocalPersistence:browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        setUser(userCredential.user);
        setIsAuthenticated(true);
        return true;
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setIsAuthenticated(false);
        setUser(null);
        return false;
      });
  };
 const googleSignup = async () => {
 const isMobile =
    typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    // 👉 Step 1: Handle result from redirect if on mobile
    if (isMobile) {
      const result = await getRedirectResult(auth);

      if (result?.user) {
        const user = result.user;
        const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

        if (isNewUser) {
          await setDoc(doc(db, "Shops", user.uid), {
            email: user.email,
            tokens: 200,
            phoneNumber: "",
            firstName: user.displayName,
            countryCode: "",
            createdAt: new Date(),
            isProfileComplete: false,
            terms: true,
            promoCode: "",
          });
          console.log("🆕 New mobile user saved to Firestore");
        }

        setUser(user);
        setIsAuthenticated(true);
        return isNewUser ? "new" : "existing";
      }

      // if not redirected yet, initiate it
      await signInWithRedirect(auth, provider);
      return null;
    }

    // 👉 Step 2: Desktop popup flow
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;

    if (isNewUser) {
      await setDoc(doc(db, "Shops", user.uid), {
        email: user.email,
        tokens: 200,
        phoneNumber: "",
        firstName: user.displayName,
        countryCode: "",
        createdAt: new Date(),
        isProfileComplete: false,
        terms: true,
        promoCode: "",
      });
      console.log("🆕 New desktop user saved to Firestore");
    }

    setUser(user);
    setIsAuthenticated(true);
    return isNewUser ? "new" : "existing";
  } catch (error: any) {
    console.error("❌ Google sign-in error:", {
      errorCode: error.code,
      errorMessage: error.message,
    });
    setUser(null);
    setIsAuthenticated(false);
    return null;
  }
};

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const signup = async (usr:any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, usr.email, usr.password);
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "Shops", user.uid), {
        email: user.email,
        ...usr // Spread additional user data
      });
      setUser(user);
      setIsAuthenticated(true);
      return user; // Return the user object
    } catch (error) {
      console.error("Signup Error:", error);
      setIsAuthenticated(false);
      setUser(null);
      return null; // Return null on error
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (user:User | null) => {
      if (user) {

          console.log("useweqwewqe",user);
          
        setUser({...user});
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);



  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, signup, user,googleSignup}}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 