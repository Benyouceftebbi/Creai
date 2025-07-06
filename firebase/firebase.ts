import { initializeApp } from "firebase/app";
import { initializeAuth,browserLocalPersistence,GoogleAuthProvider, getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "creai-nu.vercel.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase {

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app);
const functions = getFunctions(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ login_hint: "user@example.com" }); // optional
provider.setCustomParameters({   
    prompt : "select_account "
});

// connectFunctionsEmulator(functions, "127.0.0.1", 5001);
export {db , storage,functions,provider}
export default app 