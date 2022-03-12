import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

};

const firebaseApp = initializeApp(firebaseConfig);
const auth= getAuth();
const db = getFirestore();
const googleProvider= new GoogleAuthProvider();


export {firebaseApp, auth, db, googleProvider };