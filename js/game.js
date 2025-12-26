(function(){
  const S = window.AppState;
  const { el } = window.UI;

  function makeSet(){
    const tiles = [];
    for (let a=0;a<=6;a++){
      for (let b=a;b<=6;b++){
        tiles.push({a,b});
      }
    }
    return tiles;
  }

  function shuffle(arr){
    for (let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }

  function canPlay(tile, leftEnd, rightEnd){
    if (leftEnd === null && rightEnd === null) return true;
    return tile.a===leftEnd || tile.b===leftEnd || tile.a===rightEnd || tile.b===rightEnd;
  }

  function hasAnyLegalMove(hand, leftEnd, rightEnd){
    return hand.some(t => canPlay(t, leftEnd, rightEnd));
  }

  function applyTile(chain, tile){
    if (chain.tiles.length===0){
      chain.tiles.push({ ...tile, flip:false });
      chain.leftEnd = tile.a;
      chain.rightEnd = tile.b;
      return true;
    }

    if (tile.a === chain.rightEnd){
      chain.tiles.push({ ...tile, flip:false });
      chain.rightEnd = tile.b;
      return true;
    }
    if (tile.b === chain.rightEnd){
      chain.tiles.push({ ...tile, flip:true });
      chain.rightEnd = tile.a;
      return true;
    }

    if (tile.a === chain.leftEnd){
      chain.tiles.unshift({ ...tile, flip:true });
      chain.leftEnd = tile.b;
      return true;
    }
    if (tile.b === chain.leftEnd){
      chain.tiles.unshift({ ...tile, flip:false });
      chain.leftEnd = tile.a;
      return true;
    }

    return false;
  }

  function makeGame(){
    const deck = shuffle(makeSet());
    const player = deck.splice(0,7);
    const bot = deck.splice(0,7);

    const chain = { tiles:[], leftEnd:null, rightEnd:null };

    return {
      deck,
      player,
      bot,
      chain,
      turn: "player",
      status: "playing",
    };
  }

  function renderChain(){
    const chainEl = el("chain");
    const endsEl = el("chainEnds");
    const deckEl = el("deckCount");
    if (!chainEl) return;

    const g = S.game;
    chainEl.innerHTML = "";

    if (deckEl) deckEl.textContent = g ? String(g.deck.length) : "—";

    if (!g || g.chain.tiles.length===0){
      if (endsEl) endsEl.textContent = "—";
      return;
    }

    if (endsEl) endsEl.textContent = `${g.chain.leftEnd} … ${g.chain.rightEnd}`;

    g.chain.tiles.slice(-9).forEach(t=>{
      const a = t.flip ? t.b : t.a;
      const b = t.flip ? t.a : t.b;
      const div = document.createElement("div");
      div.className = "tile tileSmall";
      div.innerHTML = `<span>${a}</span><div class="split"></div><span>${b}</span>`;
      chainEl.appendChild(div);
    });
  }

  function renderHand(){
    const handEl = el("hand");
    const hintEl = el("hint");
    const turnEl = el("turnLabel");
    const btnDraw = el("btnDraw");
    if (!handEl) return;

    const g = S.game;
    if (!g){
      handEl.innerHTML = "";
      if (hintEl) hintEl.textContent = "";
      if (turnEl) turnEl.textContent = "—";
      if (btnDraw) btnDraw.disabled = true;
      return;
    }

    if (turnEl) turnEl.textContent = g.turn === "player" ? "Ты" : "Бот";

    const leftEnd = g.chain.leftEnd;
    const rightEnd = g.chain.rightEnd;

    let anyLegal = false;
    handEl.innerHTML = "";

    g.player.forEach((t, idx)=>{
      const legal = canPlay(t, leftEnd, rightEnd);
      if (legal) anyLegal = true;

      const btn = document.createElement("button");
      btn.title = legal ? "Сыграть" : "Не подходит";
      btn.disabled = !legal || g.turn !== "player" || g.status!=="playing";

      const tile = document.createElement("div");
      tile.className = "tile";
      tile.style.opacity = legal ? "1" : "0.35";
      tile.innerHTML = `<span>${t.a}</span><div class="split"></div><span>${t.b}</span>`;

      btn.appendChild(tile);

      btn.onclick = () => {
        if (g.turn !== "player") return;
        if (!canPlay(t, g.chain.leftEnd, g.chain.rightEnd)) return;

        g.player.splice(idx,1);
        applyTile(g.chain, t);

        checkEndOrBot();
        renderAll();
      };

      handEl.appendChild(btn);
    });

    // кнопка "Добрать": активна только если нет хода и есть колода
    if (btnDraw){
      const hasMove = hasAnyLegalMove(g.player, leftEnd, rightEnd);
      btnDraw.disabled = hasMove || g.turn !== "player" || g.status !== "playing" || g.deck.length === 0;
    }

    if (hintEl){
      const hasMove = hasAnyLegalMove(g.player, leftEnd, rightEnd);

      if (g.status !== "playing") {
        hintEl.textContent = "Игра закончена. Нажми «Новая игра».";
      } else if (g.turn !== "player"){
        hintEl.textContent = "Ход бота…";
      } else if (!hasMove) {
        hintEl.textContent = g.deck.length > 0
          ? "Нет хода. Нажми «Добрать»."
          : "Нет хода и колода пустая. Нажми «Новая игра».";
      } else {
        hintEl.textContent = "Выбери подходящую кость и тапни.";
      }
    }
  }

  function checkWinner(){
    const g = S.game;
    if (!g) return null;
    if (g.player.length === 0) return "player";
    if (g.bot.length === 0) return "bot";
    return null;
  }

  function botMove(){
    const g = S.game;
    if (!g || g.status!=="playing") return;

    const leftEnd = g.chain.leftEnd;
    const rightEnd = g.chain.rightEnd;

    const legal = g.bot
      .map((t, i) => ({t,i}))
      .filter(x => canPlay(x.t, leftEnd, rightEnd));

    if (legal.length === 0){
      // добор для бота (упрощённо): если есть колода — добираем 1 и пробуем снова
      if (g.deck.length > 0){
        g.bot.push(g.deck.pop());
        return botMove();
      }
      g.status = "ended";
      return;
    }

    let pick;
    if (S.diff === "super" || S.diff === "hard"){
      pick = legal.slice().sort((a,b)=> (b.t.a+b.t.b) - (a.t.a+a.t.b))[0];
    } else {
      pick = legal[Math.floor(Math.random()*legal.length)];
    }

    g.bot.splice(pick.i,1);
    applyTile(g.chain, pick.t);
  }

  function checkEndOrBot(){
    const g = S.game;
    const winner = checkWinner();
    if (winner){
      g.status = "ended";
      return;
    }

    g.turn = "bot";

    setTimeout(()=>{
      botMove();

      const w2 = checkWinner();
      if (w2) g.status = "ended";

      g.turn = "player";
      renderAll();
    }, 450);
  }

  function renderAll(){
    window.UI.renderGameInfo();
    renderChain();
    renderHand();
  }

  function startNewGame(){
    S.game = makeGame();
    renderAll();
  }

  function clearGame(){
    S.game = null;
    const chainEl = el("chain"); if (chainEl) chainEl.innerHTML = "";
    const handEl = el("hand"); if (handEl) handEl.innerHTML = "";
    const endsEl = el("chainEnds"); if (endsEl) endsEl.textContent = "—";
    const turnEl = el("turnLabel"); if (turnEl) turnEl.textContent = "—";
    const hintEl = el("hint"); if (hintEl) hintEl.textContent = "";
    const deckEl = el("deckCount"); if (deckEl) deckEl.textContent = "—";
  }

  function playerDraw(){
    const g = S.game;
    if (!g || g.status !== "playing") return;
    if (g.turn !== "player") return;
    if (g.deck.length === 0) return;

    // добираем 1 кость
    g.player.push(g.deck.pop());
    renderAll();
  }

  window.Game = {
    startNewGame,
    playerDraw,
    clearGame,
    renderAll
  };
})();
