import { auth, db } from "./firebase-config.js";
import { ref, get, set, child } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const voteButtons = document.querySelectorAll(".vote-btn");

voteButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Inicia sesión primero");

    const option = btn.textContent;
    const voteRef = ref(db, `votes/today/${user.uid}`);

    // Guardar voto
    await set(voteRef, { option });

    alert(`Has votado por: ${option}`);
    btn.disabled = true;
  });
});
