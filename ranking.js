import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const rankingDiv = document.getElementById("ranking");

async function loadRanking() {
  const snapshot = await get(ref(db, `users`));
  if (!snapshot.exists()) return;
  const users = snapshot.val();

  // Ordenar por influencia
  const sorted = Object.values(users).sort((a,b) => b.influence - a.influence);

  rankingDiv.innerHTML = "";
  sorted.forEach((u,i) => {
    const div = document.createElement("div");
    div.textContent = `#${i+1} ${u.nickname} (${u.influence} pts)`;
    rankingDiv.appendChild(div);
  });
}

loadRanking();
