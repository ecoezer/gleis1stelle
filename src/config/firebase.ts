import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDiWvVWBe3BEmik2LuDhghazvVXkqrBGI8",
  authDomain: "gleis1.firebaseapp.com",
  projectId: "gleis1",
  storageBucket: "gleis1.firebasestorage.app",
  messagingSenderId: "33365266997",
  appId: "1:33365266997:web:fcdc6d0df89150c322577c",
  measurementId: "G-22MGRQ4G4G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
