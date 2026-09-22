import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtcAmEoCyswSdDxZo27p_Hmo5t2JGkF0k",
  authDomain: "chatmentorz-ff541.firebaseapp.com",
  projectId: "chatmentorz-ff541",
  storageBucket: "chatmentorz-ff541.firebasestorage.app",
  messagingSenderId: "342428248819",
  appId: "1:342428248819:web:8d27a11af4483f4e372586",
  measurementId: "G-63TVJSQVPF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
