const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const table = document.getElementById("table");
const tilesLayer = document.getElementById("tilesLayer");
const startBtn = document.getElementById("startBtn");
const playBtn = document.getElementById("playBtn");
const clearBtn = document.getElementById("clearBtn");

let started = false;

// !!! ВПИШИ ТУТ ТОЧНОЕ ИМЯ ФАЙЛА СТОЛА ИЗ assets !!!
const TABLE_FILE = "table.png"; // <-- поменяй на своё имя, если не table.png

const TABLE_URL = `./assets/${TABLE_FILE}?v=9`;
table.style.backgroundImage = `url("${TABLE_URL}")`;
table.style.backgroundSize = "cover";
table.style.backgroundPosition = "center bottom";
table.style.backgroundRepeat = "no-repeat";

function createDomino(a, b) {
  const d = document.createElement("div");
  d.className = "domino";
  d.innerHTML = `<span>${a}</span><span>${b}</span>`;
  return d;
}

startBtn.onclick = () => {
  started = true;
  tilesLayer.innerHTML = "";
};

playBtn.onclick = () => {
  if (!started) return;
  const a = Math.floor(Math.random() * 7);
  const b = Math.floor(Math.random() * 7);
  tilesLayer.appendChild(createDomino(a, b));
};

clearBtn.onclick = () => {
  tilesLayer.innerHTML = "";
};
