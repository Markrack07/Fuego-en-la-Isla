import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// 🔹 ELEMENTOS LOGIN
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const goRegister = document.getElementById("goRegister");

// 🔹 ELEMENTOS REGISTER
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("registerBtn");
const goLogin = document.getElementById("goLogin");

// 🔹 CAJAS
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

// 👉 SOLO ejecutamos si estamos en login.html
if (loginBtn && registerBtn) {

  const auth = getAuth();

  /* ---------- CAMBIAR ENTRE LOGIN / REGISTER ---------- */
  goRegister.onclick = () => {
    loginBox.style.display = "none";
    registerBox.style.display = "flex";
  };

  goLogin.onclick = () => {
    registerBox.style.display = "none";
    loginBox.style.display = "flex";
  };

  /* ---------- LOGIN ---------- */
  loginBtn.onclick = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------- REGISTER ---------- */
  registerBtn.onclick = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        regEmail.value,
        regPassword.value
      );
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  };

}
