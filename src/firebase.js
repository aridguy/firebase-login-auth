// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAe0vP6Fm4TMUxaxMkPhOGk9-i8O-wwwZM",
  authDomain: "logins-49a12.firebaseapp.com",
  projectId: "logins-49a12",
  storageBucket: "logins-49a12.appspot.com",
  messagingSenderId: "358982559750",
  appId: "YOUR_APP_ID", // Replace with real app ID from Firebase Console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
