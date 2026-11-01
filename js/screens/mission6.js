/* =========================================================================
   Mission 6 – Das große Pilzfest
   Vier Stationen wiederholen das Gelernte (Pilzteile am Foto, Rätsel,
   sichere Entscheidung, Reflexion). Danach leuchtet der ganze Wald,
   und es gibt die Pilzforscher-Urkunde.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  MW.Screens.mission6 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, D = MW.Dialog.m6, UI = MW.UI, S = MW.Store;
      const level = S.settings.level;
      const done = new Set();
      const ST = [
        { id: 'bruno', who: 'bruno', label: 'Bilderwand' },
        { id: 'fips', who: 'fips', label: 'Rätselecke' },
        { id: 'safety', who: 'myra', label: 'Buffet' },
        { id: 'lila', who: 'lila', label: 'Lichterbaum' }
      ];

      el.innerHTML = `
        <div class="m6-layout">
          <div class="m6-scene">
            <div class="m6-bg">${A.festScene(0)}</div>
            <div class="booths">${ST.map((s, i) => `<button class="booth" data-st="${s.id}" style="--k:${i}" aria-label="Station ${s.label}">
                <span class="booth-char">${MW.Assets.char(s.who, 'happy')}</span>
                <span class="booth-sign">${s.label}</span><span class="booth-q" aria-hidden="true">?</span></button>`).join('')}</div>
          </div>
          <aside class="m6-board" aria-label="Station">
            <div class="board-inner">
              <div class="r-dots m6-dots"></div>
              <h2 class="board-h m6-h">Das Pilzfest</h2>
              <div class="m6-panel"><p class="sit-q">Tippe auf eine Station mit Fragezeichen.</p></div>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m6-dialog"></div>`;
      const $ = (s) => el.querySelector(s);
      const panel = $('.m6-panel'), heading = $('.m6-h');
      const dots = () => { $('.m6-dots').innerHTML = ST.map((s) => `<i class="${done.has(s.id) ? 'is-done' : ''}"></i>`).join(''); };
      dots();

      el.querySelectorAll('.booth').forEach((b) => b.addEventListener('click', () => open(b.dataset.st)));
      function open(id) {
        if (done.has(id)) return;
        el.querySelectorAll('.booth').forEach((b) => b.classList.toggle('is-open', b.dataset.st === id));
        ({ bruno: stBruno, fips: stFips, safety: stSafety, lila: stLila })[id]();
      }
      function stationDone(id) {
        done.add(id); dots();
        const b = el.querySelector(`.booth[data-st="${id}"]`); b.classList.add('is-done'); b.classList.remove('is-open');
        $('.m6-bg').innerHTML = A.festScene(done.size, ST.length);
        panel.innerHTML = `<p class="sit-q">${done.size < ST.length ? 'Tippe auf die nächste Station mit Fragezeichen.' : ''}</p>`;
        if (done.size === ST.length) return UI.say([D.stationDone], { waitLast: true, onDone: finish });
        UI.say([D.stationDone]);
        UI.task(D.task.station);
      }

      /* Station 1: Bruno – Pilzteil am Foto */
      function stBruno() {
        heading.textContent = 'Brunos Bilderwand';
        const pool = [['steinpilz', 'hut'], ['steinpilz', 'stiel'], ['fliegenpilz', 'hut'], ['fliegenpilz', 'stiel'], ['pfifferling', 'unten'], ['fliegenpilz', 'unten']]
          .filter(([p, k]) => Ct.photos[p] && Ct.photos[p].spots[k] && (level !== 'entdecker' || k !== 'unten'));
        const [photoId, key] = pick(pool);
        const sp = Ct.species.find((s) => s.id === Ct.photos[photoId].species);
        const label = key === 'unten' ? sp.under : Ct.partLabels[key];
        panel.innerHTML = `<p class="sit-q">Wo ist ${key === 'hut' ? 'der Hut' : key === 'stiel' ? 'der Stiel' : `die ${label}`}? Tippe aufs Foto.</p><div class="m6-photo"></div>`;
        const card = UI.photoCard(photoId, { caption: sp.name, lens: level !== 'entdecker' });
        panel.querySelector('.m6-photo').appendChild(card.el); card.el.classList.add('in');
        UI.say([D.bruno, { who: 'bruno', state: 'encouraging', text: `Wo ist ${key === 'hut' ? 'der Hut' : key === 'stiel' ? 'der Stiel' : `die ${label}`} vom ${sp.name}?` }]);
        card.box.addEventListener('click', function onTap(e) {
          const [x, y] = card.pct(e);
          const hit = Ct.photos[photoId].spots[key].find(([sx, sy]) => Math.hypot(sx - x, (sy - y) * 0.9) < 15);
          if (hit) { card.box.removeEventListener('click', onTap); card.pin(hit[0], hit[1], label); UI.say([{ who: 'bruno', state: 'happy', text: `Genau, ${key === 'hut' ? 'der Hut' : key === 'stiel' ? 'der Stiel' : `die ${label}`}!` }], { waitLast: true, onDone: () => stationDone('bruno') }); }
          else { const m = card.pin(x, y, '', 'miss'); setTimeout(() => m.remove(), 900); UI.say([D.wrong]); }
        });
      }

      /* Station 2: Fips – Rätsel mit Fotos */
      function stFips() {
        heading.textContent = 'Fips’ Rätselecke';
        const R = pick(Ct.mission3.riddles[level] || Ct.mission3.riddles.forscher);
        const others = shuffle(['fliegenpilz', 'steinpilz', 'pfifferling', 'champignon', 'maronenroehrling'].filter((x) => x !== R.a)).slice(0, level === 'entdecker' ? 1 : 2);
        const opts = shuffle([R.a, ...others]);
        const photoOf = (id) => Object.values(Ct.photos).find((p) => p.species === id);
        panel.innerHTML = `<p class="sit-q">${UI.esc(R.text)}</p><div class="cards n${opts.length} m6-cards">${opts.map((id, k) => `<button class="pcard" data-id="${id}" style="--k:${k}"><span class="pcard-pic pcard-photo"><img src="${photoOf(id).file}" alt=""></span><span class="pcard-label">${Ct.species.find((s) => s.id === id).name}</span></button>`).join('')}</div>`;
        UI.say([D.fips, { who: 'fips', state: 'thinking', text: R.text }]);
        panel.querySelectorAll('.pcard').forEach((b) => b.addEventListener('click', () => {
          if (b.dataset.id === R.a) { b.classList.add('is-right'); panel.querySelectorAll('.pcard').forEach((x) => (x.disabled = true)); UI.say([{ who: 'fips', state: 'happy', text: 'Richtig geraten!' }], { waitLast: true, onDone: () => stationDone('fips') }); }
          else { b.classList.add('is-wrong'); b.disabled = true; UI.say([D.wrong, { who: 'fips', state: 'encouraging', text: 'Hör dir das Rätsel noch einmal an: ' + R.text }]); }
        }));
      }

      /* Station 3: Sicherheit */
      function stSafety() {
        heading.textContent = 'Am Buffet';
        const M4 = Ct.mission4;
        const s = M4.situations[pick(M4.byLevel[level] || M4.byLevel.forscher)];
        const text = level === 'entdecker' && s.easy ? s.easy : s.text;
        panel.innerHTML = `<p class="sit-q">${UI.esc(text)}</p><div class="opt-list">${shuffle(s.options).map((o) => `<button class="opt" data-id="${o.id}">${A.icon(o.icon, 'opt-ico')}<span>${UI.esc(o.label)}</span></button>`).join('')}</div>`;
        UI.say([D.safety, { who: 'fips', state: 'thinking', text }]);
        panel.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
          const o = s.options.find((x) => x.id === b.dataset.id);
          if (o.right) { b.classList.add('is-right'); panel.querySelectorAll('.opt').forEach((x) => (x.disabled = true)); UI.say([{ who: 'myra', state: 'happy', text: o.why }], { waitLast: true, onDone: () => stationDone('safety') }); }
          else { b.classList.add('is-wrong'); b.disabled = true; UI.say([D.wrong, { who: 'myra', state: 'thinking', text: o.why }]); }
        }));
      }

      /* Station 4: Lila – Reflexion (keine richtigen/falschen Antworten) */
      function stLila() {
        heading.textContent = 'Lilas Lichterbaum';
        const M6 = Ct.mission6;
        const chosen = new Set();
        panel.innerHTML = `<p class="sit-q">Was hast du gelernt? Tippe an, so viel du willst.</p>
          <div class="chip-row">${M6.reflect.map((r) => `<button class="chip" data-r="${r.id}" aria-pressed="false">${r.label}</button>`).join('')}</div>
          <p class="sit-q m6-mood-q" hidden>Wie hat dir das Pilzabenteuer gefallen?</p>
          <div class="mood-row" hidden>${M6.mood.map((m, i) => `<button class="mood" data-m="${m.id}" aria-label="${m.label}">${moodFace(i)}<span>${m.label}</span></button>`).join('')}</div>
          <div class="row-btns left"><button class="btn btn-main m6-ok">Weiter</button></div>`;
        UI.say([D.lila]);
        panel.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
          const id = c.dataset.r; chosen.has(id) ? chosen.delete(id) : chosen.add(id); c.setAttribute('aria-pressed', String(chosen.has(id)));
        }));
        const ok = panel.querySelector('.m6-ok');
        ok.onclick = () => {
          ok.parentElement.hidden = true;
          panel.querySelector('.m6-mood-q').hidden = false; panel.querySelector('.mood-row').hidden = false;
          UI.say([D.lilaMood]);
        };
        panel.querySelectorAll('.mood').forEach((m) => m.addEventListener('click', () => {
          const p = S.profile();
          if (p) { p.reflection = { learned: [...chosen], mood: m.dataset.m, at: new Date().toISOString() }; S.save(); }
          panel.querySelectorAll('.mood').forEach((x) => { x.disabled = true; x.classList.toggle('is-sel', x === m); });
          UI.say([D.lilaThanks], { waitLast: true, onDone: () => stationDone('lila') });
        }));
      }
      function moodFace(i) {
        const mouth = ['M14 30 Q 24 40 34 30', 'M15 32 Q 24 36 33 32', 'M16 33 L 32 33'][i];
        return `<svg viewBox="0 0 48 48" class="mood-svg" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="${['#E9C776', '#D7E0C5', '#ECE6D8'][i]}" stroke="#3E3129" stroke-width="2.6"/><circle cx="17" cy="20" r="2.6" fill="#3E3129"/><circle cx="31" cy="20" r="2.6" fill="#3E3129"/><path d="${mouth}" fill="none" stroke="#3E3129" stroke-width="2.8" stroke-linecap="round"/></svg>`;
      }

      /* Abschluss */
      function finish() {
        heading.textContent = 'Das Fest ist fertig!';
        el.querySelector('.m6-scene').classList.add('is-done');
        panel.innerHTML = `<div class="board-fips-done" aria-hidden="true">${MW.Assets.char('myra', 'happy')}</div><div class="row-btns"><button class="btn btn-main m6-cert">${A.icon('check')}<span>Meine Urkunde</span></button>${S.notes().length ? '<button class="btn btn-soft m6-wall">Unsere Wissenswand</button>' : ''}</div>`;
        const wb = panel.querySelector('.m6-wall'); if (wb) wb.onclick = () => MW.App.go('vorwissen');
        UI.task(D.task.done);
        const ch = Ct.chapters[5];
        const first = S.completeChapter(6, ch.reward);
        if (first) UI.flyLights(panel, ch.reward);
        panel.querySelector('.m6-cert').onclick = () => MW.App.go('urkunde');
        UI.say(D.end, { waitLast: true, onDone: () => MW.App.go('urkunde') });
      }

      UI.task(D.task.station);
      UI.say(D.intro);
    }
  };

  /* =========================================================================
     Pilzforscher-Urkunde (druckbar). Der Name wird nicht gespeichert.
     ========================================================================= */
  MW.Screens.urkunde = {
    topbar: { back: true, home: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, S = MW.Store, UI = MW.UI;
      const p = S.profile();
      const col = p && Ct.profileColors.find((c) => c.id === p.color);
      const doneCh = Ct.chapters.filter((c) => S.isDone(c.id));
      const date = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
      el.innerHTML = `<div class="cert-wrap">
        <div class="cert-tools no-print">
          <label for="cert-name">Name für die Urkunde <small>(wird nicht gespeichert)</small></label>
          <input id="cert-name" maxlength="40" autocomplete="off" placeholder="Name eintragen">
          <button class="btn btn-main cert-print">${A.icon('download')}<span>Drucken</span></button>
          <p class="cert-hint">Drucken funktioniert in der veröffentlichten App (z. B. GitHub Pages). Sonst: Bildschirmfoto machen.</p>
        </div>
        <article class="cert" aria-label="Urkunde">
          ${A.certFrame()}
          <div class="cert-in">
            <p class="cert-kicker">Myras geheimnisvoller Pilzwald</p>
            <h1 class="cert-title">Pilzforscher-Urkunde</h1>
            <p class="cert-for">für</p>
            <p class="cert-name">${p ? `<span class="cert-sym">${A.symbol(p.symbol, col && col.hex)}</span>` : ''}<span class="cert-name-t">${p ? UI.esc(Ct.profileName(p.symbol, p.color)) : 'Forscherkind'}</span></p>
            <p class="cert-text">hat dem Pilzwald geholfen und weiß jetzt:</p>
            <ul class="cert-list">
              <li>Pilze sind weder Tiere noch Pflanzen.</li>
              <li>Ein Pilz hat Hut, Stiel und darunter Lamellen, Röhren oder Leisten. Unter der Erde wächst das Myzel.</li>
              <li>Unbekannte Pilze esse ich niemals. Wildpilze bestimmen nur Fachleute.</li>
            </ul>
            <div class="cert-foot">
              <span>${doneCh.length} von 6 Kapiteln geschafft · ${date}</span>
              <span class="cert-chars">${MW.Assets.char('myra', 'happy')}${MW.Assets.char('bruno', 'happy')}${MW.Assets.char('fips', 'happy')}</span>
            </div>
          </div>
        </article></div>`;
      const input = el.querySelector('#cert-name');
      const nameEl = el.querySelector('.cert-name-t');
      const fallback = nameEl.textContent;
      input.addEventListener('input', () => { nameEl.textContent = input.value.trim() || fallback; });
      el.querySelector('.cert-print').addEventListener('click', () => { try { window.print(); } catch (e) {} });
      MW.UI.task({ text: 'Das ist deine Urkunde. Ein Erwachsener kann sie ausdrucken.', easy: 'Das ist deine Urkunde.' });
    }
  };
})();
