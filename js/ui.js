/* =========================================================================
   UI-Bausteine: Werkzeugleiste, Sprechblasen, Lila-Hilfe, Dialogfenster
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  const A = () => MW.Art;
  const $ = (sel, root = document) => root.querySelector(sel);

  let currentTask = null;
  let bubbleState = null; // { lines, i, onDone, slot, opts }
  let lilaTimer = null;

  const UI = {
    $,
    esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); },

    applyMotion() {
      const rm = MW.Store.settings.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.classList.toggle('rm', rm);
    },

    /* ---------------- Werkzeugleiste ---------------- */
    topbar(opts = {}) {
      const bar = $('#topbar');
      const s = MW.Store.settings;
      const p = MW.Store.profile();
      const left = [];
      if (opts.back) left.push(`<button class="tb-btn" data-act="back" aria-label="Zurück">${A().icon('back')}</button>`);
      if (opts.home) left.push(`<button class="tb-btn" data-act="home" aria-label="Zum Startbildschirm">${A().icon('home')}</button>`);
      if (opts.profile && p) {
        const col = MW.Content.profileColors.find((c) => c.id === p.color);
        left.push(`<button class="tb-profile" data-act="profiles" aria-label="Forscherkind wechseln: ${UI.esc(MW.Content.profileName(p.symbol, p.color))}">${A().symbol(p.symbol, col && col.hex)}<span>${UI.esc(MW.Content.profileName(p.symbol, p.color))}</span></button>`);
      }
      const right = [];
      if (opts.lights && p) right.push(`<div class="tb-lights" aria-label="${MW.Store.lights()} Waldlichter">${A().lightOrb(30)}<span class="tb-lights-n">${MW.Store.lights()}</span></div>`);
      right.push(`<button class="tb-btn" data-act="sound" aria-pressed="${s.sound}" aria-label="${s.sound ? 'Ton ausschalten' : 'Ton einschalten'}">${A().icon(s.sound ? 'soundOn' : 'soundOff')}</button>`);
      right.push(`<button class="tb-lila" data-act="lila" aria-label="Hilfe: Aufgabe vorlesen">${A().lila('neutral')}</button>`);
      bar.innerHTML = `<div class="tb-left">${left.join('')}</div><div class="tb-right">${right.join('')}</div>`;
      bar.hidden = !!opts.hidden;
      bar.onclick = (e) => {
        const b = e.target.closest('[data-act]'); if (!b) return;
        const act = b.dataset.act;
        if (act === 'back') MW.App.back();
        else if (act === 'home') MW.App.go('home');
        else if (act === 'profiles') MW.App.go('profiles');
        else if (act === 'sound') { MW.Store.setting('sound', !MW.Store.settings.sound); if (!MW.Store.settings.sound) MW.Voice.stop(); UI.topbar(opts); }
        else if (act === 'lila') UI.lila();
      };
    },
    bumpLights() {
      const n = $('.tb-lights-n'); if (n) { n.textContent = MW.Store.lights(); const w = n.closest('.tb-lights'); w.classList.remove('bump'); void w.offsetWidth; w.classList.add('bump'); }
    },

    /* ---------------- Aufgabe & Lila ---------------- */
    task(t) { currentTask = t; },
    lila() {
      const lvl = MW.Store.settings.level;
      const t = currentTask;
      const text = t ? (lvl === 'entdecker' && t.easy ? t.easy : t.text) : MW.Dialog.lila.none;
      const el = $('#lila-bubble');
      el.innerHTML = `<p><strong>Lila:</strong> ${UI.esc(text)}</p>${t && t.easy && lvl !== 'entdecker' ? `<p class="lila-easy">Kurz: ${UI.esc(t.easy)}</p>` : ''}`;
      el.hidden = false;
      el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
      MW.Voice.speak(MW.Store.settings.sound ? `${MW.Dialog.lila.intro} ${text}` : '', 'lila');
      clearTimeout(lilaTimer);
      lilaTimer = setTimeout(() => { el.hidden = true; }, 9000);
      el.onclick = () => { el.hidden = true; };
    },

    /* ---------------- Sprechblasen ---------------- */
    /**
     * Zeigt Dialogzeilen nacheinander.
     * opts.onDone   – wird aufgerufen, wenn die letzte Zeile angezeigt (bzw. bei waitLast bestätigt) ist
     * opts.waitLast – auch die letzte Zeile braucht einen Tipp auf "weiter"
     * opts.slot     – Ziel-Element (Standard: .dialog-slot im aktuellen Bildschirm)
     * opts.avatar   – false: keine Figur in der Blase
     */
    say(lines, opts = {}) {
      const slot = opts.slot || $('#app .screen:last-child .dialog-slot');
      if (!slot) { opts.onDone && opts.onDone(); return; }
      bubbleState = { lines, i: 0, opts, slot };
      UI._renderBubble();
    },
    _renderBubble() {
      const st = bubbleState; if (!st) return;
      const line = st.lines[st.i];
      const isLast = st.i === st.lines.length - 1;
      const needNext = !isLast || st.opts.waitLast;
      const name = MW.Dialog.names[line.who] || '';
      st.slot.innerHTML = `<div class="bubble who-${line.who} ${st.opts.avatar === false ? 'no-avatar' : ''}" role="status">
        ${st.opts.avatar === false ? '' : `<button class="bubble-avatar" aria-label="${name}: noch einmal vorlesen">${MW.Assets.char(line.who, line.state)}</button>`}
        <div class="bubble-body"><div class="bubble-name">${name}</div><p class="bubble-text">${UI.esc(line.text)}</p></div>
        ${needNext ? `<button class="bubble-next" aria-label="Weiter">${A().icon('next')}</button>` : `<button class="bubble-replay" aria-label="Noch einmal vorlesen">${A().icon('soundOn')}</button>`}
      </div>`;
      const bub = st.slot.firstElementChild;
      requestAnimationFrame(() => bub.classList.add('in'));
      if (MW.Store.settings.autoRead) MW.Voice.speak(line.text, line.who);
      const replay = () => MW.Voice.speak(line.text, line.who);
      const av = bub.querySelector('.bubble-avatar'); if (av) av.onclick = replay;
      const rp = bub.querySelector('.bubble-replay'); if (rp) rp.onclick = replay;
      const nx = bub.querySelector('.bubble-next');
      if (nx) {
        nx.onclick = () => {
          if (bubbleState !== st) return;
          if (!isLast) { st.i++; UI._renderBubble(); }
          else { const cb = st.opts.onDone; st.opts.onDone = null; nx.remove(); cb && cb(); }
        };
        setTimeout(() => { try { nx.focus({ preventScroll: true }); } catch (e) {} }, 50);
      }
      if (isLast && !st.opts.waitLast) { const cb = st.opts.onDone; st.opts.onDone = null; cb && setTimeout(cb, 0); }
    },
    clearBubble(slot) { const s = slot || $('#app .screen:last-child .dialog-slot'); if (s) s.innerHTML = ''; bubbleState = null; },

    /* ---------------- Dialogfenster ---------------- */
    modal(html, opts = {}) {
      const root = $('#modal-root');
      const wrap = document.createElement('div');
      wrap.className = 'modal-wrap';
      wrap.innerHTML = `<div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true" aria-label="${UI.esc(opts.label || 'Fenster')}">
        ${opts.closable === false ? '' : `<button class="modal-x" aria-label="Schließen">${A().icon('close')}</button>`}${html}</div>`;
      root.appendChild(wrap);
      requestAnimationFrame(() => wrap.classList.add('in'));
      const close = () => { wrap.remove(); opts.onClose && opts.onClose(); };
      const x = wrap.querySelector('.modal-x'); if (x) x.onclick = close;
      wrap.addEventListener('click', (e) => { if (e.target === wrap && opts.closable !== false) close(); });
      return { el: wrap.querySelector('.modal'), close };
    },
    /** Bestätigung ohne window.confirm */
    confirm(text, yesLabel, onYes) {
      const m = UI.modal(`<p class="confirm-text">${UI.esc(text)}</p><div class="row-btns"><button class="btn btn-soft" data-no>Abbrechen</button><button class="btn btn-warn" data-yes>${UI.esc(yesLabel)}</button></div>`, { label: 'Bestätigen' });
      m.el.querySelector('[data-no]').onclick = m.close;
      m.el.querySelector('[data-yes]').onclick = () => { m.close(); onYes(); };
    },
    toast(text) {
      const t = document.createElement('div'); t.className = 'toast'; t.textContent = text;
      document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('in'));
      setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, 2600);
    },

    /* Foto im Polaroid-Rahmen mit Lupe. Gibt { el, pin(x,y,text) } zurück. */
    photoCard(id, opts = {}) {
      const p = MW.Content.photos[id];
      const wrap = document.createElement('figure');
      wrap.className = `photo-card ${opts.cls || ''}`;
      wrap.innerHTML = `<div class="photo-box"><img src="${p.file}" alt="${UI.esc(p.alt)}" draggable="false"><div class="photo-pins"></div><div class="lens" hidden></div></div>
        <figcaption>${UI.esc(opts.caption || 'Foto')}</figcaption>`;
      const box = wrap.querySelector('.photo-box'), lens = wrap.querySelector('.lens'), img = wrap.querySelector('img');
      lens.style.backgroundImage = `url("${p.file}")`;
      const move = (e) => {
        const r = box.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if (x < 0 || y < 0 || x > r.width || y > r.height) { lens.hidden = true; return; }
        lens.hidden = false;
        const z = 2.4, L = lens.offsetWidth || 120;
        lens.style.left = x - L / 2 + 'px'; lens.style.top = y - L / 2 + 'px';
        lens.style.backgroundSize = `${r.width * z}px ${r.height * z}px`;
        lens.style.backgroundPosition = `${-(x * z - L / 2)}px ${-(y * z - L / 2)}px`;
      };
      if (opts.lens !== false) {
        box.addEventListener('pointermove', move);
        box.addEventListener('pointerdown', move);
        box.addEventListener('pointerleave', () => { lens.hidden = true; });
        box.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') lens.hidden = true; });
      }
      const api = {
        el: wrap, box, img,
        pin(x, y, text, cls = '') {
          const pin = document.createElement('span');
          pin.className = `ph-pin ${cls}`; pin.style.left = x + '%'; pin.style.top = y + '%';
          pin.innerHTML = `<i></i>${text ? `<b>${UI.esc(text)}</b>` : ''}`;
          if (x > 62) pin.classList.add('to-left');
          wrap.querySelector('.photo-pins').appendChild(pin); return pin;
        },
        clearPins() { wrap.querySelector('.photo-pins').innerHTML = ''; },
        /** Tipp-Position in Prozent */
        pct(e) { const r = img.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100]; }
      };
      return api;
    },
    /** Bildnachweise aller Fotos */
    credits() {
      const list = Object.entries(MW.Content.photos);
      UI.modal(`<div class="credits"><h2>Bildnachweise</h2><p class="tc-hint">Zeichnungen und Figuren: eigene Illustrationen dieses Projekts.</p>
        <ul>${list.map(([id, p]) => `<li><img src="${p.file}" alt=""><span><b>${UI.esc(p.alt.replace('Foto: ', ''))}</b><small>${p.credit ? `${UI.esc(p.credit)}${p.license ? ` · ${UI.esc(p.license)}` : ''}${p.source ? `<br>${UI.esc(p.source)}` : ''}` : 'Quelle und Lizenz noch nicht eingetragen (js/content.js).'}</small></span></li>`).join('')}</ul></div>`, { label: 'Bildnachweise', cls: 'modal-wide' });
    },

    /* Abschlussfenster einer Mission */
    missionReward({ title, chapter, first, who = 'myra' }) {
      const A_ = A();
      const m = UI.modal(`
        <div class="reward">
          <div class="reward-myra">${MW.Assets.char(who, 'happy')}</div>
          <h2>${UI.esc(title)}</h2>
          <p>${first ? `Du hast <b>${chapter.reward} Waldlichter</b> gesammelt.` : 'Du hast die Mission noch einmal geschafft.'}</p>
          <div class="reward-orbs">${Array.from({ length: chapter.reward }, () => A_.lightOrb(46)).join('')}</div>
          <div class="row-btns"><button class="btn btn-soft" data-go="garden">In meinen Wald</button><button class="btn btn-main" data-go="map">Zur Waldkarte</button></div>
        </div>`, { cls: 'modal-reward', label: 'Geschafft', closable: false });
      if (first) UI.flyLights(m.el.querySelector('.reward-orbs'), chapter.reward);
      m.el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { m.close(); MW.App.go(b.dataset.go, {}, { replace: true }); }));
      return m;
    },

    /* Lichter fliegen zur Anzeige */
    flyLights(fromEl, n, done) {
      const target = $('.tb-lights'); if (!fromEl || !target) { done && done(); return; }
      const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
      let left = n;
      for (let i = 0; i < n; i++) {
        const o = document.createElement('div'); o.className = 'fly-orb'; o.innerHTML = A().lightOrb(36);
        o.style.left = a.left + a.width / 2 - 18 + (i - (n - 1) / 2) * 40 + 'px'; o.style.top = a.top + a.height / 2 - 18 + 'px';
        document.body.appendChild(o);
        setTimeout(() => {
          o.style.transform = `translate(${b.left - (parseFloat(o.style.left)) + 2}px, ${b.top - parseFloat(o.style.top)}px) scale(.7)`;
          o.style.opacity = '.2';
        }, 300 + i * 260);
        setTimeout(() => { o.remove(); left--; UI.bumpLights(); if (left === 0) done && done(); }, 1300 + i * 260);
      }
    }
  };

  MW.UI = UI;
})();
