import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

// Detectar usuario
let currentUser = null;
onAuthStateChanged(auth, user => {
  if (!user) return;
  currentUser = user;
  loadChapter();
  loadSidebar();
});

// Cargar capítulo del día anterior (simulado)
async function loadChapter() {
  const chapterText = document.getElementById("chapterText");
  const snapshot = await get(ref(db, `days`));
  if (snapshot.exists()) {
    const days = snapshot.val();
    const dayKeys = Object.keys(days);
    const lastDay = dayKeys[dayKeys.length - 1];
    chapterText.textContent = days[lastDay]?.text || "Aún no hay capítulo.";
  } else {
    chapterText.textContent = "Aún no hay capítulos.";
  }
}

// Cargar sidebar dinámico
async function loadSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const snapshot = await get(ref(db, `days`));
  if (!snapshot.exists()) return;
  const days = snapshot.val();
  const seasons = {};

  // Agrupar por mes
  for (let dayId in days) {
    const month = days[dayId].month || "Temporada X";
    if (!seasons[month]) seasons[month] = [];
    seasons[month].push({ id: dayId, day: days[dayId].day });
  }

  // Limpiar sidebar
  sidebar.innerHTML = `<h2>🔥 Fuego en la Isla</h2>`;

  for (let season in seasons) {
    const divSeason = document.createElement("div");
    divSeason.classList.add("season");

    const title = document.createElement("div");
    title.classList.add("season-title");
    title.textContent = season;
    divSeason.appendChild(title);

    seasons[season].forEach(d => {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");
      dayDiv.textContent = `Día ${d.day}`;
      divSeason.appendChild(dayDiv);
    });

    sidebar.appendChild(divSeason);
  }
}
