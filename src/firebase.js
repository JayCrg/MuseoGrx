// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

// ... other firebase imports
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDPZwg5mHAO7f3MFsYEp4klxcQx8v_JjL0",
  authDomain: "museogrx.firebaseapp.com",
  projectId: "museogrx",
  storageBucket: "museogrx.appspot.com",
  messagingSenderId: "344514431510",
  appId: "1:344514431510:web:e813571372fb9aab73c337",
  measurementId: "G-YLGV3CPBGH"
});

// used for the firestore refs
const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp)
export const storage = getStorage()
export const db = getFirestore(firebaseApp)
export const database = getDatabase(firebaseApp)


// here we can export reusable database references
// export const todosRef = collection(db, 'todos')







