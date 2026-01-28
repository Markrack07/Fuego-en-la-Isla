import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

// 🚨 Si no estamos en login.html, NO seguimos
if (!emailInput || !passwordInput || !loginBtn || !registerBtn) {
  console.warn("auth.js cargado fuera de login.html");
  return;
}

// Redirige al login si no hay usuario
onAuthStateChanged(auth, user => {
  const path = window.location.pathname;

  if (!user) {
    // Si no está logueado y NO estamos ya en login.html → redirigir
    if (!path.endsWith("login.html")) {
      window.location.href = "login.html";
    }
  } else {
    // Si está logueado y estamos en login.html → redirigir a index
    if (path.endsWith("login.html")) {
      window.location.href = "index.html";
    }
  }
});

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// REGISTRO
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;
    const nickname = document.getElementById("regNick").value;
    const appear = document.getElementById("appear").checked;

    if (!nickname) return alert("Introduce un nickname");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Guardar usuario en Realtime Database
      await set(ref(db, `users/${uid}`), {
        nickname: nickname,
        role: "participante",
        appear: appear,
        influence: 0
      });

      window.location.href = "index.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// LOGOUT (para account.html)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
