/* =========================================================================
   Mission 3 – Das Dorf der hundert Hüte
   Spielhandlung: Die Pilzbewohner haben ihre Namen vergessen.
   1. Namensschilder zuordnen (Bild ↔ Name)  → jedes Haus leuchtet wieder
   2. Nach der Unterseite sortieren: Lamellen / Röhren / (Leisten)
   3. Rätsel: Beschreibung hören, passenden Bewohner antippen
      (Pilzexperte zusätzlich: eine Transferfrage)
   Alles per Antippen oder Ziehen.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};
  const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  MW.Screens.mission3 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, C = Ct.mission3, D = MW.Dialog.m3, UI = MW.UI;
      const level = MW.Store.settings.level;
      const residents = shuffle(C.residents[level] || C.residents.forscher);
      const baskets = C.baskets[level] || C.baskets.forscher;
      const nameOf = (id) => Ct.species.find((s) => s.id === id).name;
      const photoOf = (id) => Object.values(Ct.photos).find((p) => p.species === id);
      const st = { phase: 'name', named: new Set(), sorted: new Set() };
      const steps = [['name', 'Namen'], ['sort', 'Sortieren'], ['riddle', 'Rätsel']];

      el.innerHTML = `
        <div class="m3-layout">
          <div class="m3-village">
            <div class="m3-bg">${A.villageScene(0, residents.length)}</div>
            <div class="res-grid n${residents.length}">
              ${residents.map((id, k) => {
                const p = photoOf(id);
                return `<div class="res" data-sp="${id}" style="--k:${k}" aria-label="Bewohner ${k + 1}">
                  <div class="res-roof"><span class="roof-plain">${A.roof('plain')}</span><span class="roof-real">${A.roof(id)}</span></div>
                  <div class="res-house">
                    <div class="res-window">${p ? `<img src="${p.file}" alt="${UI.esc(p.alt)}" draggable="false">` : MW.Assets.shroom(id, nameOf(id))}</div>
                    <div class="sign" data-zone="${id}" role="button" tabindex="0" aria-label="Leeres Namensschild"><span class="sign-t">?</span></div>
                    <span class="res-badge" hidden></span>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
          <aside class="m3-board" aria-label="Werkzeuge">
            <div class="board-inner">
              <ol class="m2-steps">${steps.map(([id, label], i) => `<li data-step="${id}"><span class="step-n">${i + 1}</span>${label}</li>`).join('')}</ol>
              <h2 class="board-h m3-h">Namensschilder</h2>
              <div class="tray"></div>
              <p class="tray-help"><span></span></p>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m3-dialog"></div>`;

      const $ = (s) => el.querySelector(s);
      const tray = $('.tray'), heading = $('.m3-h'), help = $('.tray-help span');
      const bg = $('.m3-bg');
      const resEl = (id) => el.querySelector(`.res[data-sp="${id}"]`);

      function setStep() {
        const cur = steps.findIndex(([id]) => id === st.phase);
        el.querySelectorAll('.m2-steps li').forEach((li, i) => { li.classList.toggle('is-cur', i === cur); li.classList.toggle('is-done', i < cur || st.phase === 'done'); });
      }

      /* ---------- 1. Namensschilder ---------- */
      function startName() {
        st.phase = 'name'; setStep();
        heading.textContent = 'Namensschilder';
        help.textContent = 'Schild antippen (dann hörst du den Namen) und unter das passende Foto bringen.';
        tray.className = 'tray tray-words';
        tray.innerHTML = shuffle(residents).map((id, k) => `<button class="word" data-word="${id}" aria-pressed="false" style="--k:${k}">${A.icon('soundOn', 'word-ico')}<span>${nameOf(id)}</span></button>`).join('');
        UI.task(D.task.name);
      }
      function onName(btn, zoneId, zEl) {
        const id = btn.dataset.word;
        if (zoneId === id) {
          st.named.add(id);
          zEl.classList.add('is-filled', 'pop');
          zEl.querySelector('.sign-t').textContent = nameOf(id);
          zEl.setAttribute('aria-label', `Namensschild: ${nameOf(id)}`);
          resEl(id).classList.add('is-named');
          resEl(id).setAttribute('aria-label', nameOf(id));
          btn.classList.add('is-used'); btn.disabled = true;
          bg.innerHTML = A.villageScene(st.named.size, residents.length);
          if (st.named.size === residents.length) UI.say([D.named(nameOf(id)), ...(D.toSort[level] || D.toSort.forscher)], { waitLast: true, onDone: startSort });
          else UI.say([D.named(nameOf(id))]);
          return true;
        }
        UI.say([D.wrong, { who: 'fips', state: 'encouraging', text: `Der ${nameOf(id)} hat ${C.features[id]}. Schau dir die Fotos noch einmal an.` }]);
        return false;
      }

      /* ---------- 2. Sortieren nach der Unterseite ---------- */
      function startSort() {
        st.phase = 'sort'; setStep();
        heading.textContent = 'Unter dem Hut';
        help.textContent = 'Pilz antippen, dann den passenden Korb antippen. Oder den Pilz in den Korb ziehen.';
        tray.className = 'tray tray-baskets';
        tray.innerHTML = baskets.map((b) => `<div class="basket" data-zone="${b}" role="button" tabindex="0" aria-label="Korb ${C.basketLabels[b]}">
            <span class="basket-ico">${A.underIcon(b)}</span>
            <span class="basket-txt"><b>${C.basketLabels[b]}</b><small>${C.basketDesc[b]}</small></span>
            <span class="basket-in"></span>
          </div>`).join('');
        residents.forEach((id) => { const r = resEl(id); r.classList.add('is-piece'); r.setAttribute('role', 'button'); r.setAttribute('tabindex', '0'); r.setAttribute('aria-pressed', 'false'); });
        UI.task(D.task.sort);
      }
      function onSort(card, zoneId, zEl) {
        const id = card.dataset.sp;
        const right = C.under[id];
        if (zoneId === right) {
          st.sorted.add(id);
          card.classList.remove('is-piece'); card.classList.add('is-sorted'); card.removeAttribute('aria-pressed');
          const badge = card.querySelector('.res-badge'); badge.hidden = false; badge.innerHTML = A.underIcon(right);
          const p = photoOf(id);
          zEl.querySelector('.basket-in').insertAdjacentHTML('beforeend', `<span class="bin-item" title="${nameOf(id)}">${p ? `<img src="${p.file}" alt="">` : ''}<em>${nameOf(id)}</em></span>`);
          zEl.classList.remove('pop'); void zEl.offsetWidth; zEl.classList.add('pop');
          const lines = [{ who: 'bruno', state: 'happy', text: `Der ${nameOf(id)} hat ${C.basketLabels[right]}.` }];
          if (st.sorted.size === residents.length) UI.say([...lines, D.sorted, ...D.toRiddle], { waitLast: true, onDone: startRiddle });
          else UI.say(lines);
          return true;
        }
        const extra = id === 'champignon' ? [{ who: 'bruno', state: 'neutral', text: C.champNote }] : [];
        UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: `Schau unter den Hut vom ${nameOf(id)}. ${C.sortHint[right]}` }, ...extra]);
        return false;
      }

      /* ---------- 3. Rätsel ---------- */
      function startRiddle() {
        st.phase = 'riddle'; setStep();
        el.querySelector('.m3-layout').classList.add('is-riddle');
        residents.forEach((id) => { const r = resEl(id); r.classList.remove('is-sorted'); r.setAttribute('role', 'button'); r.setAttribute('tabindex', '0'); });
        const list = shuffle(C.riddles[level] || C.riddles.forscher);
        const withTransfer = level === 'experte';
        heading.textContent = 'Wer bin ich?';
        help.textContent = 'Tippe auf den Lautsprecher, um das Rätsel noch einmal zu hören.';
        tray.className = 'tray tray-riddle';
        let i = 0;
        const total = list.length + (withTransfer ? 1 : 0);
        const dots = () => `<div class="r-dots">${Array.from({ length: total }, (_, k) => `<i class="${k < i ? 'is-done' : k === i ? 'is-cur' : ''}"></i>`).join('')}</div>`;
        UI.task(D.task.riddle);
        function ask() {
          if (i >= list.length) { if (withTransfer && i === list.length) return askTransfer(); return finish(); }
          const r = list[i];
          tray.innerHTML = `${dots()}<div class="riddle-card"><p>${UI.esc(r.text)}</p><button class="btn btn-soft r-replay">${A.icon('soundOn')}<span>Nochmal hören</span></button></div>`;
          tray.querySelector('.r-replay').onclick = () => MW.Voice.speak(r.text, 'fips');
          UI.say([{ who: 'fips', state: 'thinking', text: r.text }]);
        }
        function askTransfer() {
          const T = C.transfer;
          tray.innerHTML = `${dots()}<div class="riddle-card"><p>${UI.esc(T.q)}</p><div class="row-btns left">${T.options.map((o) => `<button class="btn btn-soft t-opt" data-id="${o.id}">${o.label}</button>`).join('')}</div></div>`;
          UI.say([{ who: 'fips', state: 'thinking', text: T.q }]);
          tray.querySelectorAll('.t-opt').forEach((b) => b.addEventListener('click', () => {
            const o = T.options.find((x) => x.id === b.dataset.id);
            if (o.right) { b.classList.add('btn-main'); tray.querySelectorAll('.t-opt').forEach((x) => (x.disabled = true)); i++; UI.say([{ who: 'bruno', state: 'happy', text: o.why }], { waitLast: true, onDone: finish }); }
            else { b.classList.add('shake'); UI.say([D.wrong, { who: 'bruno', state: 'thinking', text: o.why }]); }
          }));
        }
        st.onPick = (id) => {
          if (i >= list.length) return;
          const r = list[i];
          const card = resEl(id);
          if (id === r.a) {
            card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
            i++;
            UI.say([D.riddleRight(nameOf(id))], { waitLast: true, onDone: ask });
          } else {
            card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
            UI.say([D.wrong, { who: 'fips', state: 'encouraging', text: `Der ${nameOf(id)} hat ${C.features[id]}. Hör dir das Rätsel noch einmal an.` }]);
          }
        };
        ask();
      }
      el.querySelector('.res-grid').addEventListener('click', (e) => {
        if (st.phase !== 'riddle' || !st.onPick) return;
        const r = e.target.closest('.res'); if (r) st.onPick(r.dataset.sp);
      });
      el.querySelector('.res-grid').addEventListener('keydown', (e) => {
        if (st.phase !== 'riddle' || (e.key !== 'Enter' && e.key !== ' ')) return;
        const r = e.target.closest('.res'); if (r) { e.preventDefault(); st.onPick(r.dataset.sp); }
      });

      /* ---------- Abschluss ---------- */
      function finish() {
        st.phase = 'done'; setStep(); st.onPick = null;
        heading.textContent = 'Fertig!';
        tray.className = 'tray'; tray.innerHTML = `<div class="board-fips-done" aria-hidden="true">${MW.Assets.char('fips', 'happy')}</div>`;
        help.textContent = 'Alle Bewohner kennen ihre Namen wieder.';
        el.querySelector('.m3-village').classList.add('is-done');
        UI.task(D.task.done);
        const ch = Ct.chapters[2];
        UI.say(D.end, {
          waitLast: true,
          onDone: () => {
            const first = MW.Store.completeChapter(3, ch.reward);
            UI.say(D.outro(ch.reward, first), { waitLast: true, onDone: () => UI.missionReward({ title: 'Das Dorf leuchtet!', chapter: ch, first, who: 'fips' }) });
          }
        });
      }

      const dnd = MW.DnD.create({
        root: el, pieceSel: '.word, .res.is-piece', zoneSel: '.sign, .basket',
        onPick: (p) => {
          if (!MW.Store.settings.sound) return;
          if (p.classList.contains('word')) MW.Voice.speak(nameOf(p.dataset.word), 'fips');
        },
        onDrop: (p, zoneId, zEl) => {
          if (st.phase === 'name' && p.classList.contains('word') && zEl.classList.contains('sign')) return onName(p, zoneId, zEl);
          if (st.phase === 'sort' && p.classList.contains('res') && zEl.classList.contains('basket')) return onSort(p, zoneId, zEl);
          return false;
        }
      });

      startName();
      UI.say(MW.Store.seen('m3') ? [D.intro[2], D.nameTip] : [...D.intro, D.nameTip]);
      MW.Store.markSeen('m3');
      return () => dnd.destroy();
    }
  };
})();
