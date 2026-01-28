import { 
  auth, db, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  ref, set, onValue, push, child 
} from './firebase-config.js';

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

let currentUser = null;
let currentDayNumber = 1;

// =====================
// Registro
// =====================
signupBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const nickname = nicknameInput.value.trim();
  if (!email || !password || !nickname) return alert("Rellena todos los campos");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;

    // Guardar usuario en Realtime Database
    await set(ref(db, 'users/' + currentUser.uid), {
      nickname,
      email
    });

    loginScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    loadChapter();
    loadCommentsRealtime();
  } catch (error) {
    alert("Error en registro: " + error.message);
  }
});

// =====================
// Login
// =====================
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Rellena todos los campos");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCredential.user;

    loginScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    loadChapter();
    loadCommentsRealtime();
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});

// =====================
// Cargar capítulo del día
// =====================
function loadChapter() {
  const chapterRef = ref(db, `days/${currentDayNumber}`);
  onValue(chapterRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      dayTitle.textContent = `Día ${currentDayNumber}`;
      chapterText.textContent = data.chapterText || "Aún no hay capítulo para hoy...";
    } else {
      chapterText.textContent = "Aún no hay capítulo para hoy...";
    }
  });
}

// =====================
// Cargar comentarios en tiempo real
// =====================
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

// =====================
// Enviar comentario
// =====================
sendCommentBtn.addEventListener('click', async () => {
  const text = commentInput.value.trim();
  if (!text) return;

  const commentRef = ref(db, `days/${currentDayNumber}/comments`);
  await push(commentRef, {
    userId: currentUser.uid,
    nickname: nicknameInput.value.trim(),
    text,
    createdAt: Date.now()
  });

  commentInput.value = '';
});

// =====================
// Votaciones
// =====================
voteButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const choice = parseInt(btn.getAttribute('data-choice'));

    const voteRef = ref(db, `days/${currentDayNumber}/votes/${currentUser.uid}`);
    await set(voteRef, choice);

    alert("¡Voto registrado!");
  });
});
