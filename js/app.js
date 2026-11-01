/* =========================================================================
   Navigation & Start
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  const app = document.getElementById('app');
  let stack = [];      // Verlauf für „Zurück“
  let cleanup = null;

  function show(name, params) {
    const scr = MW.Screens[name];
    if (!scr) return;
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    MW.Voice.stop();
    const old = app.querySelector('.screen');
    const el = document.createElement('section');
    el.className = `screen screen-${name}`;
    app.appendChild(el);
    MW.UI.topbar(Object.assign({}, scr.topbar || {}));
    document.getElementById('lila-bubble').hidden = true;
    cleanup = scr.render(el, params || {}) || null;
    requestAnimationFrame(() => el.classList.add('in'));
    if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 380); }
    window.scrollTo(0, 0);
  }

  MW.App = {
    go(name, params = {}, opts = {}) {
      if (!MW.Store.profile() && name !== 'profiles' && name !== 'teacher') name = 'profiles';
      if (opts.reset) stack = [];
      if (opts.replace && stack.length) stack[stack.length - 1] = { name, params };
      else stack.push({ name, params });
      show(name, params);
    },
    back() {
      if (stack.length > 1) { stack.pop(); const t = stack[stack.length - 1]; show(t.name, t.params); }
      else MW.App.go('home', {}, { reset: true });
    }
  };

  // Start
  MW.UI.applyMotion();
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', MW.UI.applyMotion);
  MW.App.go(MW.Store.profile() ? 'home' : 'profiles', {}, { reset: true });

  // Optional: als App installierbar / offline (nur auf echtem Webserver, z. B. GitHub Pages)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && document.querySelector('link[rel="manifest"]')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
