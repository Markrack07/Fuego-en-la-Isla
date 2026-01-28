import { auth, db } from 'firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

/* =========================
   ELEMENTOS DEL DOM
========================= */
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');

const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');

const dayTitle = document.getElementById('day-title');
const chapterText = document.getElementById('chapter-text');

const commentsDiv = document.getElementById('comments');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment');

const voteButtons = document.querySelectorAll('.vote-buttons button');

const sidebarLinks = document.querySelectorAll('.sidebar a');

/* =========================
   VARIABLES
========================= */
let currentUser = null;
let currentDayNumber = 1;

/* =========================
   LOGIN / REGISTRO
========================= */
signupBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const nickname = nicknameInput.value.trim();
  if (!email || !password || !nickname) return alert("Rellena todos los campos");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;

    // Guardar nickname en la DB
    await set(ref(db, `users/${currentUser.uid}`), { nickname, email });

  } catch (error) {
    return alert("Error en registro: " + error.message);
  }
});

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Rellena todos los campos");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;

  } catch (error) {
    return alert("Error al iniciar sesión: " + error.message);
  }
});

/* =========================
   DETECTAR ESTADO DE AUTENTICACIÓN
========================= */
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loginScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    loadDay(currentDayNumber);
  } else {
    loginScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
  }
});

/* =========================
   FUNCIONES DE CARGA DEL DÍA
========================= */
function loadDay(dayNumber){
  currentDayNumber = dayNumber;
  loadChapter();
  loadCommentsRealtime();
  loadVotesRealtime();
}

/* =========================
   CAPÍTULO DEL DÍA
========================= */
async function loadChapter() {
  const chapterRef = ref(db, `days/${currentDayNumber}`);
  onValue(chapterRef, async (snapshot) => {
    const data = snapshot.val();

    if (!data?.chapterText) {
      // Si no existe capítulo, generar con IA vía backend
      const prompt = `Día ${currentDayNumber} en Fuego en la Isla. Genera un capítulo emocionante basado en la historia actual.`;

      const text = await generarCapituloBackend(prompt, currentDayNumber);
      chapterText.textContent = text;
    } else {
      chapterText.textContent = data.chapterText;
    }

    dayTitle.textContent = `Día ${currentDayNumber}`;
  });
}

/* =========================
   FUNCION GENERAR CAPÍTULO CON BACKEND
========================= */
async function generarCapituloBackend(prompt, dayNumber) {
  try {
    // Aquí llamas a tu backend (Cloud Function o API) que genera el capítulo con OpenAI
    const response = await fetch('https://tu-backend.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, dayNumber })
    });

    const data = await response.json();
    const chapterText = data.chapterText || "No se pudo generar el capítulo.";

    // Guardar capítulo en Firebase
    await set(ref(db, `days/${dayNumber}`), {
      chapterText,
      createdAt: Date.now()
    });

    return chapterText;

  } catch (error) {
    console.error("Error generando capítulo:", error);
    return "Error generando capítulo.";
  }
}

/* =========================
   COMENTARIOS
========================= */
function loadCommentsRealtime() {
  const commentsRef = ref(db, `days/${currentDayNumber}/comments`);
  onValue(commentsRef, (snapshot) => {
    commentsDiv.innerHTML = "";
    snapshot.forEach(childSnapshot => {
      const comment = childSnapshot.val();
      const div = document.createElement('div');
      div.textContent = `${comment.nickname}: ${comment.text}`;
      commentsDiv.appendChild(div);
    });
  });
}

sendCommentBtn.addEventListener('click', async () => {
  const text = commentInput.value.trim();
  if (!text) return;

  await push(ref(db, `days/${currentDayNumber}/comments`), {
    userId: currentUser.uid,
    nickname: nicknameInput.value.trim(),
    text,
    createdAt: Date.now()
  });

  commentInput.value = '';
});

/* =========================
   VOTACIONES
========================= */
function loadVotesRealtime() {
  const votesRef = ref(db, `days/${currentDayNumber}/votes`);
  onValue(votesRef, (snapshot) => {
    console.log("Votos del día:", snapshot.val());
  });
}

voteButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const choice = parseInt(btn.getAttribute('data-choice'));
    await set(ref(db, `days/${currentDayNumber}/votes/${currentUser.uid}`), choice);
    alert("¡Voto registrado!");
  });
});

/* =========================
   NAVEGACIÓN SIDEBAR
========================= */
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const day = parseInt(link.getAttribute('data-day'));
    if (!isNaN(day)) loadDay(day);
  });
});
