/* =========================================================================
   Fortschrittsspeicherung (nur lokal im Browser, keine Übertragung)
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  const KEY = 'myra-pilzwald-v1';

  const defaults = () => ({
    version: 1,
    profiles: {},
    active: null,
    knowledge: [], // Wissenswand: gilt für das ganze Gerät (die Klasse), nicht pro Profil
    settings: { level: 'forscher', sound: true, autoRead: true, reduceMotion: false, unlocked: [] }
  });

  const newProfile = (symbol, color) => ({
    id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    symbol, color,
    created: new Date().toISOString(),
    chapters: {},          // { 1: { done: true, at: ISO } }
    lightsEarned: 0,
    lightsSpent: 0,
    garden: { unlocked: [], placed: [] }, // placed: [{ id, item, x, y }]  x/y in %
    seen: {},              // welche Einführungsdialoge schon liefen
    journal: []            // Forscherbuch-Einträge
  });

  let state = defaults();
  let storageOk = true;

  function load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = Object.assign(defaults(), parsed);
        state.settings = Object.assign(defaults().settings, parsed.settings || {});
      }
    } catch (e) { storageOk = false; }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; }
    catch (e) { storageOk = false; }
  }

  load();

  const S = {
    get state() { return state; },
    get settings() { return state.settings; },
    get storageOk() { return storageOk; },
    save,

    profiles() { return Object.values(state.profiles).sort((a, b) => a.created.localeCompare(b.created)); },
    profile() { return state.profiles[state.active] || null; },
    createProfile(symbol, color) {
      const p = newProfile(symbol, color);
      state.profiles[p.id] = p; state.active = p.id; save(); return p;
    },
    selectProfile(id) { if (state.profiles[id]) { state.active = id; save(); } },
    deleteProfile(id) { delete state.profiles[id]; if (state.active === id) state.active = null; save(); },
    resetProfile(id) {
      const p = state.profiles[id]; if (!p) return;
      const fresh = newProfile(p.symbol, p.color);
      fresh.id = p.id; fresh.created = p.created; fresh.journal = p.journal; // Forscherbuch bleibt erhalten
      state.profiles[id] = fresh; save();
    },
    resetAll() { state = defaults(); save(); },
    setting(k, v) { state.settings[k] = v; save(); },

    /* Kapitel */
    isDone(n) { const p = S.profile(); return !!(p && p.chapters[n] && p.chapters[n].done); },
    isUnlocked(n) { return n === 1 || S.isDone(n - 1) || state.settings.unlocked.includes(n); },
    status(n) { return S.isDone(n) ? 'done' : S.isUnlocked(n) ? 'open' : 'locked'; },
    doneCount() { const p = S.profile(); return p ? Object.values(p.chapters).filter((c) => c.done).length : 0; },
    /** markiert Kapitel als geschafft; gibt zurück, ob es das erste Mal war */
    completeChapter(n, lights) {
      const p = S.profile(); if (!p) return false;
      const first = !S.isDone(n);
      if (first) { p.chapters[n] = { done: true, at: new Date().toISOString() }; p.lightsEarned += lights; }
      save(); return first;
    },

    /* Waldlichter & Garten */
    lights() { const p = S.profile(); return p ? p.lightsEarned - p.lightsSpent : 0; },
    unlockItem(id, cost) {
      const p = S.profile(); if (!p || p.garden.unlocked.includes(id) || S.lights() < cost) return false;
      p.garden.unlocked.push(id); p.lightsSpent += cost; save(); return true;
    },
    placeItem(item, x, y) {
      const p = S.profile(); if (!p) return null;
      const obj = { id: 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), item, x, y };
      p.garden.placed.push(obj); save(); return obj;
    },
    moveItem(id, x, y) { const p = S.profile(); const o = p && p.garden.placed.find((g) => g.id === id); if (o) { o.x = x; o.y = y; save(); } },
    removeItem(id) { const p = S.profile(); if (!p) return; p.garden.placed = p.garden.placed.filter((g) => g.id !== id); save(); },

    /* Einführungen nur einmal */
    seen(key) { const p = S.profile(); return !!(p && p.seen[key]); },
    markSeen(key) { const p = S.profile(); if (p) { p.seen[key] = true; save(); } },

    /* Wissenswand (Vorwissen der Klasse) */
    notes() { return state.knowledge || (state.knowledge = []); },
    addNote(text, color) {
      const n = { id: 'k' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text, color, status: null, created: new Date().toISOString() };
      S.notes().push(n); save(); return n;
    },
    setNoteStatus(id, status) { const n = S.notes().find((x) => x.id === id); if (n) { n.status = n.status === status ? null : status; save(); } },
    removeNote(id) { state.knowledge = S.notes().filter((x) => x.id !== id); save(); },

    /* Forscherbuch */
    addEntry(entry) {
      const p = S.profile(); if (!p) return false;
      p.journal.push(Object.assign({ id: 'j' + Date.now().toString(36), created: new Date().toISOString() }, entry));
      try { save(); window.localStorage.getItem(KEY); } catch (e) {}
      return storageOk;
    },
    removeEntry(id) { const p = S.profile(); if (!p) return; p.journal = p.journal.filter((e) => e.id !== id); save(); },
    entries() { const p = S.profile(); return p ? [...p.journal].sort((a, b) => (a.date + a.created).localeCompare(b.date + b.created)) : []; }
  };

  MW.Store = S;
})();
