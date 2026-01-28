const modeBtn = document.getElementById("modeBtn");
if (modeBtn) {
  modeBtn.addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("fire")) {
      body.classList.remove("fire");
      body.classList.add("night");
      modeBtn.textContent = "🌙 Modo Noche";
    } else {
      body.classList.remove("night");
      body.classList.add("fire");
      modeBtn.textContent = "🔥 Modo Fuego";
    }
  });
}
