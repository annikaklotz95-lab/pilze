/* Interaktive Kapitelkarte */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  function layoutKey(el) {
    const r = el.getBoundingClientRect();
    return r.height > r.width * 1.05 ? 'port' : 'land';
  }

  MW.Screens.map = {
    topbar: { back: true, home: true, lights: true },
    render(el, params = {}) {
      el.innerHTML = `<div class="map-wrap"></div><div class="dialog-slot map-dialog"></div>`;
      const wrap = el.querySelector('.map-wrap');
      const chapters = MW.Content.chapters;
      let key = null;

      const draw = () => {
        const k = layoutKey(wrap);
        if (k === key && wrap.firstChild) return;
        key = k;
        const status = chapters.map((c) => MW.Store.status(c.id));
        wrap.innerHTML = MW.Art.mapScene(k, chapters, status);
        // Myra steht am nächsten offenen Ort
        const nextIdx = Math.max(0, status.findIndex((s) => s === 'open'));
        const atWall = MW.Store.notes().length === 0 && MW.Store.doneCount() === 0;
        const node = atWall ? [MW.Art.WALL_POS[k][0] + (k === 'land' ? 250 : -250), MW.Art.WALL_POS[k][1] + (k === 'land' ? 60 : 0)] : MW.Art.MAP_LAYOUT[k].nodes[nextIdx === -1 ? 0 : nextIdx];
        const svg = wrap.querySelector('svg');
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'map-myra');
        g.setAttribute('transform', `translate(${node[0] - 170} ${node[1] - 120})`);
        g.innerHTML = MW.Assets.char('myra', 'encouraging').replace('<svg ', '<svg width="96" height="120" ');
        svg.appendChild(g);
        svg.insertAdjacentHTML('beforeend', MW.Art.wallNode(k, MW.Store.notes().length));
        svg.querySelectorAll('.map-node').forEach((n) => {
          const open = () => onNode(+n.dataset.ch);
          n.addEventListener('click', open);
          n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        });
      };

      function onNode(id) {
        if (id === 0) { MW.App.go('vorwissen'); return; }
        const ch = chapters.find((c) => c.id === id);
        const st = MW.Store.status(id);
        if (st === 'locked') {
          const prev = chapters.find((c) => c.id === id - 1);
          MW.UI.say(MW.Dialog.map.locked(prev ? prev.title : ''));
          return;
        }
        if (ch.built) { MW.App.go(ch.screen); return; }
        MW.UI.say(MW.Dialog.map.soon[id]);
      }

      draw();
      const ro = new ResizeObserver(() => draw());
      ro.observe(wrap);

      MW.UI.task(MW.Dialog.map.task);
      if (!MW.Store.seen('map')) { MW.Store.markSeen('map'); MW.UI.say(MW.Dialog.map.first); }
      else if (MW.Store.isDone(6) && !MW.Store.seen('map-after6')) { ['map-after6', 'map-after5', 'map-after4', 'map-after3', 'map-after2', 'map-after1'].forEach((k) => MW.Store.markSeen(k)); MW.UI.say(MW.Dialog.map.after6); }
      else if (MW.Store.isDone(5) && !MW.Store.seen('map-after5')) { ['map-after5', 'map-after4', 'map-after3', 'map-after2', 'map-after1'].forEach((k) => MW.Store.markSeen(k)); MW.UI.say(MW.Dialog.map.after5); }
      else if (MW.Store.isDone(4) && !MW.Store.seen('map-after4')) { ['map-after4', 'map-after3', 'map-after2', 'map-after1'].forEach((k) => MW.Store.markSeen(k)); MW.UI.say(MW.Dialog.map.after4); }
      else if (MW.Store.isDone(3) && !MW.Store.seen('map-after3')) { ['map-after3', 'map-after2', 'map-after1'].forEach((k) => MW.Store.markSeen(k)); MW.UI.say(MW.Dialog.map.after3); }
      else if (MW.Store.isDone(2) && !MW.Store.seen('map-after2')) { MW.Store.markSeen('map-after2'); MW.Store.markSeen('map-after1'); MW.UI.say(MW.Dialog.map.after2); }
      else if (MW.Store.isDone(1) && !MW.Store.seen('map-after1')) { MW.Store.markSeen('map-after1'); MW.UI.say(MW.Dialog.map.after1); }
      else MW.UI.say(MW.Dialog.map.back);

      return () => ro.disconnect();
    }
  };
})();
