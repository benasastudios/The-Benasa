import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCcI2uts_Pisn3-I8GdDRWZgtZQBD-FHRE",
    authDomain: "benasastudios-1d310.firebaseapp.com", 
    projectId: "benasastudios-1d310",
    storageBucket: "benasastudios-1d310.firebasestorage.app",
    messagingSenderId: "50494518728",
    appId: "1:50494518728:web:4ee9e91989d84966357cfd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let analytics = null;

if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, db, auth, analytics };
