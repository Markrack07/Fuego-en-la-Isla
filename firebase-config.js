// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGxLmQDmohUivV1XxIsLIWAvDATLRROgE",
  authDomain: "fuego-en-la-isla.firebaseapp.com",
  databaseURL: "https://fuego-en-la-isla-default-rtdb.firebaseio.com",
  projectId: "fuego-en-la-isla",
  storageBucket: "fuego-en-la-isla.appspot.com",
  messagingSenderId: "837575806373",
  appId: "1:837575806373:web:d823ec3986cfee375cec4c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
