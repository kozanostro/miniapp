(function(){
  const S = window.AppState;
  const UI = window.UI;

  function initTG(){
    if (!S.tg) return;
    S.tg.ready();
    S.tg.expand();
  }

  function initUser(){
    if (!S.tg) return null;
    return S.tg.initDataUnsafe?.user || null;
  }

  function applyStyle(){
    // пока просто заглушка (можно потом менять css-переменные)
    // style: classic / dark
  }

  function bindNav(){
    UI.el("btnStart").onclick = () => {
      UI.setSubtitle("Шаг 2/5 • Сложность");
      UI.renderHero();
      UI.showScreen("diff");
    };

    UI.el("backToStart").onclick = () => {
      UI.setSubtitle("Шаг 1/5 • Старт");
      UI.showScreen("start");
    };

    UI.el("backToDiff").onclick = () => {
      UI.setSubtitle("Шаг 2/5 • Сложность");
      UI.showScreen("diff");
    };

    UI.el("backToStyle").onclick = () => {
      UI.setSubtitle("Шаг 3/5 • Стиль");
      UI.showScreen("style");
    };

    UI.el("backToBet").onclick = () => {
      UI.setSubtitle("Шаг 4/5 • Ставка");
      UI.showScreen("bet");
    };
  }

  function bindDifficulty(){
    document.querySelectorAll("[data-diff]").forEach(btn=>{
      btn.onclick = () => {
        S.diff = btn.dataset.diff;
        S.player = S.playerByDiff[S.diff] || S.playerByDiff.easy;
        UI.renderHero();

        UI.setSubtitle("Шаг 3/5 • Стиль");
        UI.showScreen("style");
      };
    });
  }

  function bindStyle(){
    document.querySelectorAll("[data-style]").forEach(btn=>{
      btn.onclick = () => {
        S.style = btn.dataset.style;
        applyStyle();
        UI.renderHero();

        UI.setSubtitle("Шаг 4/5 • Ставка");
        UI.showScreen("bet");
      };
    });
  }

  function bindBet(){
    document.querySelectorAll("[data-bet]").forEach(btn=>{
      btn.onclick = () => {
        S.bet = Number(btn.dataset.bet) || 10;

        UI.renderHero();
        UI.renderGameInfo();

        UI.setSubtitle("Шаг 5/5 • Игра");
        UI.showScreen("game");

        // стартуем игру сразу (чтобы не было пусто)
        window.Game.startNewGame();
      };
    });
  }

  function bindWallet(){
    const uid = S.user?.id;
    if (!uid) return;

    S.balance = window.Storage.loadBalance(uid);
    UI.renderWallet();

    UI.el("btnPlus").onclick = () => {
      S.balance += 10;
      window.Storage.saveBalance(uid, S.balance);
      UI.renderWallet();
    };
    UI.el("btnMinus").onclick = () => {
      S.balance -= 10;
      window.Storage.saveBalance(uid, S.balance);
      UI.renderWallet();
    };
    UI.el("btnReset").onclick = () => {
      S.balance = 1000;
      window.Storage.saveBalance(uid, S.balance);
      UI.renderWallet();
    };
  }

  function bindGameButtons(){
    UI.el("btnNewGame").onclick = () => window.Game.startNewGame();
    UI.el("btnClear").onclick = () => window.Game.clearGame();
  }

  function bindDebug(){
    UI.el("btnDebug").onclick = () => {
      const out = UI.el("debugOut");
      out.style.display = out.style.display === "none" ? "block" : "none";
      out.textContent = JSON.stringify({
        diff: S.diff, style: S.style, bet: S.bet, balance: S.balance,
        user: S.user,
        tg: S.tg ? { platform:S.tg.platform, version:S.tg.version } : null
      }, null, 2);
    };
  }

  function boot(){
    initTG();

    S.user = initUser();
    UI.renderProfile();

    // если не Telegram — всё равно откроется, но профиля не будет
    if (S.user){
      bindWallet();
    }

    // стартовые значения
    S.player = S.playerByDiff.easy;
    UI.renderHero();
    UI.renderGameInfo();

    bindNav();
    bindDifficulty();
    bindStyle();
    bindBet();
    bindGameButtons();
    bindDebug();

    UI.setSubtitle("Шаг 1/5 • Старт");
    UI.showScreen("start");
  }

  boot();
})();

