window.AppState = {
  tg: window.Telegram?.WebApp || null,
  user: null,

  step: 1,
  diff: "easy",
  style: "classic",
  bet: 10,

  // персонаж по сложности
  playerByDiff: {
    easy: "./assets/domino/players/p1.png",
    mid: "./assets/domino/players/p2.png",
    hard: "./assets/domino/players/p3.png",
    super: "./assets/domino/players/p4.png",
  },

  player: "./assets/domino/players/p1.png",

  // баланс локально
  balance: 1000,

  // игра
  game: null,
};

window.Storage = {
  keyBalance(uid){ return `miniapp_balance_${uid}`; },
  loadBalance(uid){
    const raw = localStorage.getItem(this.keyBalance(uid));
    const n = Number(raw);
    return Number.isFinite(n) ? n : 1000;
  },
  saveBalance(uid, v){
    localStorage.setItem(this.keyBalance(uid), String(v));
  }
};

