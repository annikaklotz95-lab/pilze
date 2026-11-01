/* =========================================================================
   Mission 2 – Die Pilzwerkstatt
   Spielhandlung: Brunos zerpustete Zeichnung zusammensetzen (Teile an ihren
   Platz bringen) → Wortschilder zuordnen → (Pilzexperten) Fruchtkörper und
   Myzel einordnen. Alles per Antippen oder Ziehen.
   Stufe 1 Entdecker: Hut, Stiel · Stufe 2 Forscher: + Röhren ·
   Stufe 3 Pilzexperte: + Myzel, Fruchtkörper/Myzel einordnen
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  MW.Screens.mission2 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, C = MW.Content.mission2, D = MW.Dialog.m2, UI = MW.UI;
      const level = MW.Store.settings.level;
      const cfg = C.levels[level] || C.levels.forscher;
      const st = { phase: 'build', placed: new Set(), filled: {} };
      const steps = [['build', 'Zusammensetzen'], ['label', 'Beschriften']].concat(cfg.classify ? [['classify', 'Einordnen']] : [], [['photo', 'Echter Pilz']]);
      const P = MW.Content.mission2Photo;

      el.innerHTML = `
        <div class="m2-layout">
          <div class="m2-scene">
            <div class="m2-bg">${A.workshopScene(false)}</div>
            <div class="m2-sheet"></div>
            <div class="m2-photo" hidden></div>
            <div class="m2-bruno" aria-hidden="true">${MW.Assets.char('bruno', 'thinking')}</div>
            <div class="m2-fips" aria-hidden="true">${MW.Assets.char('fips', 'happy')}</div>
            <div class="m2-bracket" hidden>${A.bracketLog()}</div>
          </div>
          <aside class="m2-board" aria-label="Werkbank">
            <div class="board-inner">
              <ol class="m2-steps">${steps.map(([id, label], i) => `<li data-step="${id}"><span class="step-n">${i + 1}</span>${label}</li>`).join('')}</ol>
              <h2 class="board-h m2-h">Die Teile</h2>
              <div class="tray"></div>
              <p class="tray-help">${A.icon('pen', 'ico-s')}<span>Teil antippen, dann den Platz im Bild antippen. Oder ziehen.</span></p>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m2-dialog"></div>`;

      const $ = (s) => el.querySelector(s);
      const sheetBox = $('.m2-sheet'), tray = $('.tray'), heading = $('.m2-h'), help = $('.tray-help span');

      function setStep() {
        el.querySelectorAll('.m2-steps li').forEach((li) => {
          const i = steps.findIndex(([id]) => id === li.dataset.step), cur = steps.findIndex(([id]) => id === st.phase);
          li.classList.toggle('is-cur', i === cur); li.classList.toggle('is-done', i < cur || st.phase === 'done');
        });
      }
      function setBruno(state) { $('.m2-bruno').innerHTML = MW.Assets.char('bruno', state); }

      function renderSheet(zones, slots) {
        sheetBox.innerHTML = A.workshopSheet({ zones, pre: [...cfg.pre, ...st.placed], slots });
        Object.entries(st.filled).forEach(([slot, word]) => fillSlot(slot, word, false));
      }
      function fillSlot(slot, word, animate = true) {
        const z = sheetBox.querySelector(`.lslot[data-zone="${slot}"]`); if (!z) return;
        z.classList.add('is-filled'); if (animate) z.classList.add('pop');
        const t = z.querySelector('.lslot-t');
        t.textContent = C.words[word];
        if (C.words[word].length > 8) t.style.fontSize = '19px';
        z.setAttribute('aria-label', `Schild: ${C.words[word]}`);
        if (slot === 'c-fk') sheetBox.querySelector('.fk-frame')?.classList.add('is-on');
        if (slot === 'c-my') sheetBox.querySelector('.my-frame')?.classList.add('is-on');
      }

      /* ---------- Phase 1: Zusammensetzen ---------- */
      function startBuild() {
        st.phase = 'build'; setStep();
        renderSheet(cfg.parts, []);
        heading.textContent = 'Die Teile';
        tray.className = 'tray tray-pieces';
        tray.innerHTML = shuffle(cfg.parts).map((id, k) => `<button class="piece piece-${id}" data-part="${id}" aria-pressed="false" aria-label="Pilzteil ${k + 1}" style="--k:${k}">${A.workPiece(id)}</button>`).join('');
        UI.task(D.task.build);
      }
      function placePart(part, zEl) {
        st.placed.add(part);
        zEl.classList.add('is-filled');
        sheetBox.querySelector(`.pp-${part}`).classList.add('is-on', 'pop');
        const out = sheetBox.querySelector(`[data-out="${part}"]`); if (out) out.classList.add('is-gone');
        const pc = tray.querySelector(`[data-part="${part}"]`); pc.classList.add('is-used'); pc.disabled = true;
        if (st.placed.size === cfg.parts.length) {
          setBruno('happy');
          UI.say([{ who: 'bruno', state: 'happy', text: C.placed[part] }, ...D.toLabels], { waitLast: true, onDone: startLabel });
        } else UI.say([{ who: 'bruno', state: 'encouraging', text: C.placed[part] }]);
      }

      /* ---------- Phase 2: Beschriften ---------- */
      function startLabel() {
        st.phase = 'label'; setStep();
        setBruno('encouraging');
        renderSheet([], cfg.labels.map((w) => C.slotFor[w]));
        showWords([...cfg.labels, ...cfg.distractors], 'Die Wörter');
        help.textContent = 'Wort antippen (dann hörst du es), dann das Schild antippen. Oder ziehen.';
        UI.task(D.task.label);
        UI.say([D.wordTip]);
      }
      function showWords(words, title) {
        heading.textContent = title;
        tray.className = 'tray tray-words';
        tray.innerHTML = shuffle(words).map((w, k) => `<button class="word" data-word="${w}" aria-pressed="false" style="--k:${k}">${A.icon('soundOn', 'word-ico')}<span>${C.words[w]}</span></button>`).join('');
      }

      /* ---------- Phase 3: Einordnen (Pilzexperte) ---------- */
      function startClassify() {
        st.phase = 'classify'; setStep();
        renderSheet([], [...cfg.labels.map((w) => C.slotFor[w]), 'c-fk', 'c-my']);
        showWords([...cfg.classify.words, ...cfg.classify.distractors], 'Wie heißt das?');
        UI.task(D.task.classify);
        UI.say(D.toClassify);
      }

      function onWord(btn, zoneId, zEl) {
        const w = btn.dataset.word;
        const target = C.slotFor[w];
        if (zoneId === target && !(st.phase === 'label' && zoneId.startsWith('c-'))) {
          st.filled[zoneId] = w; fillSlot(zoneId, w);
          btn.classList.add('is-used'); btn.disabled = true;
          const need = st.phase === 'label' ? cfg.labels : cfg.classify.words;
          const done = need.every((x) => Object.values(st.filled).includes(x));
          if (done) {
            if (st.phase === 'label' && cfg.classify) UI.say([{ who: 'bruno', state: 'happy', text: 'Alle Schilder sind beschriftet.' }], { waitLast: true, onDone: startClassify });
            else startPhoto();
          } else UI.say([{ who: 'bruno', state: 'encouraging', text: `${C.words[w]} – das passt.` }]);
          return true;
        }
        const tip = C.hintWord[w] && (cfg.distractors.includes(w) || st.phase === 'classify') ? C.hintWord[w] : C.hintWord._;
        UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: tip }]);
        return false;
      }

      /* ---------- Phase 4: Am echten Pilz entdecken (Foto) ---------- */
      function startPhoto() {
        st.phase = 'photo'; setStep();
        const tasks = P.byLevel[level] || P.byLevel.forscher;
        const stage = $('.m2-photo');
        sheetBox.hidden = true; stage.hidden = false;
        heading.textContent = 'Am echten Pilz';
        help.textContent = 'Fahre mit der Lupe über das Foto. Tippe auf die richtige Stelle.';
        tray.className = 'tray tray-check';
        tray.innerHTML = tasks.map(([, k], i) => `<div class="chk" data-i="${i}"><span class="chk-box"></span>${P.checklist[k] || P.labels[k]}</div>`).join('');
        UI.task({ text: 'Schau dir das Foto genau an. Tippe auf den Pilzteil, nach dem Bruno fragt.', easy: 'Tippe auf das Foto.' });
        let i = -1, card = null, cur = null;
        const show = (photoId) => {
          if (cur === photoId) return;
          cur = photoId;
          card = UI.photoCard(photoId, { caption: MW.Content.photos[photoId].caption });
          stage.innerHTML = ''; stage.appendChild(card.el);
          requestAnimationFrame(() => card.el.classList.add('in'));
          card.box.addEventListener('click', onTap);
        };
        function next() {
          i++;
          tray.querySelectorAll('.chk').forEach((c, k) => { c.classList.toggle('is-cur', k === i); c.classList.toggle('is-done', k < i); });
          if (i >= tasks.length) { setTimeout(finish, 300); return; }
          const [photoId, key] = tasks[i];
          show(photoId);
          if (key === 'zaehlen') {
            const box = document.createElement('div'); box.className = 'count-row';
            box.innerHTML = P.count.options.map((n) => `<button class="btn btn-soft count-btn" data-n="${n}">${n}</button>`).join('');
            tray.appendChild(box);
            box.querySelectorAll('.count-btn').forEach((b) => b.addEventListener('click', () => {
              if (+b.dataset.n === P.count.right) {
                b.classList.add('btn-main'); box.querySelectorAll('button').forEach((x) => (x.disabled = true));
                const ph = MW.Content.photos.steinpilz.spots;
                card.pin(ph.hut[0][0], ph.hut[0][1], '1', 'num'); card.pin(ph.jung[0][0], ph.jung[0][1] - 6, '2', 'num');
                UI.say([{ who: 'bruno', state: 'happy', text: P.count.yes }], { waitLast: true, onDone: () => { box.remove(); next(); } });
              } else { b.classList.add('shake'); UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: P.count.no }]); }
            }));
          }
          if (key === 'show') { UI.say([{ who: 'bruno', state: 'neutral', text: P.ask[key] }], { waitLast: true, onDone: next }); return; }
          UI.say([{ who: 'bruno', state: 'encouraging', text: P.ask[key] }]);
        }
        function onTap(e) {
          if (i < 0 || i >= tasks.length) return;
          const [photoId, key] = tasks[i];
          if (key === 'zaehlen' || key === 'show') return;
          const [x, y] = card.pct(e);
          const spots = MW.Content.photos[photoId].spots[P.spotKey[key] || key] || [];
          const hit = spots.find(([sx, sy]) => Math.hypot(sx - x, (sy - y) * 0.9) < 14);
          if (hit) {
            card.pin(hit[0], hit[1], P.labels[key]);
            UI.say([{ who: 'bruno', state: 'happy', text: P.found[key] }], { waitLast: true, onDone: next });
          } else {
            const miss = card.pin(x, y, '', 'miss'); setTimeout(() => miss.remove(), 900);
            UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: P.hint[key] }]);
          }
        }
        UI.say([{ who: 'bruno', state: 'neutral', text: 'So sieht das alles bei echten Pilzen aus. Nimm die Lupe!' }], { waitLast: true, onDone: next });
      }

      /* ---------- Abschluss ---------- */
      function finish() {
        $('.m2-photo').hidden = true; sheetBox.hidden = false;
        st.phase = 'done'; setStep();
        tray.className = 'tray'; tray.innerHTML = `<div class="board-fips-done" aria-hidden="true">${MW.Assets.char('fips', 'happy')}</div>`; heading.textContent = 'Fertig!';
        help.textContent = 'Brunos Zeichnung hängt wieder an der Staffelei.';
        sheetBox.classList.add('is-done');
        $('.m2-bg').innerHTML = A.workshopScene(true);
        setBruno('happy');
        UI.task(D.task.done);
        UI.say(D.end[level] || D.end.forscher, {
          waitLast: true,
          onDone: () => {
            if (!MW.Content.photos.baumpilz) { const br = $('.m2-bracket'); br.hidden = false; requestAnimationFrame(() => br.classList.add('in')); }
            else {
              const stage = $('.m2-photo'); const card = UI.photoCard('baumpilz', { caption: MW.Content.photos.baumpilz.caption, lens: false });
              stage.innerHTML = ''; stage.appendChild(card.el); stage.hidden = false; sheetBox.hidden = true;
              requestAnimationFrame(() => card.el.classList.add('in'));
            }
            UI.say(D.bracket, {
              waitLast: true,
              onDone: () => {
                const ch = MW.Content.chapters[1];
                const first = MW.Store.completeChapter(2, ch.reward);
                UI.say(D.outro(ch.reward, first), { waitLast: true, onDone: () => UI.missionReward({ title: 'Die Werkstatt leuchtet!', chapter: ch, first, who: 'bruno' }) });
              }
            });
          }
        });
      }

      const dnd = MW.DnD.create({
        root: el, pieceSel: '.piece, .word', zoneSel: '.dz, .lslot',
        onPick: (p) => { if (p.classList.contains('word') && MW.Store.settings.sound) MW.Voice.speak(C.words[p.dataset.word], 'myra'); },
        onDrop: (p, zoneId, zEl) => {
          if (p.classList.contains('piece')) {
            const part = p.dataset.part;
            if (zoneId === part) { placePart(part, zEl); return true; }
            UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: C.hintPart[part] }]);
            return false;
          }
          return onWord(p, zoneId, zEl);
        }
      });

      startBuild();
      UI.say(D.intro);
      return () => dnd.destroy();
    }
  };
})();
