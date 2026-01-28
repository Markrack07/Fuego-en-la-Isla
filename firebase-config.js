// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGxLmQDmohUivV1XxIsLIWAvDATLRROgE",
  authDomain: "fuego-en-la-isla.firebaseapp.com",
  projectId: "fuego-en-la-isla",
  storageBucket: "fuego-en-la-isla.firebasestorage.app",
  messagingSenderId: "837575806373",
  appId: "1:837575806373:web:d823ec3986cfee375cec4c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Autenticación
export const auth = getAuth(app);

// Realtime Database con URL específica de tu región
export const db = getDatabase(app, "https://fuego-en-la-isla-default-rtdb.firebaseio.com");
