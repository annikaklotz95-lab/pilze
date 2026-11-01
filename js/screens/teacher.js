/* =========================================================================
   Lehrkraftbereich
   Erwachsenen-Hürde: Knopf gedrückt halten + Zahlwort als Ziffern eingeben.
   Ersetzt keine echte Authentifizierung.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  const ONES = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
  const TENS = ['', 'zehn', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  const word = (n) => { const t = Math.floor(n / 10), o = n % 10; return o ? `${ONES[o]}und${TENS[t]}` : TENS[t]; };

  function download(name, text, type) {
    try {
      const blob = new Blob([text], { type });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      return true;
    } catch (e) { return false; }
  }

  function exportRows() {
    const Ct = MW.Content;
    const rows = [];
    MW.Store.profiles().forEach((p) => {
      [...p.journal].sort((a, b) => a.date.localeCompare(b.date)).forEach((e) => rows.push({
        profil: Ct.profileName(p.symbol, p.color), datum: e.date, anzahl: e.count,
        groesse: e.size ? Ct.journal.sizes.find((s) => s.id === e.size).label : '',
        veraenderung: e.changes.map((c) => (Ct.journal.changes.find((x) => x.id === c) || {}).label).join(' / '),
        notiz: e.text || '', zeichnung: e.drawing ? 'ja' : 'nein', _drawing: e.drawing
      }));
    });
    return rows;
  }
  const csv = (rows) => {
    const head = ['profil', 'datum', 'anzahl', 'groesse', 'veraenderung', 'notiz', 'zeichnung'];
    const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
    return '﻿' + [head.join(';'), ...rows.map((r) => head.map((h) => q(r[h])).join(';'))].join('\r\n');
  };

  MW.Screens.teacher = {
    topbar: { back: true, home: true },

    gate() {
      const UI = MW.UI, A = MW.Art;
      const n = 21 + Math.floor(Math.random() * 78);
      const m = UI.modal(`<div class="gate">
          <h2>Lehrkraftbereich</h2>
          <p>Dieser Bereich ist für Erwachsene.</p>
          <div class="gate-step gate-hold"><p>1. Halte den Knopf gedrückt.</p>
            <button class="hold-btn" aria-label="Gedrückt halten">${A.icon('key')}<span class="hold-fill"></span></button></div>
          <div class="gate-step gate-num" hidden><label for="gate-in">2. Schreibe als Zahl: <b>${word(n)}</b></label>
            <input id="gate-in" inputmode="numeric" autocomplete="off" maxlength="2"><button class="btn btn-main" data-ok>Öffnen</button>
            <p class="gate-err" hidden>Das stimmt nicht. Bitte noch einmal.</p></div>
        </div>`, { label: 'Lehrkraftbereich' });
      const btn = m.el.querySelector('.hold-btn');
      let t = null;
      const start = (e) => { e.preventDefault(); btn.classList.add('is-holding'); t = setTimeout(() => { m.el.querySelector('.gate-hold').hidden = true; m.el.querySelector('.gate-num').hidden = false; m.el.querySelector('#gate-in').focus(); }, 1800); };
      const stop = () => { btn.classList.remove('is-holding'); clearTimeout(t); };
      btn.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, stop));
      const check = () => {
        if (+m.el.querySelector('#gate-in').value === n) { m.close(); MW.App.go('teacher'); }
        else m.el.querySelector('.gate-err').hidden = false;
      };
      m.el.querySelector('[data-ok]').addEventListener('click', check);
      m.el.querySelector('#gate-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    },

    render(el) {
      const S = MW.Store, Ct = MW.Content, UI = MW.UI, A = MW.Art;
      function draw() {
        const st = S.settings;
        const profs = S.profiles();
        el.innerHTML = `<div class="tc-wrap">
          <h1 class="tc-title">Lehrkraftbereich</h1>
          <p class="tc-intro">Einstellungen gelten für dieses Gerät und alle Forscherprofile darauf. Alle Daten bleiben lokal im Browser.</p>

          <section class="tc-sec"><h2>Differenzierung</h2>
            <div class="tc-levels">${Ct.levels.map((l) => `<label class="tc-level"><input type="radio" name="lvl" id="lvl-${l.id}" value="${l.id}" ${st.level === l.id ? 'checked' : ''}><span><b>${l.label}</b><small>${l.desc}</small></span></label>`).join('')}</div></section>

          <section class="tc-sec"><h2>Ton und Bewegung</h2>
            <label class="tc-toggle"><input type="checkbox" id="tc-sound" ${st.sound ? 'checked' : ''}><span>Ton und Vorlesen ${MW.Voice.available ? '' : '<small>(Dieser Browser hat keine Sprachausgabe.)</small>'}</span></label>
            <label class="tc-toggle"><input type="checkbox" id="tc-auto" ${st.autoRead ? 'checked' : ''}><span>Sprechblasen automatisch vorlesen</span></label>
            <label class="tc-toggle"><input type="checkbox" id="tc-rm" ${st.reduceMotion ? 'checked' : ''}><span>Animationen reduzieren</span></label></section>

          <section class="tc-sec"><h2>Kapitel freischalten</h2>
            <p class="tc-hint">Kapitel 1 ist immer offen. Freigeschaltete Kapitel sind für alle Profile erreichbar. Kapitel 2–6 folgen in den nächsten Ausbaustufen.</p>
            <div class="tc-chapters">${Ct.chapters.map((c) => `<label class="tc-toggle"><input type="checkbox" id="ch-${c.id}" data-ch="${c.id}" ${c.id === 1 ? 'checked disabled' : st.unlocked.includes(c.id) ? 'checked' : ''}><span>${c.id}. ${c.title}${c.built ? '' : ' <small>(in Arbeit)</small>'}</span></label>`).join('')}</div></section>

          <section class="tc-sec"><h2>Forscherprofile (${profs.length})</h2>
            ${profs.length ? `<ul class="tc-profiles">${profs.map((p) => {
              const c = Ct.profileColors.find((x) => x.id === p.color);
              return `<li>${A.symbol(p.symbol, c && c.hex)}<span><b>${UI.esc(Ct.profileName(p.symbol, p.color))}</b><small>${Object.values(p.chapters).filter((x) => x.done).length} Kapitel · ${p.lightsEarned - p.lightsSpent} Waldlichter · ${p.journal.length} Beobachtungen${p.reflection ? ` · Rückmeldung: ${({ super: 'Super', gut: 'Gut', geht: 'Geht so' })[p.reflection.mood] || ''}${p.reflection.learned.length ? ` (gelernt: ${p.reflection.learned.map((x) => (Ct.mission6.reflect.find((r) => r.id === x) || {}).label).join(', ')})` : ''}` : ''}</small></span>
                <button class="btn btn-soft btn-s" data-reset="${p.id}">Fortschritt zurücksetzen</button><button class="btn btn-warn btn-s" data-del="${p.id}">Löschen</button></li>`;
            }).join('')}</ul>` : '<p class="tc-hint">Noch keine Profile angelegt.</p>'}
            <p class="tc-hint">„Fortschritt zurücksetzen“ behält die Forscherbuch-Einträge.</p></section>

          <section class="tc-sec"><h2>Wissenswand (${S.notes().length} Zettel)</h2>
            <p class="tc-hint">Das Vorwissen gilt für dieses Gerät, nicht für ein einzelnes Profil. Auf der Waldkarte ganz am Anfang des Weges.</p>
            <div class="row-btns left"><button class="btn btn-soft" data-wall>Wissenswand öffnen</button><button class="btn btn-soft" data-wallcopy>${A.icon('copy')}<span>Als Text kopieren</span></button></div>
            <textarea class="tc-out" id="tc-wall" rows="4" readonly hidden></textarea></section>

          <section class="tc-sec"><h2>Forscherbuch exportieren</h2>
            <p class="tc-hint">Enthält alle Beobachtungen aller Profile auf diesem Gerät.</p>
            <div class="row-btns left"><button class="btn btn-soft" data-exp="csv">${A.icon('download')}<span>Tabelle (CSV)</span></button><button class="btn btn-soft" data-exp="json">${A.icon('download')}<span>Mit Zeichnungen (JSON)</span></button><button class="btn btn-soft" data-exp="copy">${A.icon('copy')}<span>Tabelle kopieren</span></button></div>
            <textarea class="tc-out" id="tc-out" rows="4" readonly hidden></textarea></section>

          <section class="tc-sec"><h2>Fotos und Bildnachweise</h2>
            <p class="tc-hint">Fotos liegen in assets/fotos/. Vor der Veröffentlichung Quelle und Lizenz in js/content.js (photos) eintragen.</p>
            <div class="row-btns left"><button class="btn btn-soft" data-credits>Bildnachweise ansehen</button></div></section>

          <section class="tc-sec"><h2>Forscherurkunde</h2>
            <p class="tc-hint">Die Urkunde gilt für das gerade aktive Forscherprofil. Der Name wird nur zum Drucken eingetragen und nicht gespeichert.</p>
            <div class="row-btns left"><button class="btn btn-soft" data-cert>Urkunde öffnen</button></div></section>

          <section class="tc-sec tc-danger"><h2>Alles zurücksetzen</h2>
            <p class="tc-hint">Löscht alle Profile, Fortschritte, Forscherbücher und Einstellungen auf diesem Gerät.</p>
            <button class="btn btn-warn" data-all>Alles löschen</button></section>
        </div>`;

        el.querySelectorAll('input[name="lvl"]').forEach((r) => r.addEventListener('change', () => { S.setting('level', r.value); UI.toast(`Stufe: ${Ct.levels.find((l) => l.id === r.value).label}`); }));
        el.querySelector('#tc-sound').addEventListener('change', (e) => { S.setting('sound', e.target.checked); MW.UI.topbar(MW.Screens.teacher.topbar); });
        el.querySelector('#tc-auto').addEventListener('change', (e) => S.setting('autoRead', e.target.checked));
        el.querySelector('#tc-rm').addEventListener('change', (e) => { S.setting('reduceMotion', e.target.checked); UI.applyMotion(); });
        el.querySelectorAll('[data-ch]').forEach((c) => c.addEventListener('change', () => {
          const id = +c.dataset.ch; const set = new Set(S.settings.unlocked);
          c.checked ? set.add(id) : set.delete(id); S.setting('unlocked', [...set].sort());
        }));
        el.querySelectorAll('[data-reset]').forEach((b) => b.addEventListener('click', () => UI.confirm('Fortschritt dieses Profils zurücksetzen? Das Forscherbuch bleibt erhalten.', 'Zurücksetzen', () => { S.resetProfile(b.dataset.reset); draw(); UI.toast('Zurückgesetzt'); })));
        el.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => UI.confirm('Dieses Profil mit allen Daten löschen?', 'Löschen', () => { S.deleteProfile(b.dataset.del); draw(); UI.toast('Profil gelöscht'); })));
        el.querySelector('[data-wall]').addEventListener('click', () => MW.App.go('vorwissen'));
        el.querySelector('[data-wallcopy]').addEventListener('click', () => {
          const V = Ct.vorwissen;
          const txt = S.notes().map((n) => `- ${n.text}${n.status ? ` (${V.status[n.status].label})` : ''}`).join('\n') || '(noch keine Zettel)';
          const out = el.querySelector('#tc-wall'); out.hidden = false; out.value = 'Unsere Wissenswand – Vorwissen über Pilze\n' + txt;
          const sel = () => { out.focus(); out.select(); };
          if (navigator.clipboard) navigator.clipboard.writeText(out.value).then(() => UI.toast('Wissenswand kopiert'), sel); else sel();
        });
        el.querySelector('[data-cert]').addEventListener('click', () => MW.App.go('urkunde'));
        el.querySelector('[data-credits]').addEventListener('click', () => UI.credits());
        el.querySelector('[data-all]').addEventListener('click', () => UI.confirm('Wirklich alle Daten auf diesem Gerät löschen?', 'Alles löschen', () => { S.resetAll(); UI.applyMotion(); MW.App.go('profiles', {}, { reset: true }); }));
        el.querySelectorAll('[data-exp]').forEach((b) => b.addEventListener('click', () => {
          const rows = exportRows();
          if (!rows.length) { UI.toast('Noch keine Beobachtungen vorhanden.'); return; }
          const stamp = new Date().toISOString().slice(0, 10);
          const out = el.querySelector('#tc-out');
          if (b.dataset.exp === 'csv') { if (!download(`forscherbuch-${stamp}.csv`, csv(rows), 'text/csv;charset=utf-8')) { out.hidden = false; out.value = csv(rows); } }
          else if (b.dataset.exp === 'json') { const data = JSON.stringify(rows.map((r) => Object.assign({}, r, { zeichnung: r._drawing || null, _drawing: undefined })), null, 2); if (!download(`forscherbuch-${stamp}.json`, data, 'application/json')) { out.hidden = false; out.value = data; } }
          else {
            const text = csv(rows).replace('﻿', '');
            out.hidden = false; out.value = text;
            const sel = () => { out.focus(); out.select(); };
            if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => UI.toast('Tabelle kopiert'), sel); else sel();
          }
        }));
      }
      MW.UI.task({ text: 'Hier stellen Erwachsene die App ein.', easy: 'Hier stellen Erwachsene die App ein.' });
      draw();
    }
  };
})();
