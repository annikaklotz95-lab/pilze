/* =========================================================================
   Forscherbuch – Beobachtungen der echten Champignonzucht
   Nichts wird erfunden: Einträge entstehen nur aus Eingaben der Kinder.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  const fmt = (iso) => { try { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' }); } catch (e) { return iso; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

  MW.Screens.journal = {
    topbar: { back: true, home: true },
    render(el) {
      const A = MW.Art, J = MW.Content.journal, S = MW.Store, UI = MW.UI;
      const form = { date: today(), count: 0, size: null, changes: [], text: '', drawing: null };

      el.innerHTML = `
        <div class="jr-layout">
          <section class="jr-page jr-form" aria-label="Neue Beobachtung">
            <h2 class="jr-h">Neue Beobachtung</h2>
            <div class="jr-row"><label class="jr-lab" for="jr-date">Datum</label><input id="jr-date" type="date" class="jr-date" value="${form.date}"></div>
            <div class="jr-block"><span class="jr-lab">Wie viele Champignons siehst du?</span>
              <div class="counter">
                <button class="cnt-btn" data-d="-1" aria-label="einen weniger">${A.icon('minus')}</button>
                <div class="cnt-view" aria-live="polite"><span class="cnt-n">0</span><span class="cnt-row"></span></div>
                <button class="cnt-btn" data-d="1" aria-label="einen mehr">${A.icon('plus')}</button>
              </div></div>
            <div class="jr-block"><span class="jr-lab">Wie groß sind sie meistens?</span>
              <div class="size-row">${J.sizes.map((s) => `<button class="size-btn" data-size="${s.id}" aria-pressed="false">${A.sizeIcon(s.id)}<span>${s.label}</span></button>`).join('')}</div></div>
            <div class="jr-block"><span class="jr-lab">Was hat sich verändert?</span>
              <div class="chip-row">${J.changes.map((c) => `<button class="chip" data-ch="${c.id}" aria-pressed="false">${c.label}</button>`).join('')}</div></div>
            <div class="jr-block"><span class="jr-lab">Zeichne, was du siehst</span>
              <div class="draw-wrap"><canvas class="draw" width="720" height="440" aria-label="Zeichenfläche"></canvas></div>
              <div class="draw-tools">${J.crayons.map((c, i) => `<button class="crayon ${i === 0 ? 'is-sel' : ''}" data-c="${c}" style="--c:${c}" aria-label="Stiftfarbe"></button>`).join('')}
                <button class="tool-btn" data-tool="clear" aria-label="Zeichnung löschen">${A.icon('eraser')}</button></div></div>
            <div class="jr-block"><label class="jr-lab" for="jr-text">Das möchte ich noch aufschreiben <small>(freiwillig)</small></label>
              <textarea id="jr-text" class="jr-text" rows="2" maxlength="280"></textarea></div>
            <button class="btn btn-main jr-save">${A.icon('check')}<span>Speichern</span></button>
          </section>
          <section class="jr-page jr-list" aria-label="Bisherige Beobachtungen">
            <h2 class="jr-h">Unsere Beobachtungen</h2>
            <ol class="entries"></ol>
          </section>
        </div>
        <div class="dialog-slot jr-dialog"></div>`;

      const $ = (s) => el.querySelector(s);

      /* Zähler */
      const drawCount = () => {
        $('.cnt-n').textContent = form.count;
        $('.cnt-row').innerHTML = Array.from({ length: Math.min(form.count, 12) }, () => `<i>${A.sizeIcon('mittel')}</i>`).join('') + (form.count > 12 ? '<b>…</b>' : '');
      };
      el.querySelectorAll('.cnt-btn').forEach((b) => b.addEventListener('click', () => { form.count = Math.max(0, Math.min(99, form.count + +b.dataset.d)); drawCount(); }));
      el.querySelectorAll('.size-btn').forEach((b) => b.addEventListener('click', () => {
        form.size = form.size === b.dataset.size ? null : b.dataset.size;
        el.querySelectorAll('.size-btn').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.size === form.size)));
      }));
      el.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.ch;
        if (id === 'nichts') form.changes = form.changes.includes('nichts') ? [] : ['nichts'];
        else { form.changes = form.changes.filter((x) => x !== 'nichts'); form.changes = form.changes.includes(id) ? form.changes.filter((x) => x !== id) : [...form.changes, id]; }
        el.querySelectorAll('.chip').forEach((x) => x.setAttribute('aria-pressed', String(form.changes.includes(x.dataset.ch))));
      }));
      $('#jr-date').addEventListener('change', (e) => { form.date = e.target.value || today(); });

      /* Zeichnen */
      const cv = $('.draw'), ctx = cv.getContext('2d');
      let color = J.crayons[0], drawing = false, last = null, dirty = false;
      const clear = () => { ctx.fillStyle = '#FBF6EA'; ctx.fillRect(0, 0, cv.width, cv.height); dirty = false; };
      clear();
      const pt = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * cv.width, ((e.clientY - r.top) / r.height) * cv.height]; };
      cv.addEventListener('pointerdown', (e) => { drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); dot(last); });
      cv.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pt(e); line(last, p); last = p; });
      ['pointerup', 'pointercancel'].forEach((t) => cv.addEventListener(t, () => { drawing = false; }));
      function dot(p) { ctx.fillStyle = color; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, Math.PI * 2); ctx.fill(); dirty = true; }
      function line(a, b) {
        // Buntstift-Strich: mehrere leicht versetzte Linien
        ctx.strokeStyle = color; ctx.lineCap = 'round';
        for (let k = 0; k < 3; k++) {
          ctx.globalAlpha = 0.35 + k * 0.15; ctx.lineWidth = 9 - k * 2.5;
          const j = () => (Math.random() - 0.5) * 1.6;
          ctx.beginPath(); ctx.moveTo(a[0] + j(), a[1] + j()); ctx.lineTo(b[0] + j(), b[1] + j()); ctx.stroke();
        }
        ctx.globalAlpha = 1; dirty = true;
      }
      el.querySelectorAll('.crayon').forEach((b) => b.addEventListener('click', () => {
        color = b.dataset.c; el.querySelectorAll('.crayon').forEach((x) => x.classList.toggle('is-sel', x === b));
      }));
      $('[data-tool="clear"]').addEventListener('click', clear);

      /* Speichern */
      $('.jr-save').addEventListener('click', () => {
        if (!form.count && !form.size && !form.changes.length && !dirty && !$('#jr-text').value.trim()) {
          UI.say([{ who: 'myra', state: 'thinking', text: 'Das Blatt ist noch leer. Zähle die Pilze oder zeichne, was du siehst.' }]);
          return;
        }
        // Zeichnung verkleinert speichern (spart Speicherplatz)
        let img = null;
        if (dirty) { const t = document.createElement('canvas'); t.width = 360; t.height = 220; t.getContext('2d').drawImage(cv, 0, 0, 360, 220); img = t.toDataURL('image/jpeg', 0.72); }
        const ok = S.addEntry({ date: form.date, count: form.count, size: form.size, changes: form.changes, text: $('#jr-text').value.trim(), drawing: img });
        if (!ok) UI.toast('Achtung: Der Browser konnte nicht speichern.');
        form.count = 0; form.size = null; form.changes = []; $('#jr-text').value = ''; clear(); drawCount();
        el.querySelectorAll('[aria-pressed]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
        drawList();
        UI.say(MW.Dialog.journal.saved);
      });

      function drawList() {
        const list = S.entries();
        const first = list[0] && list[0].date;
        const dayNo = (d) => { if (!first) return 1; const a = new Date(first), b = new Date(d); return Math.round((b - a) / 86400000) + 1; };
        const ol = $('.entries');
        if (!list.length) { ol.innerHTML = `<li class="entry-empty">Hier erscheinen eure Beobachtungen – eine nach der anderen, nach Datum geordnet.</li>`; return; }
        ol.innerHTML = list.map((e) => `<li class="entry">
          <div class="entry-head"><b>Tag ${dayNo(e.date)}</b><span>${fmt(e.date)}</span>
            <button class="entry-del" data-id="${e.id}" aria-label="Eintrag löschen">${A.icon('trash')}</button></div>
          <div class="entry-body">
            ${e.drawing ? `<img src="${e.drawing}" alt="Zeichnung vom ${fmt(e.date)}">` : ''}
            <ul class="entry-facts">
              <li><b>${e.count}</b> ${e.count === 1 ? 'Champignon' : 'Champignons'}</li>
              ${e.size ? `<li>meist ${MW.Content.journal.sizes.find((s) => s.id === e.size).label}</li>` : ''}
              ${e.changes.map((c) => `<li>${(MW.Content.journal.changes.find((x) => x.id === c) || {}).label}</li>`).join('')}
            </ul>
            ${e.text ? `<p class="entry-text">${UI.esc(e.text)}</p>` : ''}
          </div></li>`).join('');
        ol.querySelectorAll('.entry-del').forEach((b) => b.addEventListener('click', () => UI.confirm('Diesen Eintrag wirklich löschen?', 'Löschen', () => { S.removeEntry(b.dataset.id); drawList(); })));
      }

      drawCount(); drawList();
      UI.task(MW.Dialog.journal.task);
      if (!S.seen('journal')) { S.markSeen('journal'); UI.say(MW.Dialog.journal.first); }
    }
  };
})();
