// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBewTLT0_4tpsGGCKMpJ6AuVs-1J-dL2us",
  authDomain: "meuguiau.firebaseapp.com",
  projectId: "meuguiau",
  storageBucket: "meuguiau.appspot.com",
  messagingSenderId: "825157753629",
  appId: "1:825157753629:web:f15623166855c39a161ff4",
  measurementId: "G-H2DEWNH646"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);