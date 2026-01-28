// ===============================
// Conexión a Supabase
// ===============================
const SUPABASE_URL = 'https://ogdzctafbgsxqheddwtt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ofdvMab3zIgOH90NYG5crg_0B--Y2AZ';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const nicknameInput = document.getElementById('nickname');
const startBtn = document.getElementById('start-btn');

const dayTitle = document.getElementById('day-title');
const chapterText = document.getElementById('chapter-text');

const commentsDiv = document.getElementById('comments');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment');

const voteButtons = document.querySelectorAll('.vote-buttons button');

let userId = null;
let currentDayId = null;

startBtn.addEventListener('click', async () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname) return alert("Ingresa un nickname");

  // Login anónimo real
  const { data: authData, error } = await supabase.auth.signInWithOAuth({
    provider: 'email' // para login anónimo usamos signInAnonymously
  }).catch(() => null);

  // Alternativa correcta: login anónimo moderno
  const { data, error: anonError } = await supabase.auth.signInAnonymously();
  if (anonError) return alert("Error de login: " + anonError.message);

  userId = data.user.id;

  // Guardar nickname en tabla users
  await supabase.from('users').upsert({
    id: userId,
    nickname
  });

  // Ocultar login y mostrar juego
  loginScreen.style.display = 'none';
  gameScreen.style.display = 'flex';

  // Cargar capítulo del día
  loadChapter();
  loadCommentsRealtime();
});
