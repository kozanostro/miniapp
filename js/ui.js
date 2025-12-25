(function(){
  const S = window.AppState;

  const el = (id) => document.getElementById(id);

  const screens = {
    start: el("screenStart"),
    diff: el("screenDifficulty"),
    style: el("screenStyle"),
    bet: el("screenBet"),
    game: el("screenGame"),
  };

  function showScreen(name){
    Object.values(screens).forEach(x => x.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function setSubtitle(text){
    el("subTitle").textContent = text;
  }

  function renderHero(){
    const html = `<img src="${S.player}" alt="hero">`;
    ["heroPreview","heroPreview2","heroPreview3","heroPreviewGame"].forEach(id=>{
      const node = el(id);
      if (node) node.innerHTML = html;
    });
  }

  function renderProfile(){
    const p = el("profile");
    if (!p) return;

    if (!S.user){
      p.innerHTML = `<div class="card">Открой Mini App через кнопку бота (в Telegram)</div>`;
      return;
    }
    const u = S.user;
    p.innerHTML = `
      <div class="card">
        <div style="font-size:18px;">Привет, <b>${u.first_name || "друг"}</b> 👋</div>
        <div>ID: <b>${u.id}</b></div>
        ${u.username ? `<div>@${u.username}</div>` : ""}
        <div class="muted" style="margin-top:6px;">Платформа: ${S.tg?.platform || "unknown"}</div>
      </div>
    `;
  }

  function renderWallet(){
    const w = el("wallet");
    if (!w) return;
    w.innerHTML = `Баланс: <b>${S.balance}</b> монет`;
  }

  function renderGameInfo(){
    const gi = el("gameInfo");
    if (!gi) return;
    gi.textContent = `Шаг 5/5 • Сложность: ${S.diff} • Стиль: ${S.style} • Ставка: ${S.bet}`;
  }

  window.UI = {
    el,
    showScreen,
    setSubtitle,
    renderHero,
    renderProfile,
    renderWallet,
    renderGameInfo
  };
})();

