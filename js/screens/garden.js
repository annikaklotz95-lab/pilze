/* =========================================================================
   Mein Wald – Belohnungswelt (Fantasiegarten)
   Bedienung: Element unten antippen → Stelle im Wald antippen (Tippsteuerung).
   Alternativ: Element in den Wald ziehen. Platzierte Elemente lassen sich
   antippen (auswählen) und verschieben oder wegräumen.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  MW.Screens.garden = {
    topbar: { back: true, home: true, lights: true },
    render(el) {
      const A = MW.Art, S = MW.Store, UI = MW.UI;
      const items = MW.Content.gardenItems;
      let selectedTool = null;   // item-id zum Platzieren
      let selectedPlaced = null; // id eines platzierten Elements
      const shelfCleanups = [];

      el.innerHTML = `
        <div class="garden-layout">
          <div class="garden-stage-wrap">
            <div class="garden-stage" role="application" aria-label="Dein Wald. Tippe hier, um das ausgewählte Teil zu platzieren.">
              <div class="garden-bg">${A.gardenScene(S.doneCount())}</div>
              <div class="garden-items"></div>
              <div class="garden-ghost" hidden></div>
            </div>
            <div class="garden-sel" hidden>
              <button class="btn btn-soft" data-act="deselect">${A.icon('check')}<span>Fertig</span></button>
              <button class="btn btn-warn" data-act="remove">${A.icon('trash')}<span>Wegräumen</span></button>
            </div>
          </div>
          <div class="garden-shelf" aria-label="Deine Waldschätze"></div>
        </div>
        <div class="dialog-slot garden-dialog"></div>`;

      const stage = el.querySelector('.garden-stage');
      const layer = el.querySelector('.garden-items');
      const shelf = el.querySelector('.garden-shelf');
      const selBar = el.querySelector('.garden-sel');

      function drawPlaced() {
        const p = S.profile();
        const list = [...p.garden.placed].sort((a, b) => a.y - b.y);
        layer.innerHTML = list.map((g) => `<button class="placed ${g.id === selectedPlaced ? 'is-sel' : ''}" data-id="${g.id}" style="left:${g.x}%;top:${g.y}%;--z:${Math.round(g.y)};--sc:${(0.7 + g.y / 220).toFixed(2)}" aria-label="${(items.find((i) => i.id === g.item) || {}).label || ''} – antippen zum Auswählen">${MW.Assets.garden(g.item)}</button>`).join('');
        layer.querySelectorAll('.placed').forEach((b) => attachDrag(b, b.dataset.id));
        selBar.hidden = !selectedPlaced;
        stage.classList.toggle('is-placing', !!selectedTool);
      }

      function drawShelf() {
        const p = S.profile();
        shelf.innerHTML = items.map((it) => {
          const un = p.garden.unlocked.includes(it.id);
          return `<button class="shelf-item ${un ? 'is-open' : 'is-locked'} ${selectedTool === it.id ? 'is-sel' : ''}" data-id="${it.id}" aria-label="${it.label}${un ? '' : `, freischalten für ${it.cost} Waldlichter`}">
            <span class="si-pic">${MW.Assets.garden(it.id)}</span>
            <span class="si-label">${it.label}</span>
            ${un ? '' : `<span class="si-cost">${A.lightOrb(22)}<b>${it.cost}</b></span>`}
          </button>`;
        }).join('');
        shelfCleanups.splice(0).forEach((f) => f());
        shelf.querySelectorAll('.shelf-item').forEach((b) => {
          b.addEventListener('click', () => { if (Date.now() - (b._dragEnd || 0) < 450) return; onShelf(b.dataset.id); });
          if (b.classList.contains('is-open')) attachShelfDrag(b, b.dataset.id);
        });
      }

      function onShelf(id) {
        const it = items.find((i) => i.id === id);
        const p = S.profile();
        if (!p.garden.unlocked.includes(id)) return askUnlock(it);
        selectedPlaced = null;
        selectedTool = selectedTool === id ? null : id;
        drawShelf(); drawPlaced();
        if (selectedTool) UI.say([{ who: 'myra', state: 'encouraging', text: `Tippe jetzt auf eine Stelle im Wald. Dort wächst ${artikel(it)}.` }]);
      }
      const artikel = (it) => ({ blume: 'die Waldblume', farn: 'der Farn', stein: 'der Moosstein', stumpf: 'der Baumstumpf', laterne: 'die Laterne', haus: 'das Pilzhäuschen' }[it.id]);

      function askUnlock(it) {
        const have = S.lights();
        const enough = have >= it.cost;
        const m = UI.modal(`<div class="unlock">
            <div class="unlock-pic">${MW.Assets.garden(it.id)}</div>
            <h2>${it.label}</h2>
            <p class="unlock-cost">${Array.from({ length: it.cost }, () => A.lightOrb(34)).join('')}</p>
            <p>${enough ? `Kostet ${it.cost} ${it.cost === 1 ? 'Waldlicht' : 'Waldlichter'}. Du hast ${have}.` : `Du brauchst ${it.cost} ${it.cost === 1 ? 'Waldlicht' : 'Waldlichter'}. Du hast ${have}. Im Abenteuer findest du mehr.`}</p>
            <div class="row-btns">${enough ? `<button class="btn btn-main" data-yes>Freischalten</button>` : `<button class="btn btn-main" data-adv>Zum Abenteuer</button>`}</div>
          </div>`, { label: it.label });
        const y = m.el.querySelector('[data-yes]');
        if (y) y.onclick = () => {
          if (S.unlockItem(it.id, it.cost)) {
            m.close(); UI.bumpLights();
            selectedTool = it.id; drawShelf(); drawPlaced();
            const art = artikel(it);
            UI.say([{ who: 'myra', state: 'happy', text: `${art.charAt(0).toUpperCase() + art.slice(1)} gehört jetzt zu deinem Wald.` }, { who: 'myra', state: 'encouraging', text: 'Tippe auf eine Stelle im Wald. Dann wächst es dort.' }]);
          }
        };
        const a = m.el.querySelector('[data-adv]');
        if (a) a.onclick = () => { m.close(); MW.App.go('map'); };
      }

      function posFromEvent(e) {
        const r = stage.getBoundingClientRect();
        const x = Math.min(94, Math.max(6, ((e.clientX - r.left) / r.width) * 100));
        const y = Math.min(96, Math.max(52, ((e.clientY - r.top) / r.height) * 100));
        return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
      }

      stage.addEventListener('click', (e) => {
        if (e.target.closest('.placed')) return;
        if (selectedTool) {
          const [x, y] = posFromEvent(e);
          S.placeItem(selectedTool, x, y);
          drawPlaced();
          return;
        }
        if (selectedPlaced) { selectedPlaced = null; drawPlaced(); }
      });

      selBar.addEventListener('click', (e) => {
        const b = e.target.closest('[data-act]'); if (!b) return;
        if (b.dataset.act === 'remove' && selectedPlaced) S.removeItem(selectedPlaced);
        selectedPlaced = null; drawPlaced();
      });

      /* Ziehen platzierter Elemente */
      function attachDrag(btn, id) {
        let start = null, moved = false;
        btn.addEventListener('pointerdown', (e) => { start = [e.clientX, e.clientY]; moved = false; btn.setPointerCapture(e.pointerId); });
        btn.addEventListener('pointermove', (e) => {
          if (!start) return;
          if (!moved && Math.hypot(e.clientX - start[0], e.clientY - start[1]) < 8) return;
          moved = true;
          const [x, y] = posFromEvent(e);
          btn.style.left = x + '%'; btn.style.top = y + '%'; btn.classList.add('is-drag');
        });
        btn.addEventListener('pointerup', (e) => {
          if (!start) return;
          start = null; btn.classList.remove('is-drag');
          if (moved) { const [x, y] = posFromEvent(e); S.moveItem(id, x, y); drawPlaced(); }
          else { selectedTool = null; selectedPlaced = selectedPlaced === id ? null : id; drawShelf(); drawPlaced(); }
        });
        btn.addEventListener('pointercancel', () => { start = null; drawPlaced(); });
        btn.addEventListener('keydown', (e) => {
          const p = S.profile().garden.placed.find((g) => g.id === id); if (!p) return;
          const step = { ArrowLeft: [-3, 0], ArrowRight: [3, 0], ArrowUp: [0, -3], ArrowDown: [0, 3] }[e.key];
          if (step) { e.preventDefault(); S.moveItem(id, Math.min(94, Math.max(6, p.x + step[0])), Math.min(96, Math.max(52, p.y + step[1]))); selectedPlaced = id; drawPlaced(); layer.querySelector(`[data-id="${id}"]`).focus(); }
          if (e.key === 'Delete' || e.key === 'Backspace') { S.removeItem(id); selectedPlaced = null; drawPlaced(); }
        });
      }

      /* Ziehen aus dem Regal in den Wald (Alternative zur Tippsteuerung) */
      const ghost = el.querySelector('.garden-ghost');
      function attachShelfDrag(btn, item) {
        let start = null, dragging = false;
        btn.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse' && e.button !== 0) return; start = [e.clientX, e.clientY]; dragging = false; });
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        function move(e) {
          if (!start) return;
          if (!dragging && Math.hypot(e.clientX - start[0], e.clientY - start[1]) < 12) return;
          dragging = true;
          ghost.hidden = false; ghost.innerHTML = MW.Assets.garden(item);
          const r = stage.getBoundingClientRect();
          ghost.style.left = e.clientX - r.left + 'px'; ghost.style.top = e.clientY - r.top + 'px';
        }
        function up(e) {
          if (!start) return;
          const was = dragging; start = null; dragging = false; ghost.hidden = true;
          if (!was) return;
          const r = stage.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            const [x, y] = posFromEvent(e); S.placeItem(item, x, y); drawPlaced();
          }
          btn._dragEnd = Date.now();
        }
        shelfCleanups.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
      }

      drawShelf(); drawPlaced();
      UI.task(MW.Dialog.garden.task);
      if (!S.seen('garden')) { S.markSeen('garden'); UI.say(S.lights() === 0 && S.profile().garden.unlocked.length === 0 ? [...MW.Dialog.garden.first, ...MW.Dialog.garden.empty] : MW.Dialog.garden.first); }
      else if (S.lights() === 0 && S.profile().garden.unlocked.length === 0) UI.say(MW.Dialog.garden.empty);
      else UI.say(MW.Dialog.garden.back);

      return () => shelfCleanups.forEach((f) => f());
    }
  };
})();
