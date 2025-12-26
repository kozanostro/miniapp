const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const table = document.getElementById("table");
const startBtn = document.getElementById("startBtn");
const playBtn = document.getElementById("playBtn");
const clearBtn = document.getElementById("clearBtn");

let started = false;

function createDomino(a, b) {
  const d = document.createElement("div");
  d.className = "domino";
  d.innerHTML = `<span>${a}</span><span>${b}</span>`;
  return d;
}

startBtn.onclick = () => {
  started = true;
  table.innerHTML = "";
};

playBtn.onclick = () => {
  if (!started) return;

  const a = Math.floor(Math.random() * 7);
  const b = Math.floor(Math.random() * 7);
  table.appendChild(createDomino(a, b));
};

clearBtn.onclick = () => {
  table.innerHTML = "";
};
