/* =========================================================================
   Wissenswand – Vorwissen der Klasse sammeln
   Freie Zettel, die für das ganze Gerät (die Klasse) gelten.
   Ab dem ersten geschafften Kapitel kann die Klasse prüfen:
   Stimmt das? Stimmt nicht? Wissen wir noch nicht?
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  MW.Screens.vorwissen = {
    topbar: { back: true, home: true },
    render(el) {
      const A = MW.Art, V = MW.Content.vorwissen, D = MW.Dialog.vorwissen, S = MW.Store, UI = MW.UI;
      let color = V.colors[0];
      let checkMode = false;
      let impulse = 0;
      const canCheck = () => S.doneCount() > 0;

      el.innerHTML = `
        <div class="vw-wrap">
          <section class="vw-write" aria-label="Neuer Zettel">
            <h1 class="vw-title">Unsere Wissenswand</h1>
            <button class="vw-impulse" aria-label="Frage vorlesen">${A.icon('soundOn', 'ico-s')}<span></span></button>
            <label class="vw-lab" for="vw-text">Das wissen wir schon über Pilze:</label>
            <div class="vw-paper"><textarea id="vw-text" rows="3" maxlength="160" placeholder="Pilze wachsen im Wald …"></textarea></div>
            <div class="vw-row">
              <div class="vw-colors" role="group" aria-label="Zettelfarbe">${V.colors.map((c, i) => `<button class="vw-color ${i === 0 ? 'is-sel' : ''}" data-c="${c}" style="--c:${c}" aria-label="Zettelfarbe ${i + 1}" aria-pressed="${i === 0}"></button>`).join('')}</div>
              <button class="btn btn-main vw-add">${A.icon('plus')}<span>Anheften</span></button>
            </div>
            <div class="vw-check" hidden>
              <button class="btn btn-soft vw-mode" aria-pressed="false">${A.icon('lupe')}<span>Zettel prüfen</span></button>
              <p class="vw-legend">${Object.values(V.status).map((st) => `<span>${A.icon(st.icon, 'ico-s')}${st.label}</span>`).join('')}</p>
            </div>
          </section>
          <section class="vw-board" aria-label="Pinnwand">
            <div class="vw-cork"><div class="vw-notes"></div></div>
          </section>
        </div>
        <div class="dialog-slot vw-dialog"></div>`;

      const $ = (s) => el.querySelector(s);
      const notesEl = $('.vw-notes'), text = $('#vw-text');

      function showImpulse() { $('.vw-impulse span').textContent = V.impulses[impulse % V.impulses.length]; }
      $('.vw-impulse').addEventListener('click', () => {
        MW.Voice.speak(V.impulses[impulse % V.impulses.length], 'myra');
        impulse++; setTimeout(showImpulse, 600);
      });
      showImpulse();

      el.querySelectorAll('.vw-color').forEach((b) => b.addEventListener('click', () => {
        color = b.dataset.c;
        el.querySelectorAll('.vw-color').forEach((x) => { x.classList.toggle('is-sel', x === b); x.setAttribute('aria-pressed', String(x === b)); });
        $('.vw-paper').style.setProperty('--c', color);
      }));
      $('.vw-paper').style.setProperty('--c', color);

      $('.vw-add').addEventListener('click', () => {
        const t = text.value.trim();
        if (!t) { UI.say([D.empty]); text.focus(); return; }
        const n = S.addNote(t, color);
        text.value = '';
        draw(n.id);
        UI.say([D.added]);
      });

      const mode = $('.vw-mode');
      mode.addEventListener('click', () => {
        checkMode = !checkMode;
        mode.setAttribute('aria-pressed', String(checkMode));
        mode.classList.toggle('btn-main', checkMode); mode.classList.toggle('btn-soft', !checkMode);
        el.querySelector('.vw-wrap').classList.toggle('is-check', checkMode);
        if (checkMode) UI.say(D.check);
        draw();
      });

      function draw(newId) {
        const list = S.notes();
        $('.vw-check').hidden = !canCheck() || !list.length;
        if (!list.length) {
          notesEl.innerHTML = `<p class="vw-empty">Noch hängt hier kein Zettel. Schreibt auf, was ihr schon über Pilze wisst.</p>`;
          return;
        }
        notesEl.innerHTML = list.map((n, i) => {
          const rot = ((i * 37) % 9) - 4;
          const st = n.status && V.status[n.status];
          return `<article class="note ${n.id === newId ? 'is-new' : ''} ${n.status ? 'st-' + n.status : ''}" data-id="${n.id}" style="--c:${n.color};--r:${rot}deg">
            ${A.pin([MW.Art.C.rost, MW.Art.C.wald, MW.Art.C.braun, MW.Art.C.beere][i % 4])}
            <button class="note-text" aria-label="Zettel vorlesen: ${UI.esc(n.text)}">${UI.esc(n.text)}</button>
            ${st ? `<span class="note-stamp">${A.icon(st.icon, 'ico-s')}${st.label}</span>` : ''}
            ${checkMode ? `<div class="note-actions">${Object.entries(V.status).map(([k, s]) => `<button class="note-st ${n.status === k ? 'is-on' : ''}" data-st="${k}" aria-pressed="${n.status === k}" aria-label="${s.label}">${A.icon(s.icon)}</button>`).join('')}<button class="note-del" aria-label="Zettel abnehmen">${A.icon('trash')}</button></div>` : ''}
          </article>`;
        }).join('');
        notesEl.querySelectorAll('.note').forEach((card) => {
          const id = card.dataset.id;
          card.querySelector('.note-text').addEventListener('click', () => MW.Voice.speak(S.notes().find((x) => x.id === id).text, 'myra'));
          card.querySelectorAll('.note-st').forEach((b) => b.addEventListener('click', () => { S.setNoteStatus(id, b.dataset.st); draw(); }));
          const del = card.querySelector('.note-del');
          if (del) del.addEventListener('click', () => UI.confirm('Diesen Zettel abnehmen?', 'Abnehmen', () => { S.removeNote(id); draw(); }));
        });
      }

      draw();
      UI.task(D.task);
      if (!S.seen('vorwissen')) { S.markSeen('vorwissen'); UI.say(D.first); }
      else if (canCheck() && S.notes().length && !S.seen('vorwissen-check')) { S.markSeen('vorwissen-check'); UI.say([...D.back, ...D.check]); }
      else UI.say(D.back);
    }
  };
})();
