// auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

import { auth, db } from "./firebase-config.js";

/* -----------------------------
   ELEMENTOS LOGIN
----------------------------- */
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const goRegister = document.getElementById("goRegister");

/* -----------------------------
   ELEMENTOS REGISTER
----------------------------- */
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const usernameInput = document.getElementById("username");
const registerBtn = document.getElementById("registerBtn");
const goLogin = document.getElementById("goLogin");

/* -----------------------------
   CAJAS
----------------------------- */
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

/* -----------------------------
   REDIRECCIÓN GLOBAL
----------------------------- */
onAuthStateChanged(auth, (user) => {
  const isLogin = location.pathname.includes("login.html");

  if (!user && !isLogin) {
    window.location.href = "login.html";
  }

  if (user && isLogin) {
    window.location.href = "index.html";
  }
});

/* -----------------------------
   LOGIN / REGISTER (solo si existe)
----------------------------- */
if (loginBtn && registerBtn) {

  // Cambiar a registro
  goRegister.onclick = () => {
    loginBox.style.display = "none";
    registerBox.style.display = "flex";
  };

  // Volver a login
  goLogin.onclick = () => {
    registerBox.style.display = "none";
    loginBox.style.display = "flex";
  };

  // LOGIN
  loginBtn.onclick = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // REGISTER
  registerBtn.onclick = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        regEmail.value,
        regPassword.value
      );

      const uid = cred.user.uid;

      await set(ref(db, "users/" + uid), {
        name: nameInput.value,
        surname: surnameInput.value,
        username: usernameInput.value,
        email: regEmail.value,
        influence: 0,
        role: "viewer",
        createdAt: Date.now()
      });

    } catch (err) {
      alert(err.message);
    }
  };
}
