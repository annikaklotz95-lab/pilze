/* =========================================================================
   Zuordnen per Antippen ODER Ziehen
   -------------------------------------------------------------------------
   Antippen: Teil antippen (wird ausgewählt) → Zielfeld antippen.
   Ziehen:   Teil mit Finger/Maus auf ein Zielfeld ziehen.
   Tastatur: Teil mit Enter wählen, Zielfeld mit Tab ansteuern, Enter.
   onDrop(piece, zoneId, zoneEl) gibt false zurück, wenn es nicht passt –
   dann bleibt das Teil ausgewählt.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});

  MW.DnD = {
    create({ root, pieceSel, zoneSel, onDrop, onPick }) {
      let sel = null, drag = null;
      const zones = () => [...root.querySelectorAll(zoneSel)].filter((z) => !z.classList.contains('is-filled') && !z.closest('[hidden]'));
      const rectOf = (z) => (z.querySelector('.dz-hit') || z).getBoundingClientRect();
      const zoneAt = (x, y) => zones().find((z) => { const r = rectOf(z); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });

      function clear() {
        if (sel) { sel.classList.remove('is-sel'); sel.setAttribute('aria-pressed', 'false'); }
        sel = null; root.classList.remove('dnd-active');
      }
      function select(p) {
        if (sel === p) { clear(); return; }
        clear(); sel = p; p.classList.add('is-sel'); p.setAttribute('aria-pressed', 'true'); root.classList.add('dnd-active');
        onPick && onPick(p);
      }
      function drop(p, z) {
        const ok = onDrop(p, z.dataset.zone, z);
        if (ok === false) { p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); if (sel !== p) select(p); }
        else clear();
      }

      function onClick(e) {
        const p = e.target.closest(pieceSel);
        if (p && root.contains(p)) {
          if (Date.now() - (p._dragEnd || 0) < 400 || p.disabled) return;
          select(p); return;
        }
        const z = e.target.closest(zoneSel);
        if (z && sel && !z.classList.contains('is-filled')) drop(sel, z);
      }
      function onKey(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const z = e.target.closest && e.target.closest(zoneSel);
        if (z && sel) { e.preventDefault(); drop(sel, z); }
      }
      function onDown(e) {
        const p = e.target.closest(pieceSel);
        if (!p || p.disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
        drag = { p, x: e.clientX, y: e.clientY, on: false, ghost: null };
      }
      function onMove(e) {
        if (!drag) return;
        if (!drag.on) {
          if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 10) return;
          drag.on = true;
          const r = drag.p.getBoundingClientRect();
          const g = drag.p.cloneNode(true);
          g.classList.add('dnd-ghost'); g.classList.remove('is-sel');
          g.style.width = r.width + 'px'; g.style.height = r.height + 'px';
          drag.dx = e.clientX - r.left; drag.dy = e.clientY - r.top;
          document.body.appendChild(g); drag.ghost = g;
          drag.p.classList.add('is-lifted'); root.classList.add('dnd-active');
        }
        e.preventDefault();
        drag.ghost.style.transform = `translate(${e.clientX - drag.dx}px, ${e.clientY - drag.dy}px) rotate(-3deg)`;
        const over = zoneAt(e.clientX, e.clientY);
        zones().forEach((z) => z.classList.toggle('is-over', z === over));
      }
      function onUp(e) {
        if (!drag) return;
        const d = drag; drag = null;
        if (!d.on) return;
        d.ghost.remove(); d.p.classList.remove('is-lifted');
        zones().forEach((z) => z.classList.remove('is-over'));
        d.p._dragEnd = Date.now();
        if (!sel) root.classList.remove('dnd-active');
        const z = zoneAt(e.clientX, e.clientY);
        if (z) drop(d.p, z);
      }

      root.addEventListener('click', onClick);
      root.addEventListener('keydown', onKey);
      root.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      return {
        clear,
        destroy() {
          root.removeEventListener('click', onClick); root.removeEventListener('keydown', onKey); root.removeEventListener('pointerdown', onDown);
          window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
          if (drag && drag.ghost) drag.ghost.remove();
        }
      };
    }
  };
})();
