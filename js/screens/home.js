/* Startbildschirm: zusammenhängende Waldszene mit Wegweiser-Navigation */
(function () {
  const MW = (window.MW = window.MW || {});
  MW.Screens = MW.Screens || {};

  const SIGNS = [
    { go: 'map', label: 'Abenteuer', sub: 'Waldkarte', icon: 'abenteuer', color: '#E9C776', dir: 'right' },
    { go: 'lexikon', label: 'Pilze entdecken', sub: 'Steckbriefe', icon: 'lexikon', color: '#D9A588', dir: 'left' },
    { go: 'journal', label: 'Forscherbuch', sub: 'Champignons', icon: 'forscherbuch', color: '#B9C7A9', dir: 'right' },
    { go: 'garden', label: 'Mein Wald', sub: 'Waldgarten', icon: 'meinwald', color: '#C7A9AC', dir: 'left' }
  ];

  MW.Screens.home = {
    topbar: { profile: true, lights: true },
    render(el) {
      const A = MW.Art;
      const done = MW.Store.doneCount();
      el.innerHTML = `
        <div class="scene-bg">${A.homeScene(done)}</div>
        <div class="motes" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<i style="--x:${8 + i * 10}%;--d:${(i * 1.7) % 9}s;--s:${0.6 + (i % 3) * 0.25}"></i>`).join('')}</div>
        <header class="home-title">
          <h1><span class="t-small">Myras geheimnisvoller</span><span class="t-big">Pilzwald</span></h1>
        </header>
        <div class="home-myra">${MW.Assets.char('myra', 'happy')}</div>
        <div class="dialog-slot home-dialog"></div>
        <nav class="signpost" aria-label="Hauptmenü">
          <div class="post" aria-hidden="true"></div>
          ${SIGNS.map((s, i) => `<button class="plank plank-${s.dir} ${i === 0 && done === 0 ? 'is-hint' : ''}" data-go="${s.go}" style="--i:${i}">
              ${A.plank(s.color, s.dir)}
              <span class="plank-ico">${A.signIcon(s.icon)}</span>
              <span class="plank-txt"><b>${s.label}</b><small>${s.sub}</small></span>
            </button>`).join('')}
        </nav>
        <button class="teacher-key" aria-label="Lehrkraftbereich öffnen">${A.icon('key')}<span>Lehrkraft</span></button>`;

      el.querySelectorAll('.plank').forEach((b) => b.addEventListener('click', () => MW.App.go(b.dataset.go)));
      el.querySelector('.teacher-key').addEventListener('click', () => MW.Screens.teacher.gate());
      const myra = el.querySelector('.home-myra');
      myra.addEventListener('click', () => MW.UI.say(MW.Dialog.home.back));

      MW.UI.task(MW.Dialog.home.task);
      const first = !MW.Store.seen('home');
      MW.UI.say(first ? MW.Dialog.home.first : MW.Dialog.home.back);
      if (first) MW.Store.markSeen('home');
    }
  };
})();
