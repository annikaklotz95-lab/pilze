/* Anonyme Forscherprofile: Zeichen + Farbe statt Klarnamen */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  MW.Screens.profiles = {
    topbar: { hidden: false },
    render(el) {
      const A = MW.Art, Ct = MW.Content, S = MW.Store, UI = MW.UI;
      let mode = S.profiles().length ? 'pick' : 'new';
      let sym = null, col = null;

      function draw() {
        const list = S.profiles();
        const taken = new Set(list.map((p) => p.symbol + ':' + p.color));
        if (mode === 'pick') {
          el.innerHTML = `<div class="pf-wrap">
            <div class="pf-head"><div class="pf-myra">${MW.Assets.char('myra', 'happy')}</div><h1 class="pf-title">Wer forscht heute?</h1></div>
            <div class="pf-grid">${list.map((p) => {
              const c = Ct.profileColors.find((x) => x.id === p.color);
              return `<button class="pf-token" data-id="${p.id}">${A.symbol(p.symbol, c && c.hex)}<span>${UI.esc(Ct.profileName(p.symbol, p.color))}</span></button>`;
            }).join('')}
              <button class="pf-token pf-new" data-new>${A.icon('plus')}<span>Neues Zeichen</span></button>
            </div></div>
            <div class="dialog-slot pf-dialog"></div>`;
          el.querySelectorAll('.pf-token[data-id]').forEach((b) => b.addEventListener('click', () => { S.selectProfile(b.dataset.id); MW.App.go('home', {}, { replace: true, reset: true }); }));
          el.querySelector('[data-new]').addEventListener('click', () => { mode = 'new'; sym = col = null; draw(); });
          UI.say(MW.Dialog.profiles.hello);
        } else {
          el.innerHTML = `<div class="pf-wrap">
            <div class="pf-head"><div class="pf-myra">${MW.Assets.char('myra', 'encouraging')}</div><h1 class="pf-title">Dein Forscherzeichen</h1></div>
            <h2 class="pf-sub">1. Wähle ein Zeichen</h2>
            <div class="pf-pick">${Ct.profileSymbols.map((s) => `<button class="pf-opt ${sym === s.id ? 'is-sel' : ''}" data-sym="${s.id}" aria-label="${s.noun}" aria-pressed="${sym === s.id}">${A.symbol(s.id, '#F6EEDF')}</button>`).join('')}</div>
            <h2 class="pf-sub">2. Wähle eine Farbe</h2>
            <div class="pf-pick">${Ct.profileColors.map((c) => {
              const dis = sym && taken.has(sym + ':' + c.id);
              return `<button class="pf-col ${col === c.id ? 'is-sel' : ''}" data-col="${c.id}" style="--c:${c.hex}" aria-label="${c.adj}${dis ? ' – schon vergeben' : ''}" aria-pressed="${col === c.id}" ${dis ? 'disabled' : ''}>${sym ? A.symbol(sym) : ''}</button>`;
            }).join('')}</div>
            <div class="pf-result">${sym && col ? `${A.symbol(sym, Ct.profileColors.find((c) => c.id === col).hex)}<b>${UI.esc(Ct.profileName(sym, col))}</b>` : '<span>Dein Zeichen erscheint hier.</span>'}</div>
            <div class="row-btns">${list.length ? '<button class="btn btn-soft" data-cancel>Zurück</button>' : ''}<button class="btn btn-main" data-ok ${sym && col ? '' : 'disabled'}>Los geht’s</button></div>
            <p class="pf-privacy">Es werden keine Namen gespeichert. Alles bleibt auf diesem Gerät.</p>
          </div><div class="dialog-slot pf-dialog"></div>`;
          el.querySelectorAll('[data-sym]').forEach((b) => b.addEventListener('click', () => { sym = b.dataset.sym; if (col && taken.has(sym + ':' + col)) col = null; draw(); }));
          el.querySelectorAll('[data-col]').forEach((b) => b.addEventListener('click', () => { col = b.dataset.col; draw(); }));
          const c = el.querySelector('[data-cancel]'); if (c) c.addEventListener('click', () => { mode = 'pick'; draw(); });
          el.querySelector('[data-ok]').addEventListener('click', () => { if (!sym || !col) return; S.createProfile(sym, col); MW.App.go('home', {}, { replace: true, reset: true }); });
        }
      }
      MW.UI.task(MW.Dialog.profiles.task);
      draw();
    }
  };
})();
