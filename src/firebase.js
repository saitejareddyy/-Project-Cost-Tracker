import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile 
} from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore
} from "firebase/firestore";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyCq4e-Wio9YKZMG5lUNptYO_frQqZCHMi4",
  authDomain: "karkhana-assign.firebaseapp.com",
  projectId: "karkhana-assign",
  storageBucket: "karkhana-assign.firebasestorage.app",
  messagingSenderId: "775002653184",
  appId: "1:775002653184:web:2ca50de48cc848f9e78ee5",
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    
    await updateProfile(user, {
      displayName: name
    });

    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name, 
      authProvider: "local",
      email,
    });
    
  } catch (error) {
    console.error("Firebase Signup Error:", error); 
    toast.error(error.message); 
    throw error; 
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    
  } catch (error) {
    console.error("Firebase Login Error:", error); 
    toast.error(error.message); 
    throw error; 
  }
};

const logout = async () => {
  try {
    await signOut(auth); 
  } catch (error) {
    console.error("Firebase Logout Error:", error);
    toast.error("Logout failed: " + error.message);
    throw error; 
  }
};

export { auth, db, login, signup, logout };