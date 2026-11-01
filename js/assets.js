/* =========================================================================
   Asset-Schicht
   -------------------------------------------------------------------------
   Alle Bildschirme holen Figuren und Bilder über MW.Assets, nie direkt über
   MW.Art. So lassen sich Grafiken später durch professionelle Illustrationen
   ersetzen: Datei in assets/ ablegen und hier eintragen.

   Beispiel:
     OVERRIDES['myra:happy'] = 'assets/characters/myra-happy.webp';
     OVERRIDES['pic:pilz']   = 'assets/pics/pilz.png';
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});

  const OVERRIDES = {
    // 'myra:neutral': 'assets/characters/myra-neutral.webp',
  };

  function img(src, alt, cls) {
    return `<img class="${cls}" src="${src}" alt="${alt}" draggable="false">`;
  }

  MW.Assets = {
    OVERRIDES,
    /** Figur: name = myra | bruno | fips | lila | mystery; state = neutral | happy | thinking | encouraging */
    char(name, state = 'neutral') {
      const key = `${name}:${state}`;
      if (OVERRIDES[key]) return img(OVERRIDES[key], name, `char char-${name}`);
      const fn = MW.Art[name];
      return fn ? fn(state) : '';
    },
    pic(name) {
      return OVERRIDES[`pic:${name}`] ? img(OVERRIDES[`pic:${name}`], name, 'pic') : MW.Art.pic(name);
    },
    shroom(type, label) {
      return OVERRIDES[`shroom:${type}`] ? img(OVERRIDES[`shroom:${type}`], label, 'shroom') : MW.Art.shroom(type, { label });
    },
    garden(name) {
      return OVERRIDES[`garden:${name}`] ? img(OVERRIDES[`garden:${name}`], name, 'g-item') : MW.Art.gardenItem(name);
    }
  };
})();
