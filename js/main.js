(function(){
  function safeEl(id){
    return document.getElementById(id);
  }

  function boot(){
    const S = window.AppState;
    const UI = window.UI;

    // TG init
    if (S.tg){
      S.tg.ready();
      S.tg.expand();
      S.user = S.tg.initDataUnsafe?.user || null;
    } else {
      S.user = null;
    }

    UI.renderProfile();

    // баланс
    if (S.user?.id){
      S.balance = window.Storage.loadBalance(S.user.id);
      UI.renderWallet();

      const btnPlus = UI.el("btnPlus");
      if (btnPlus) btnPlus.onclick = () => {
        S.balance += 10;
        window.Storage.saveBalance(S.user.id, S.balance);
        UI.renderWallet();
      };

      const btnMinus = UI.el("btnMinus");
      if (btnMinus) btnMinus.onclick = () => {
        S.balance -= 10;
        window.Storage.saveBalance(S.user.id, S.balance);
        UI.renderWallet();
      };

      const btnReset = UI.el("btnReset");
      if (btnReset) btnReset.onclick = () => {
        S.balance = 1000;
        window.Storage.saveBalance(S.user.id, S.balance);
        UI.renderWallet();
      };
    }

    // стартовые значения
    S.diff = "easy";
    S.style = "classic";
    S.bet = 10;
    S.player = S.playerByDiff.easy;
    UI.renderHero();
    UI.renderGameInfo();

    // навигация
    const btnStart = UI.el("btnStart");
    if (btnStart) btnStart.onclick = () => {
      UI.setSubtitle("Шаг 2/5 • Сложность");
      UI.renderHero();
      UI.showScreen("diff");
    };

    const backToStart = UI.el("backToStart");
    if (backToStart) backToStart.onclick = () => {
      UI.setSubtitle("Шаг 1/5 • Старт");
      UI.showScreen("start");
    };

    const backToDiff = UI.el("backToDiff");
    if (backToDiff) backToDiff.onclick = () => {
      UI.setSubtitle("Шаг 2/5 • Сложность");
      UI.showScreen("diff");
    };

    const backToStyle = UI.el("backToStyle");
    if (backToStyle) backToStyle.onclick = () => {
      UI.setSubtitle("Шаг 3/5 • Стиль");
      UI.showScreen("style");
    };

    const backToBet = UI.el("backToBet");
    if (backToBet) backToBet.onclick = () => {
      UI.setSubtitle("Шаг 4/5 • Ставка");
      UI.showScreen("bet");
    };

    // difficulty buttons
    document.querySelectorAll("[data-diff]").forEach(btn=>{
      btn.addEventListener("click", () => {
        S.diff = btn.dataset.diff;
        S.player = S.playerByDiff[S.diff] || S.playerByDiff.easy;
        UI.renderHero();
        UI.setSubtitle("Шаг 3/5 • Стиль");
        UI.showScreen("style");
      });
    });

    // style buttons
    document.querySelectorAll("[data-style]").forEach(btn=>{
      btn.addEventListener("click", () => {
        S.style = btn.dataset.style;
        UI.renderHero();
        UI.setSubtitle("Шаг 4/5 • Ставка");
        UI.showScreen("bet");
      });
    });

    // bet buttons
    document.querySelectorAll("[data-bet]").forEach(btn=>{
      btn.addEventListener("click", () => {
        S.bet = Number(btn.dataset.bet) || 10;
        UI.renderHero();
        UI.renderGameInfo();

        UI.setSubtitle("Шаг 5/5 • Игра");
        UI.showScreen("game");

        window.Game.startNewGame();
      });
    });

    // game buttons
    const btnNewGame = UI.el("btnNewGame");
    if (btnNewGame) btnNewGame.onclick = () => window.Game.startNewGame();

    const btnDraw = UI.el("btnDraw");
    if (btnDraw) btnDraw.onclick = () => window.Game.playerDraw();

    const btnClear = UI.el("btnClear");
    if (btnClear) btnClear.onclick = () => window.Game.clearGame();

    // debug
    const btnDebug = UI.el("btnDebug");
    if (btnDebug) btnDebug.onclick = () => {
      const out = UI.el("debugOut");
      if (!out) return;
      out.style.display = out.style.display === "none" ? "block" : "none";
      out.textContent = JSON.stringify({
        diff: S.diff, style: S.style, bet: S.bet, balance: S.balance,
        user: S.user,
        tg: S.tg ? { platform:S.tg.platform, version:S.tg.version } : null
      }, null, 2);
    };

    UI.setSubtitle("Шаг 1/5 • Старт");
    UI.showScreen("start");
  }

  // Ключевой момент: стартуем только когда DOM готов
  document.addEventListener("DOMContentLoaded", boot);
})();
