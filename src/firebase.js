// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe0vP6Fm4TMUxaxMkPhOGk9-i8O-wwwZM",
  authDomain: "logins-49a12.firebaseapp.com",
  projectId: "logins-49a12",
  storageBucket: "logins-49a12.appspot.com",
  messagingSenderId: "358982559750",
  appId: "1:358982559750:web:5a1c7ab7097d7370a87b87", 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };