const tg = window.Telegram?.WebApp;

// ===== Screens =====
const screens = {
  home: document.getElementById("screen-home"),
  difficulty: document.getElementById("screen-difficulty"),
  style: document.getElementById("screen-style"),
  bet: document.getElementById("screen-bet"),
  game: document.getElementById("screen-game"),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ===== DOM =====
const titleEl = document.getElementById("title");
const profileEl = document.getElementById("profile");
const walletEl = document.getElementById("wallet");
const outputEl = document.getElementById("output");
const btnDebug = document.getElementById("btnDebug");

const btnPlus = document.getElementById("btnPlus");
const btnMinus = document.getElementById("btnMinus");
const btnReset = document.getElementById("btnReset");

const goDifficulty = document.getElementById("goDifficulty");
const backHome = document.getElementById("backHome");
const backDifficulty = document.getElementById("backDifficulty");
const backStyle = document.getElementById("backStyle");
const backBet = document.getElementById("backBet");

const btnPlay = document.getElementById("btnPlay");
const btnClear = document.getElementById("btnClear");
const gameInfo = document.getElementById("gameInfo");
const tableEl = document.getElementById("table");

// hero previews (один и тот же выбранный)
const heroPreview = document.getElementById("heroPreview");
const heroPreview2 = document.getElementById("heroPreview2");
const heroPreview3 = document.getElementById("heroPreview3");
const heroPreviewGame = document.getElementById("heroPreviewGame");

// ===== State =====
const state = {
  user: null,
  balance: 1000,
  diff: "easy",
  style: "classic",
  bet: 10,

  // выбранный игрок (один главный)
  player: "./assets/domino/players/p4.png",
};

// ===== Balance storage =====
function storageKey(userId) {
  return `miniapp_balance_${userId}`;
}
function loadBalance(userId) {
  const raw = localStorage.getItem(storageKey(userId));
  const n = Number(raw);
  return Number.isFinite(n) ? n : 1000;
}
function saveBalance(userId, v) {
  localStorage.setItem(storageKey(userId), String(v));
}

// ===== UI renders =====
function renderProfile() {
  if (!profileEl) return;

  if (!state.user) {
    profileEl.innerHTML = `<div class="card">Открой Mini App через кнопку бота (в Telegram)</div>`;
    return;
  }

  const u = state.user;
  profileEl.innerHTML = `
    <div class="card">
      <div style="font-size:18px;">Привет, <b>${u.first_name || "друг"}</b> 👋</div>
      <div>ID: <b>${u.id}</b></div>
      ${u.username ? `<div>@${u.username}</div>` : ""}
      <div class="muted" style="margin-top:6px;">Платформа: ${tg?.platform || "unknown"}</div>
    </div>
  `;
}

function renderWallet() {
  if (!walletEl) return;
  walletEl.innerHTML = `
    <div class="card">
      Баланс: <b>${state.balance}</b> монет
    </div>
  `;
}

function renderGameInfo() {
  if (!gameInfo) return;
  gameInfo.textContent = `Шаг 5/5 • Сложность: ${state.diff} • Стиль: ${state.style} • Ставка: ${state.bet}`;
}

function renderHero() {
  const html = `<img src="${state.player}" alt="hero">`;
  if (heroPreview) heroPreview.innerHTML = html;
  if (heroPreview2) heroPreview2.innerHTML = html;
  if (heroPreview3) heroPreview3.innerHTML = html;
  if (heroPreviewGame) heroPreviewGame.innerHTML = html;
}

// ===== Domino tile (simple animation) =====
function createDominoTile(a = 6, b = 6) {
  const tile = document.createElement("div");
  tile.style.position = "absolute";
  tile.style.width = "64px";
  tile.style.height = "128px";
  tile.style.borderRadius = "12px";
  tile.style.background = "#f2f2f2";
  tile.style.display = "grid";
  tile.style.gridTemplateRows = "1fr 1fr";
  tile.style.boxShadow = "0 10px 18px rgba(0,0,0,.45)";
  tile.style.zIndex = "10";

  const top = document.createElement("div");
  const bot = document.createElement("div");

  [top, bot].forEach(el => {
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.fontSize = "28px";
    el.style.fontWeight = "800";
    el.style.color = "#111";
  });

  top.textContent = a;
  bot.textContent = b;

  tile.appendChild(top);
  tile.appendChild(bot);
  return tile;
}

function placeTileAnimation() {
  if (!tableEl) return;

  const rect = tableEl.getBoundingClientRect();
  const from = { x: rect.width - 80, y: rect.height + 80, rot: 18 };
  const to = { x: Math.round(rect.width / 2 - 32), y: Math.round(rect.height / 2 - 64), rot: 0 };

  const tile = createDominoTile(6, 6);
  tableEl.appendChild(tile);

  tile.style.left = from.x + "px";
  tile.style.top = from.y + "px";
  tile.style.transform = `rotate(${from.rot}deg) scale(.9)`;
  tile.style.transition = "all 520ms ease";

  tile.offsetWidth; // reflow
  tile.style.left = to.x + "px";
  tile.style.top = to.y + "px";
  tile.style.transform = `rotate(${to.rot}deg) scale(1)`;
}

function clearTable() {
  if (!tableEl) return;
  tableEl.innerHTML = "";
}

// ===== Events: Navigation =====
function bindNavigation() {
  goDifficulty.onclick = () => {
    renderHero();
    showScreen("difficulty");
  };

  backHome.onclick = () => showScreen("home");
  backDifficulty.onclick = () => showScreen("difficulty");
  backStyle.onclick = () => showScreen("style");
  backBet.onclick = () => showScreen("bet");

  // difficulty -> style
  document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.addEventListener("click", () => {
      state.diff = btn.dataset.diff;

      // p4 = супер сложность (Boss)
      if (state.diff === "super") {
        state.player = "./assets/domino/players/p4.png";
      } else {
        // пока по умолчанию игрок = p4
        state.player = "./assets/domino/players/p4.png";
      }

      renderHero();
      showScreen("style");
    });
  });

  // style -> bet
  document.querySelectorAll('[data-style]').forEach(btn => {
    btn.addEventListener("click", () => {
      state.style = btn.dataset.style;
      renderHero();
      showScreen("bet");
    });
  });

  // bet -> game
  document.querySelectorAll('[data-bet]').forEach(btn => {
    btn.addEventListener("click", () => {
      state.bet = Number(btn.dataset.bet);

      renderGameInfo();
      renderHero();
      clearTable(); // стол чистый при входе

      showScreen("game");
    });
  });
}

// ===== Events: Balance =====
function bindBalance() {
  btnPlus.onclick = () => {
    state.balance += 10;
    saveBalance(state.user.id, state.balance);
    renderWallet();
  };
  btnMinus.onclick = () => {
    state.balance -= 10;
    saveBalance(state.user.id, state.balance);
    renderWallet();
  };
  btnReset.onclick = () => {
    state.balance = 1000;
    saveBalance(state.user.id, state.balance);
    renderWallet();
  };
}

// ===== Events: Game =====
function bindGame() {
  btnPlay.onclick = placeTileAnimation;
  btnClear.onclick = clearTable;
}

// ===== Debug =====
function bindDebug() {
  btnDebug.onclick = () => {
    outputEl.style.display = "block";
    outputEl.textContent = JSON.stringify(
      { initDataUnsafe: tg?.initDataUnsafe, state },
      null,
      2
    );
  };
}

// ===== Init =====
function init() {
  if (!tg) {
    titleEl.textContent = "Domino (не в Telegram)";
    showScreen("home");
    return;
  }

  tg.ready();
  tg.expand();

  state.user = tg.initDataUnsafe?.user || null;
  renderProfile();

  if (!state.user) {
    showScreen("home");
    return;
  }

  state.balance = loadBalance(state.user.id);
  renderWallet();

  bindNavigation();
  bindBalance();
  bindGame();
  bindDebug();

  renderGameInfo();
  renderHero();

  showScreen("home");
}

init();

