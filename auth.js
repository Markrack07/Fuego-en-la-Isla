import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";


/* -----------------------------
   ELEMENTOS LOGIN / REGISTER
----------------------------- */
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const goRegister = document.getElementById("goRegister");

const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const usernameInput = document.getElementById("username");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const registerBtn = document.getElementById("registerBtn");
const goLogin = document.getElementById("goLogin");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

/* -----------------------------
   AUTH
----------------------------- */
const auth = getAuth();

/* -----------------------------
   REDIRECCIÓN AUTOMÁTICA
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
   SOLO SI EXISTE LOGIN
----------------------------- */
if (loginBtn && registerBtn) {

  goRegister.onclick = () => {
    loginBox.style.display = "none";
    registerBox.style.display = "flex";
  };

  goLogin.onclick = () => {
    registerBox.style.display = "none";
    loginBox.style.display = "flex";
  };

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

  const db = getDatabase();

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

    window.location.href = "index.html";

  } catch (err) {
    alert(err.message);
  }
};
