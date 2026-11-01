/* =========================================================================
   Mission 4 – Der Wald der Verwechslungen
   Lernziel: sichere Entscheidungen im Umgang mit Wildpilzen.
   1. Alltagssituationen: Fips fragt, das Kind wählt die sichere Antwort.
      Bei zwei Situationen zeigen Fotopärchen, wie ähnlich sich Pilze sehen.
      (Nie wird anhand eines Fotos über Essbarkeit entschieden.)
   2. Die Pilzregel zusammensetzen (Entdecker: richtige Regel auswählen).
   Mit jeder sicheren Entscheidung lichtet sich der Nebel.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  MW.Screens.mission4 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, C = Ct.mission4, D = MW.Dialog.m4, UI = MW.UI;
      const level = MW.Store.settings.level;
      const list = C.byLevel[level] || C.byLevel.forscher;
      const total = list.length + 1; // + Regel
      let solved = 0;

      el.innerHTML = `
        <div class="m4-layout">
          <div class="m4-scene">
            <div class="m4-bg">${A.mistForest(0)}</div>
            <div class="m4-stage"></div>
            <div class="m4-fips" aria-hidden="true">${MW.Assets.char('fips', 'thinking')}</div>
          </div>
          <aside class="m4-board" aria-label="Fragen">
            <div class="board-inner">
              <div class="r-dots m4-dots"></div>
              <h2 class="board-h m4-h">Was ist sicher?</h2>
              <div class="m4-panel"></div>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m4-dialog"></div>`;

      const $ = (s) => el.querySelector(s);
      const stage = $('.m4-stage'), panel = $('.m4-panel'), heading = $('.m4-h');
      const setFips = (s) => { $('.m4-fips').innerHTML = MW.Assets.char('fips', s); };
      const clearMist = () => {
        solved++;
        const m = el.querySelector('.mist-layers');
        if (m) m.style.opacity = String(Math.max(0, 1 - solved / total));
      };
      const dots = (i) => { $('.m4-dots').innerHTML = Array.from({ length: total }, (_, k) => `<i class="${k < i ? 'is-done' : k === i ? 'is-cur' : ''}"></i>`).join(''); };
      const sayText = (s) => (level === 'entdecker' && s.easy ? s.easy : s.text);

      /* ---------- Situationen ---------- */
      let idx = -1;
      function nextSituation() {
        idx++;
        if (idx >= list.length) return startRule();
        dots(idx);
        const s = C.situations[list[idx]];
        setFips('thinking');
        heading.textContent = 'Was ist sicher?';
        stage.innerHTML = `<div class="sit-card">${A.sitArt(s.art)}</div>`;
        const opts = shuffle(s.options);
        panel.innerHTML = `<p class="sit-q">${UI.esc(sayText(s))}</p>
          <div class="opt-list">${opts.map((o) => `<button class="opt" data-id="${o.id}">${A.icon(o.icon, 'opt-ico')}<span>${UI.esc(o.label)}</span></button>`).join('')}</div>
          <button class="btn btn-soft btn-s m4-replay">${A.icon('soundOn')}<span>Frage und Antworten vorlesen</span></button>`;
        panel.querySelector('.m4-replay').onclick = () => MW.Voice.speak(`${sayText(s)} ${opts.map((o, k) => `${k + 1}: ${o.label}.`).join(' ')}`, 'fips');
        UI.task(D.task.situation);
        UI.say([{ who: 'fips', state: 'thinking', text: sayText(s) }]);
        panel.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
          const o = s.options.find((x) => x.id === b.dataset.id);
          if (o.right) {
            b.classList.add('is-right');
            panel.querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x !== b) x.classList.add('is-faded'); });
            clearMist(); setFips('happy');
            UI.say([D.right, { who: 'myra', state: 'encouraging', text: o.why }], { waitLast: true, onDone: () => (s.pair ? showPair(s.pair, nextSituation) : nextSituation()) });
          } else {
            b.classList.add('is-wrong', 'shake'); b.disabled = true;
            UI.say([D.wrong, { who: 'myra', state: 'thinking', text: o.why }]);
          }
        }));
      }

      /* ---------- Fotopärchen: „Fast gleich!“ ---------- */
      function pairCards(a, b, la, lb) {
        stage.innerHTML = `<div class="pair"><div class="pair-col"></div><div class="pair-vs">oder?</div><div class="pair-col"></div></div>`;
        const cols = stage.querySelectorAll('.pair-col');
        const ca = UI.photoCard(a, { caption: la, lens: level !== 'entdecker' });
        const cb = UI.photoCard(b, { caption: lb, cls: 'is-warn', lens: level !== 'entdecker' });
        cols[0].appendChild(ca.el); cols[1].appendChild(cb.el);
        requestAnimationFrame(() => { ca.el.classList.add('in'); cb.el.classList.add('in'); });
        return { ca, cb };
      }
      function showPair(key, done) {
        const P = C.pairs[key];
        heading.textContent = 'Fast gleich!';
        panel.innerHTML = `<p class="sit-q">Diese beiden Pilze sehen sich ähnlich – aber nur einer davon ist ungefährlich.</p><div class="row-btns left"><button class="btn btn-main m4-next" disabled>Weiter</button></div>`;
        const next = panel.querySelector('.m4-next');
        const cards = pairCards(P.a, P.b, P.labelA, P.labelB);
        UI.task(D.task.pair);
        const afterMain = () => {
          if (level === 'experte' && P.expert) return expertSpot(P, cards.cb, finishPair);
          if (level !== 'entdecker' && P.extra) {
            return UI.say([{ who: 'bruno', state: 'neutral', text: P.say }], {
              waitLast: true, onDone: () => { pairCards(P.extra.a, P.extra.b, P.extra.labelA, P.extra.labelB); UI.say([{ who: 'bruno', state: 'thinking', text: P.extra.say }, D.pairNext], { onDone: enableNext }); }
            });
          }
          UI.say([{ who: 'bruno', state: 'thinking', text: P.say }, D.pairNext], { onDone: enableNext });
        };
        const finishPair = () => UI.say([D.pairNext], { onDone: enableNext });
        function enableNext() { next.disabled = false; next.focus(); }
        next.onclick = () => done();
        if (level === 'experte' && P.expert) UI.say([{ who: 'bruno', state: 'thinking', text: P.say }], { waitLast: true, onDone: afterMain });
        else afterMain();
      }
      function expertSpot(P, card, then) {
        const E = P.expert;
        UI.say([{ who: 'bruno', state: 'encouraging', text: E.ask }]);
        const spots = Ct.photos[E.photo].spots[E.spot];
        const onTap = (e) => {
          const [x, y] = card.pct(e);
          const hit = spots.find(([sx, sy]) => Math.hypot(sx - x, (sy - y) * 0.9) < 16);
          if (hit) { card.box.removeEventListener('click', onTap); card.pin(hit[0], hit[1], 'Knolle'); UI.say([{ who: 'bruno', state: 'happy', text: E.found }], { waitLast: true, onDone: then }); }
          else { const m = card.pin(x, y, '', 'miss'); setTimeout(() => m.remove(), 900); UI.say([{ who: 'bruno', state: 'thinking', text: 'Schau ganz unten am Stiel.' }]); }
        };
        card.box.addEventListener('click', onTap);
      }

      /* ---------- Die Pilzregel ---------- */
      function startRule() {
        dots(list.length);
        heading.textContent = 'Die Pilzregel';
        setFips('encouraging');
        stage.innerHTML = `<div class="rule-board"><div class="rule-title">Unsere Pilzregel</div><div class="rule-lines"></div></div>`;
        const R = C.rules[level] || C.rules.forscher;
        UI.task(D.task.rule);
        UI.say(D.toRule, {
          waitLast: true,
          onDone: () => (R.pick ? rulePick(R) : ruleBuild(R))
        });
      }
      function rulePick(R) {
        panel.innerHTML = `<p class="sit-q">Welche Regel ist richtig?</p><div class="opt-list">${shuffle(R.pick).map((o) => `<button class="opt" data-id="${o.id}">${A.icon(o.right ? 'stopp' : 'mund', 'opt-ico')}<span>${UI.esc(o.text)}</span></button>`).join('')}</div>`;
        UI.say([{ who: 'myra', state: 'encouraging', text: 'Welche Regel ist richtig? Tippe darauf.' }]);
        panel.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
          const o = R.pick.find((x) => x.id === b.dataset.id);
          if (o.right) { b.classList.add('is-right'); stage.querySelector('.rule-lines').innerHTML = `<p class="rule-line is-done">${UI.esc(o.text)}</p>`; ruleDone(); }
          else { b.classList.add('is-wrong', 'shake'); b.disabled = true; UI.say([{ who: 'myra', state: 'thinking', text: o.why }]); }
        }));
      }
      let dnd = null;
      function ruleBuild(R) {
        const lines = stage.querySelector('.rule-lines');
        lines.innerHTML = R.sentences.map((sent, si) => `<div class="rule-line">${sent.map((_, wi) => `<span class="rslot" data-zone="${si}-${wi}" role="button" tabindex="0" aria-label="Platz ${wi + 1}"><b></b></span>`).join('')}</div>`).join('');
        const chunks = [];
        R.sentences.forEach((sent, si) => sent.forEach((w, wi) => chunks.push({ key: `${si}-${wi}`, w })));
        panel.innerHTML = `<p class="sit-q">Bring die Wortkarten in die richtige Reihenfolge.</p><div class="tray tray-words">${shuffle(chunks).map((c, k) => `<button class="word" data-key="${c.key}" aria-pressed="false" style="--k:${k}">${A.icon('soundOn', 'word-ico')}<span>${UI.esc(c.w)}</span></button>`).join('')}</div>`;
        UI.say([{ who: 'myra', state: 'encouraging', text: 'Tippe eine Wortkarte an und dann den passenden Platz. Oder ziehe sie.' }]);
        let placed = 0;
        dnd = MW.DnD.create({
          root: el, pieceSel: '.word', zoneSel: '.rslot',
          onPick: (p) => { if (MW.Store.settings.sound) MW.Voice.speak(p.textContent.trim(), 'myra'); },
          onDrop: (p, zone, z) => {
            if (p.dataset.key !== zone) { UI.say([D.ruleSlotWrong]); return false; }
            z.classList.add('is-filled', 'pop'); z.querySelector('b').textContent = p.textContent.trim();
            p.classList.add('is-used'); p.disabled = true; placed++;
            if (placed === chunks.length) ruleDone();
            return true;
          }
        });
      }
      function ruleDone() {
        clearMist();
        stage.querySelector('.rule-board').classList.add('is-done');
        dots(total);
        const full = (C.rules[level].sentences || []).map((s) => s.join(' ')).join(' ');
        UI.say([...D.ruleDone, ...(full ? [{ who: 'myra', state: 'neutral', text: full }] : [])], { waitLast: true, onDone: finish });
      }

      function finish() {
        heading.textContent = 'Fertig!';
        panel.innerHTML = `<div class="board-fips-done" aria-hidden="true">${MW.Assets.char('myra', 'happy')}</div>`;
        setFips('happy');
        UI.task(D.task.done);
        const ch = Ct.chapters[3];
        UI.say(D.end, {
          waitLast: true,
          onDone: () => {
            const first = MW.Store.completeChapter(4, ch.reward);
            UI.say(D.outro(ch.reward, first), { waitLast: true, onDone: () => UI.missionReward({ title: 'Der Nebel ist weg!', chapter: ch, first, who: 'fips' }) });
          }
        });
      }

      UI.say(D.intro, { waitLast: true, onDone: nextSituation });
      dots(0);
      return () => { if (dnd) dnd.destroy(); };
    }
  };
})();
