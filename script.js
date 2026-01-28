// ===============================
// Conexión a Supabase
// ===============================
const SUPABASE_URL = 'https://ogdzctafbgsxqheddwtt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ofdvMab3zIgOH90NYG5crg_0B--Y2AZ';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Elementos del DOM
// ===============================
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

// ===============================
// Función para iniciar sesión anónimo y registrar nickname
// ===============================
startBtn.addEventListener('click', async () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname) return alert("Ingresa un nickname");

  // Login anónimo
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: `${nickname}@fuegoenlaisla.com`,
    password: '123456' // temporal, luego puede cambiar a OAuth o anónimo real
  }).catch(async () => {
    // Si no existe, registramos
    const { data: regData, error: regError } = await supabase.auth.signUp({
      email: `${nickname}@fuegoenlaisla.com`,
      password: '123456'
    });
    return { data: regData, error: regError };
  });

  if (authData) {
    userId = authData.user.id;

    // Guardar nickname en tabla users
    await supabase.from('users').upsert({ id: userId, nickname });

    // Ocultar login y mostrar juego
    loginScreen.style.display = 'none';
    gameScreen.style.display = 'flex';

    // Cargar capítulo del día
    loadChapter();
    loadCommentsRealtime();
  }
});

// ===============================
// Función para cargar capítulo del día
// ===============================
async function loadChapter() {
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .order('day_number', { ascending: false })
    .limit(1)
    .single();

  if (data) {
    currentDayId = data.id;
    dayTitle.textContent = `Día ${data.day_number}`;
    chapterText.textContent = data.chapter_text;
  }
}

// ===============================
// Función para enviar comentario
// ===============================
sendCommentBtn.addEventListener('click', async () => {
  const comment = commentInput.value.trim();
  if (!comment) return;

  await supabase.from('comments').insert({
    day_id: currentDayId,
    user_id: userId,
    comment
  });

  commentInput.value = '';
});

// ===============================
// Función para mostrar comentarios en tiempo real
// ===============================
async function loadCommentsRealtime() {
  // Carga inicial
  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(nickname)')
    .eq('day_id', currentDayId)
    .order('created_at', { ascending: true });

  commentsDiv.innerHTML = '';
  comments.forEach(c => {
    const div = document.createElement('div');
    div.textContent = `${c.users.nickname || 'Anon'}: ${c.comment}`;
    commentsDiv.appendChild(div);
  });

  // Suscripción realtime
  supabase
    .channel('comments')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, payload => {
      if (payload.new.day_id === currentDayId) {
        const div = document.createElement('div');
        div.textContent = `Anon: ${payload.new.comment}`;
        commentsDiv.appendChild(div);
      }
    })
    .subscribe();
}

// ===============================
// Función para enviar voto
// ===============================
voteButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const choice = parseInt(btn.getAttribute('data-choice'));

    // Insertar voto
    await supabase.from('votes').insert({
      day_id: currentDayId,
      user_id: userId,
      choice
    });

    alert('¡Voto registrado!');
  });
});
