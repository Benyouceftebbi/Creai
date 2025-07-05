// lib/initAuth.ts
"use client";

import { initializeAuth, browserLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import app from "./firebase"


export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  prompt: "select_account",
});