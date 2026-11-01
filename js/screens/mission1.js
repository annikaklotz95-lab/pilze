/* =========================================================================
   Mission 1 – „Wer bin ich?“  am geheimnisvollen Waldtor
   Spielhandlung: Hinweissteine aktivieren → Silhouette wird klarer →
   Vermutung abgeben → Tor öffnet sich → Bruno und das Myzel erscheinen.
   Fehler führen zu einer Erklärung und einem weiteren Hinweis.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  MW.Screens.mission1 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, C = MW.Content.mission1, D = MW.Dialog.m1, UI = MW.UI;
      const level = MW.Store.settings.level;
      const hints = C.hints;
      const st = { revealed: 0, wrong: new Set(), solved: false, busy: false, cardsShown: false };

      el.innerHTML = `
        <div class="m1-layout">
          <div class="m1-scene">${A.gateScene()}</div>
          <aside class="m1-board" aria-label="Hinweise und Auswahl">
            <div class="board-inner">
              <h2 class="board-h">Hinweise</h2>
              <ol class="hint-row">${hints.map((h, i) => `<li><button class="hint-slot is-locked" data-i="${i}" aria-label="Hinweis ${i + 1}" disabled><span class="hs-num">${i + 1}</span></button></li>`).join('')}</ol>
              <div class="guess-area" hidden>
                <h2 class="board-h">Wer ist der Bewohner?</h2>
                <div class="cards"></div>
              </div>
              <div class="board-fips" aria-hidden="true">${MW.Assets.char('fips', 'thinking')}</div>
              <p class="board-wait">Tippe auf den leuchtenden Stein am Tor.</p>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m1-dialog"></div>`;

      const svg = el.querySelector('.scene-gate');
      const stones = [...svg.querySelectorAll('.hstone')];
      const slots = [...el.querySelectorAll('.hint-slot')];
      const sil = svg.querySelector('.mystery-silhouette');
      const guessArea = el.querySelector('.guess-area');
      const cardsEl = el.querySelector('.cards');
      const wait = el.querySelector('.board-wait');

      function hintText(i) { return hints[i][level] || hints[i].forscher; }

      function refreshStones() {
        stones.forEach((s, i) => {
          s.classList.toggle('is-lit', i < st.revealed);
          s.classList.toggle('is-next', i === st.revealed && !st.solved);
          s.setAttribute('tabindex', i <= st.revealed ? '0' : '-1');
          const ico = s.querySelector('.hs-ico');
          if (i < st.revealed && !ico.innerHTML) ico.innerHTML = A.HINT_ICONS[hints[i].icon];
        });
        slots.forEach((b, i) => {
          b.classList.toggle('is-locked', i > st.revealed || (i === st.revealed && st.solved));
          b.classList.toggle('is-next', i === st.revealed && !st.solved);
          b.classList.toggle('is-done', i < st.revealed);
          b.disabled = i > st.revealed || (st.solved && i >= st.revealed);
          if (i < st.revealed && !b.dataset.filled) { b.dataset.filled = '1'; b.innerHTML = A.hintIcon(hints[i].icon); b.setAttribute('aria-label', `Hinweis ${i + 1} noch einmal hören`); }
          if (i === st.revealed && !st.solved) b.setAttribute('aria-label', `Hinweis ${i + 1} hören`);
        });
        const blur = Math.max(0, 4 - st.revealed);
        sil.setAttribute('filter', blur ? `url(#f-blur${blur})` : '');
        if (st.revealed >= hints.length) wait.hidden = true;
      }

      function nextHint(afterWrong) {
        if (st.solved || st.revealed >= hints.length) return;
        const i = st.revealed;
        st.revealed++;
        refreshStones();
        const lines = [{ who: 'mystery', state: 'neutral', text: hintText(i) }];
        const showCards = !st.cardsShown && st.revealed >= C.showCardsAfter;
        UI.say(lines, {
          waitLast: showCards || afterWrong,
          onDone: () => {
            if (showCards) { revealCards(); UI.say(D.cardsAppear); UI.task(D.task.guess); }
            else if (afterWrong) { UI.say([{ who: 'myra', state: 'encouraging', text: st.revealed >= hints.length ? D.noMoreHints.text : 'Wer könnte es sein? Tippe auf ein Bild – oder hör noch einen Hinweis.' }]); }
          }
        });
        if (!st.cardsShown) wait.textContent = st.revealed < C.showCardsAfter ? 'Es gibt noch mehr Hinweise. Tippe auf den nächsten leuchtenden Stein.' : '';
      }

      function replayHint(i) { UI.say([{ who: 'mystery', state: 'neutral', text: hintText(i) }]); }

      function revealCards() {
        st.cardsShown = true; wait.hidden = true; guessArea.hidden = false;
        el.querySelector('.board-fips').hidden = true;
        const opts = shuffle(C.optionsByLevel[level] || C.optionsByLevel.forscher);
        cardsEl.className = `cards n${opts.length}`;
        cardsEl.innerHTML = opts.map((id, k) => `<button class="pcard" data-id="${id}" style="--k:${k}">
            <span class="pcard-pic">${MW.Assets.pic(id)}</span><span class="pcard-label">${C.options[id].label}</span></button>`).join('');
        cardsEl.querySelectorAll('.pcard').forEach((b) => b.addEventListener('click', () => guess(b)));
      }

      function guess(btn) {
        if (st.solved || st.busy) return;
        const id = btn.dataset.id;
        const opt = C.options[id];
        if (opt.correct) return solve(btn);
        if (st.wrong.has(id)) { UI.say([D.wrongIntro, { who: 'myra', state: 'neutral', text: opt.why }]); return; }
        st.wrong.add(id);
        btn.classList.add('is-wrong');
        btn.setAttribute('aria-label', `${opt.label} – passt nicht`);
        const more = st.revealed < hints.length;
        UI.say([D.wrongIntro, { who: 'myra', state: 'thinking', text: opt.why }, more ? D.moreHint : D.noMoreHints], {
          waitLast: more,
          onDone: () => { if (more) nextHint(true); }
        });
      }

      function solve(btn) {
        st.solved = true; st.busy = true;
        btn.classList.add('is-right');
        cardsEl.querySelectorAll('.pcard').forEach((b) => { if (b !== btn) b.classList.add('is-faded'); b.disabled = true; });
        refreshStones();
        UI.task(D.task.done);
        UI.say(D.correct, {
          waitLast: true,
          onDone: () => {
            openGate();
            setTimeout(() => {
              UI.say(D.reveal[level] || D.reveal.forscher, {
                waitLast: true,
                onDone: () => (level === 'entdecker' ? finish() : bonus())
              });
            }, document.documentElement.classList.contains('rm') ? 100 : 1500);
          }
        });
      }

      function openGate() {
        svg.classList.add('is-open');
        stones.forEach((s) => s.classList.add('is-lit'));
        sil.setAttribute('filter', '');
        const reveal = svg.querySelector('.bruno-reveal');
        reveal.innerHTML = MW.Assets.char('bruno', 'happy').replace('<svg ', '<svg x="0" y="-10" width="220" height="260" ');
      }

      function bonus() {
        const B = C.bonus;
        const ids = B.byLevel[level] || B.byLevel.forscher;
        UI.task(D.task.bonus);
        el.querySelector('.guess-area .board-h').textContent = 'Was wächst unter der Erde?';
        cardsEl.className = `cards n${ids.length} is-bonus`;
        cardsEl.innerHTML = shuffle(ids).map((id, k) => `<button class="pcard" data-id="${id}" style="--k:${k}"><span class="pcard-pic">${MW.Assets.pic(id)}</span><span class="pcard-label">${B.options[id].label}</span></button>`).join('');
        UI.say([{ who: 'bruno', state: 'thinking', text: B.question }]);
        cardsEl.querySelectorAll('.pcard').forEach((b) => b.addEventListener('click', () => {
          const o = B.options[b.dataset.id];
          if (o.correct) {
            b.classList.add('is-right');
            cardsEl.querySelectorAll('.pcard').forEach((x) => { x.disabled = true; if (x !== b) x.classList.add('is-faded'); });
            svg.classList.add('show-myzel');
            UI.say(D.bonusRight, { waitLast: true, onDone: finish });
          } else {
            b.classList.add('is-wrong');
            UI.say([D.bonusWrongIntro, { who: 'bruno', state: 'encouraging', text: o.why }]);
          }
        }));
      }

      function finish() {
        svg.classList.add('show-myzel', 'is-bloom');
        const ch = MW.Content.chapters[0];
        const first = MW.Store.completeChapter(1, ch.reward);
        UI.say(D.outro(ch.reward, first), {
          waitLast: true,
          onDone: () => {
            UI.missionReward({ title: 'Das Waldtor ist offen!', chapter: ch, first });
          }
        });
      }

      // Eingaben: Steine im Bild und Hinweis-Leiste
      const onStone = (i) => {
        if (st.busy && !st.solved) return;
        if (i === st.revealed && !st.solved) nextHint(false);
        else if (i < st.revealed) replayHint(i);
      };
      stones.forEach((s, i) => {
        s.addEventListener('click', () => onStone(i));
        s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStone(i); } });
      });
      slots.forEach((b, i) => b.addEventListener('click', () => onStone(i)));

      refreshStones();
      UI.task(D.task.stone);
      UI.say(D.intro);
    }
  };
})();
