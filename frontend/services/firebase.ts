/// <reference path="../vite-env.d.ts" />
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

export const initializeFirebase = async () => {
    try {
        console.log("Fetching Firebase config...");
        const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';
        const response = await fetch(`${apiBase}/api/firebase-config`);
        if (!response.ok) {
            console.error(`Failed to fetch config: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
        }
        const firebaseConfig = await response.json();

        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();

        console.log("Security Protocols Active.");
        return { app, auth, googleProvider };
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
};

export { auth, googleProvider };
