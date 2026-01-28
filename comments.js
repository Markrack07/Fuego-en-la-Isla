import { auth, db } from "./firebase-config.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const sendBtn = document.querySelector(".send");
const commentBox = document.querySelector("textarea");
const commentsList = document.getElementById("commentsList");

sendBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Inicia sesión primero");
  if (!commentBox.value) return;

  const commentRef = ref(db, `comments/today`);
  await push(commentRef, {
    uid: user.uid,
    text: commentBox.value,
    timestamp: Date.now()
  });

  commentBox.value = "";
});

// Mostrar comentarios en tiempo real
const commentsRef = ref(db, `comments/today`);
onValue(commentsRef, snapshot => {
  commentsList.innerHTML = "";
  snapshot.forEach(s => {
    const data = s.val();
    const div = document.createElement("div");
    div.classList.add("comment");
    div.innerHTML = `<span>${data.uid}</span> <p>${data.text}</p>`;
    commentsList.appendChild(div);
  });
});
