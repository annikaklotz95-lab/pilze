/* Pilze entdecken – illustrierte Steckbriefe mit Lupen-Erkundung */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  MW.Screens.lexikon = {
    topbar: { back: true, home: true },
    render(el) {
      const A = MW.Art, Ct = MW.Content, UI = MW.UI;
      let cur = Ct.species[1].id; // Steinpilz zuerst – das ist Bruno
      let part = null;
      let view = 'foto'; // 'foto' | 'zeichnung' (nur wenn ein Foto vorhanden ist)
      const photoOf = (id) => Object.values(Ct.photos).find((p) => p.species === id);

      el.innerHTML = `
        <div class="lex-layout">
          <nav class="lex-tabs" aria-label="Pilzarten">${Ct.species.map((s) => `<button class="lex-tab" data-id="${s.id}"><span class="lt-pic">${MW.Assets.shroom(s.id, s.name)}</span><span>${s.name}</span></button>`).join('')}</nav>
          <article class="lex-page"></article>
        </div>
        <div class="dialog-slot lex-dialog"></div>`;
      const page = el.querySelector('.lex-page');

      function draw() {
        const s = Ct.species.find((x) => x.id === cur);
        const tag = Ct.tags[s.tag];
        el.querySelectorAll('.lex-tab').forEach((t) => t.classList.toggle('is-sel', t.dataset.id === cur));
        const photo = photoOf(s.id);
        const usePhoto = photo && view === 'foto';
        page.innerHTML = `
          <header class="lex-head"><h2>${s.name}</h2><span class="tag ${tag.cls}">${tag.label}</span>
            ${photo ? `<div class="seg" role="group" aria-label="Ansicht"><button class="seg-btn ${usePhoto ? 'is-sel' : ''}" data-view="foto" aria-pressed="${!!usePhoto}">Foto</button><button class="seg-btn ${usePhoto ? '' : 'is-sel'}" data-view="zeichnung" aria-pressed="${!usePhoto}">Zeichnung</button></div>` : ''}</header>
          <div class="lex-body">
            <div class="lex-figure ${part && !usePhoto ? 'focus' : ''} ${usePhoto ? 'is-photo' : ''}">
              ${usePhoto ? '' : MW.Assets.shroom(s.id, s.name)}
            </div>
            <div class="lex-parts">
              ${Object.keys(s.parts).map((k) => `<button class="part-btn ${part === k ? 'is-sel' : ''}" data-part="${k}"><span class="pb-dot pb-${k}"></span>${k === 'unten' ? s.under : Ct.partLabels[k]}</button>`).join('')}
              <p class="part-text" aria-live="polite">${part ? UI.esc(s.parts[part]) : 'Tippe auf einen Teil vom Pilz.'}</p>
              <p class="lex-where"><b>Wo?</b> ${UI.esc(s.where)}</p>
              ${s.note ? `<p class="lex-note">${UI.esc(s.note)}</p>` : ''}
            </div>
          </div>
          <footer class="lex-safety">${A.icon('hand', 'ico-s')}<span>${UI.esc(Ct.safetyRule)}</span></footer>
          <button class="credits-link">Bildnachweise</button>`;
        page.querySelector('.credits-link').addEventListener('click', () => UI.credits());
        page.querySelectorAll('.seg-btn').forEach((b) => b.addEventListener('click', () => { view = b.dataset.view; draw(); }));
        page.querySelectorAll('.part-btn').forEach((b) => b.addEventListener('click', () => pick(b.dataset.part)));
        if (usePhoto) {
          const card = UI.photoCard(Object.keys(Ct.photos).find((k) => Ct.photos[k] === photo), { caption: photo.caption || `Foto: ${s.name}` });
          page.querySelector('.lex-figure').appendChild(card.el); card.el.classList.add('in');
          const key = part === 'unten' && !photo.spots.unten ? 'roehren' : part;
          if (key && photo.spots[key]) { const [x, y] = photo.spots[key][0]; card.pin(x, y, part === 'unten' ? s.under : Ct.partLabels[part]); }
          return;
        }
        const fig = page.querySelector('.lex-figure svg');
        if (part) { const box = page.querySelector('.lex-figure'); requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add(`focus-${part}`))); }
        if (part) fig.querySelectorAll('[data-part]').forEach((g) => g.classList.toggle('hl', g.dataset.part === part));
        // Teile direkt im Bild antippen
        fig.querySelectorAll('[data-part]').forEach((g) => {
          g.style.cursor = 'pointer';
          g.addEventListener('click', () => pick(g.dataset.part));
        });
      }
      function pick(k) {
        part = k; draw();
        const s = Ct.species.find((x) => x.id === cur);
        const lines = [{ who: 'bruno', state: 'neutral', text: s.parts[k] }];
        if (k === 'unten' && MW.Store.settings.level === 'experte') lines.push({ who: 'bruno', state: 'encouraging', text: Ct.sporeLine });
        UI.say(lines);
      }
      el.querySelectorAll('.lex-tab').forEach((t) => t.addEventListener('click', () => {
        cur = t.dataset.id; part = null; draw();
        const s = Ct.species.find((x) => x.id === cur);
        const lines = [{ who: 'bruno', state: s.id === 'steinpilz' ? 'happy' : 'neutral', text: s.id === 'steinpilz' ? 'Das bin ich, ein Steinpilz!' : `Das ist der ${s.name}.` }];
        if (s.tag === 'giftig') lines.push({ who: 'bruno', state: 'thinking', text: 'Vorsicht, er ist giftig. Er darf nie in den Mund.' });
        if (s.tag === 'speise') lines.push({ who: 'bruno', state: 'thinking', text: 'Man kann ihn essen. Aber nur, wenn Fachleute ihn sicher bestimmt haben.' });
        UI.say(lines);
      }));

      draw();
      UI.task(MW.Dialog.lexikon.task);
      if (!MW.Store.seen('lexikon')) { MW.Store.markSeen('lexikon'); UI.say(MW.Dialog.lexikon.first); }
      else UI.say(MW.Dialog.lexikon.back);
    }
  };
})();
