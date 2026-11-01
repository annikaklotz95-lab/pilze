/* =========================================================================
   Mission 5 – Myras Forscherlabor
   1. Wachstumsbilder ordnen (Myzel → Köpfchen → kleiner Pilz → großer Pilz)
   2. Was brauchen Champignons? (nicht für Entdecker)
   3. Echte Beobachtungen: Daten kommen NUR aus dem Forscherbuch.
      Ab zwei Einträgen: Balkendiagramm + Ablesefrage.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};
  const shuffle = (a) => { let b; do { b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } } while (a.length > 1 && b.every((x, i) => x === a[i])); return b; };
  const fmt = (iso) => { try { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }); } catch (e) { return iso; } };

  MW.Screens.mission5 = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, C = Ct.mission5, D = MW.Dialog.m5, UI = MW.UI, S = MW.Store;
      const level = S.settings.level;
      const stages = C.stages[level] || C.stages.forscher;
      const needs = C.needs[level];
      const steps = [['order', 'Wachstum'], ...(needs ? [['needs', 'Was brauchen sie?']] : []), ['observe', 'Beobachten']];
      let phase = 'order';
      let dnd = null;

      el.innerHTML = `
        <div class="m5-layout">
          <div class="m5-scene">
            <div class="m5-bg">${A.labScene(false)}</div>
            <div class="m5-stage"></div>
            <div class="m5-myra" aria-hidden="true">${MW.Assets.char('myra', 'encouraging')}</div>
          </div>
          <aside class="m5-board" aria-label="Labortisch">
            <div class="board-inner">
              <ol class="m2-steps">${steps.map(([id, label], i) => `<li data-step="${id}"><span class="step-n">${i + 1}</span>${label}</li>`).join('')}</ol>
              <h2 class="board-h m5-h"></h2>
              <div class="tray"></div>
              <p class="tray-help"><span></span></p>
            </div>
          </aside>
        </div>
        <div class="dialog-slot m5-dialog"></div>`;
      const $ = (s) => el.querySelector(s);
      const stage = $('.m5-stage'), tray = $('.tray'), heading = $('.m5-h'), help = $('.tray-help span');
      const setStep = () => { const cur = steps.findIndex(([id]) => id === phase); el.querySelectorAll('.m2-steps li').forEach((li, i) => { li.classList.toggle('is-cur', i === cur); li.classList.toggle('is-done', i < cur || phase === 'done'); }); };
      const setMyra = (s) => { $('.m5-myra').innerHTML = MW.Assets.char('myra', s); };
      const resetDnd = () => { if (dnd) dnd.destroy(); dnd = null; };

      /* ---------- 1. Wachstum ordnen ---------- */
      function startOrder() {
        phase = 'order'; setStep();
        heading.textContent = 'Wachstumsbilder';
        help.textContent = 'Bild antippen, dann den Platz antippen. Oder ziehen.';
        stage.innerHTML = `<div class="seq-board"><div class="seq-title">So wächst ein Champignon</div><div class="seq-row n${stages.length}">${stages.map((_, i) => `<div class="seq-slot" data-zone="${i}" role="button" tabindex="0" aria-label="Platz ${i + 1}"><span class="seq-n">${i + 1}</span><div class="seq-in"></div></div>${i < stages.length - 1 ? '<span class="seq-arrow" aria-hidden="true">→</span>' : ''}`).join('')}</div><p class="seq-caption"></p></div>`;
        tray.className = 'tray tray-stages';
        tray.innerHTML = shuffle(stages).map((id, k) => `<button class="stage-card" data-st="${id}" aria-pressed="false" aria-label="${C.stageInfo[id].label}" style="--k:${k}">${A.stageArt(id)}<span>${C.stageInfo[id].label}</span></button>`).join('');
        UI.task(D.task.order);
        let filled = 0;
        dnd = MW.DnD.create({
          root: el, pieceSel: '.stage-card', zoneSel: '.seq-slot',
          onDrop: (p, zone, z) => {
            const id = p.dataset.st;
            if (stages[+zone] !== id) {
              UI.say([D.orderWrong, { who: 'myra', state: 'neutral', text: C.stageInfo[stages[filled]] ? `Platz ${filled + 1}: ${C.stageInfo[stages[filled]].text}` : '' }].filter((l) => l.text));
              return false;
            }
            z.classList.add('is-filled', 'pop');
            z.querySelector('.seq-in').innerHTML = A.stageArt(id) + `<b>${C.stageInfo[id].label}</b>`;
            p.classList.add('is-used'); p.disabled = true; filled++;
            stage.querySelector('.seq-caption').textContent = C.stageInfo[id].text;
            if (filled === stages.length) { setMyra('happy'); UI.say([{ who: 'myra', state: 'neutral', text: C.stageInfo[id].text }, D.orderDone], { waitLast: true, onDone: () => { resetDnd(); needs ? startNeeds() : startObserve(); } }); }
            else UI.say([{ who: 'myra', state: 'neutral', text: C.stageInfo[id].text }]);
            return true;
          }
        });
      }

      /* ---------- 2. Was brauchen Champignons? ---------- */
      function startNeeds() {
        phase = 'needs'; setStep(); setMyra('encouraging');
        heading.textContent = 'Die Karten';
        help.textContent = 'Karte antippen, dann die passende Kiste antippen. Oder ziehen.';
        const all = [...needs.yes, ...needs.no];
        stage.innerHTML = `<div class="need-bins">
          <div class="need-bin is-yes" data-zone="yes" role="button" tabindex="0" aria-label="Brauchen sie"><div class="nb-head">${A.icon('ja')}<b>Brauchen sie</b></div><div class="nb-in"></div></div>
          <div class="need-bin is-no" data-zone="no" role="button" tabindex="0" aria-label="Brauchen sie nicht"><div class="nb-head">${A.icon('nein')}<b>Brauchen sie nicht</b></div><div class="nb-in"></div></div></div>`;
        tray.className = 'tray tray-needs';
        tray.innerHTML = shuffle(all).map((id, k) => `<button class="need-card" data-need="${id}" aria-pressed="false" style="--k:${k}">${A.needArt(id)}<span>${C.needInfo[id].label}</span></button>`).join('');
        UI.task(D.task.needs);
        UI.say([D.needsTask]);
        let done = 0;
        dnd = MW.DnD.create({
          root: el, pieceSel: '.need-card', zoneSel: '.need-bin',
          onPick: (p) => { if (S.settings.sound) MW.Voice.speak(C.needInfo[p.dataset.need].label, 'myra'); },
          onDrop: (p, zone, z) => {
            const id = p.dataset.need;
            const right = needs.yes.includes(id) ? 'yes' : 'no';
            if (zone !== right) { UI.say([{ who: 'myra', state: 'thinking', text: 'Hm, überleg noch einmal.' }, { who: 'myra', state: 'neutral', text: C.needInfo[id].why }]); return false; }
            z.querySelector('.nb-in').insertAdjacentHTML('beforeend', `<span class="nb-item">${A.needArt(id)}<em>${C.needInfo[id].label}</em></span>`);
            z.classList.remove('pop'); void z.offsetWidth; z.classList.add('pop');
            p.classList.add('is-used'); p.disabled = true; done++;
            if (done === all.length) UI.say([{ who: 'myra', state: 'happy', text: C.needInfo[id].why }, D.needsDone], { waitLast: true, onDone: () => { resetDnd(); startObserve(); } });
            else UI.say([{ who: 'myra', state: 'happy', text: C.needInfo[id].why }]);
            return true;
          }
        });
      }

      /* ---------- 3. Echte Beobachtungen ---------- */
      function startObserve() {
        phase = 'observe'; setStep(); setMyra('encouraging');
        const list = S.entries();
        heading.textContent = 'Unsere Beobachtungen';
        tray.className = 'tray';
        if (list.length < 2) {
          stage.innerHTML = `<div class="obs-card">${list.length ? `<p class="obs-big">${list.length} Beobachtung</p><p>${fmt(list[0].date)}: <b>${list[0].count}</b> ${list[0].count === 1 ? 'Champignon' : 'Champignons'}</p>` : '<p class="obs-big">Noch leer</p><p>Hier erscheinen eure echten Beobachtungen.</p>'}</div>`;
          tray.innerHTML = `<button class="btn btn-main obs-go">${A.icon('pen')}<span>Ins Forscherbuch</span></button><button class="btn btn-soft obs-later">Später beobachten</button>`;
          help.textContent = 'Im Forscherbuch trägst du ein, was du an euren Champignons siehst.';
          tray.querySelector('.obs-go').onclick = () => { complete(false); MW.App.go('journal'); };
          tray.querySelector('.obs-later').onclick = () => complete(true);
          UI.task(D.task.observe);
          UI.say(list.length ? D.oneEntry : D.noEntries);
          return;
        }
        // Balkendiagramm aus echten Einträgen (letzte 8)
        const data = list.slice(-8);
        const first = new Date(list[0].date);
        const day = (d) => Math.round((new Date(d) - first) / 86400000) + 1;
        const max = Math.max(1, ...data.map((e) => e.count));
        const top = Math.max(...data.map((e) => e.count));
        const H = 180;
        stage.innerHTML = `<div class="chart-card"><div class="chart-title">Wie viele Champignons?</div>
          <div class="chart" role="group" aria-label="Anzahl Champignons pro Beobachtung">${data.map((e, i) => `<button class="bar" data-i="${i}" aria-label="Tag ${day(e.date)}: ${e.count}"><span class="bar-n">${e.count}</span><span class="bar-col" style="height:${Math.max(6, (e.count / max) * H)}px"></span><span class="bar-l">Tag ${day(e.date)}<small>${fmt(e.date)}</small></span></button>`).join('')}</div>
          <p class="chart-note">Alle Zahlen stammen aus eurem Forscherbuch.</p></div>`;
        help.textContent = 'Jeder Balken ist eine Beobachtung aus dem Forscherbuch.';
        UI.task(D.task.compare);
        if (top === 0) { UI.say([D.compareIntro, { who: 'myra', state: 'thinking', text: 'Bisher habt ihr noch keine Pilze gezählt. Beobachtet weiter – das braucht Geduld!' }], { waitLast: true, onDone: () => complete(true) }); return; }
        UI.say([D.compareIntro, { who: 'myra', state: 'encouraging', text: 'An welchem Tag hast du die meisten Champignons gezählt? Tippe auf den Balken.' }]);
        stage.querySelectorAll('.bar').forEach((b) => b.addEventListener('click', () => {
          const e = data[+b.dataset.i];
          if (e.count === top) {
            b.classList.add('is-right'); stage.querySelectorAll('.bar').forEach((x) => (x.disabled = true));
            const firstC = data[0].count, lastC = data[data.length - 1].count;
            const trend = lastC > firstC ? `Am Anfang waren es ${firstC}, zuletzt ${lastC}. Es sind mehr geworden.` : lastC < firstC ? `Am Anfang waren es ${firstC}, zuletzt ${lastC}. Vielleicht wurden schon welche geerntet?` : `Am Anfang und zuletzt waren es gleich viele: ${firstC}.`;
            UI.say([D.compareRight, ...(level !== 'entdecker' ? [{ who: 'myra', state: 'neutral', text: trend }] : [])], { waitLast: true, onDone: () => complete(true) });
          } else { b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 500); UI.say([D.compareWrong]); }
        }));
      }

      /* ---------- Abschluss ---------- */
      function complete(showReward) {
        phase = 'done'; setStep();
        const ch = Ct.chapters[4];
        const first = S.completeChapter(5, ch.reward);
        if (!showReward) return;
        $('.m5-bg').innerHTML = A.labScene(true);
        setMyra('happy');
        heading.textContent = 'Fertig!';
        tray.innerHTML = `<button class="btn btn-soft obs-go2">${A.icon('pen')}<span>Zum Forscherbuch</span></button>`;
        tray.querySelector('.obs-go2').onclick = () => MW.App.go('journal');
        UI.task(D.task.done);
        UI.say([...D.end, ...D.outro(ch.reward, first)], { waitLast: true, onDone: () => UI.missionReward({ title: 'Das Labor leuchtet!', chapter: ch, first, who: 'myra' }) });
      }

      startOrder();
      UI.say([...D.intro, D.orderTask]);
      return () => resetDnd();
    }
  };
})();
