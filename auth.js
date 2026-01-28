import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

// REDIRECCIONAR SI YA ESTÁ LOGUEADO
onAuthStateChanged(auth, user => {
  if (!user && window.location.pathname.endsWith("index.html")) {
    window.location.href = "login.html";
  }
  if (user && window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
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
