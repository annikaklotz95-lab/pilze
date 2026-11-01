/* =========================================================================
   Myras geheimnisvoller Pilzwald – Illustrationen (programmatisch, SVG)
   -------------------------------------------------------------------------
   Alle Grafiken werden hier als SVG-Strings erzeugt. Sie nutzen die
   gemeinsamen Filter aus index.html (#f-paint, #f-wob, #f-soft …), die
   Buntstift-Körnung und organisch "wackelige" Konturen erzeugen.

   Austauschbar: In js/assets.js können einzelne Grafiken durch fertige
   PNG/WebP/SVG-Dateien ersetzt werden, ohne diese Datei anzufassen.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});

  const C = {
    wald: '#526F55', salbei: '#A7BA9A', creme: '#F6EEDF', sand: '#DCC8AA',
    rost: '#B8674A', braun: '#765843', honig: '#E9C776', beere: '#A77F86',
    // harmonische Erweiterungen
    ink: '#3E3129', moos: '#6F8A5B', tief: '#3F5643', haut: '#F1D5B8',
    rot: '#C4503B', stein: '#A9A39A', steinDunkel: '#857F77', blau: '#7E9AA8',
    holz: '#9A7352', holzHell: '#C29B6E', nebel: '#EDE8DC', papier: '#EFE3CB'
  };
  const INK = C.ink;

  /* ---------- kleine Helfer ---------------------------------------------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f1 = (n) => Math.round(n * 10) / 10;

  function leafPath(len, w) {
    return `M0 0 C ${f1(len * 0.3)} ${f1(-w)} ${f1(len * 0.75)} ${f1(-w * 0.9)} ${len} 0 C ${f1(len * 0.75)} ${f1(w * 0.9)} ${f1(len * 0.3)} ${f1(w)} 0 0 Z`;
  }
  function leaf(x, y, rot, len, w, fill, sw = 1.6, vein = true) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="${leafPath(len, w)}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>${
      vein ? `<path d="M2 0 Q ${f1(len * 0.5)} ${f1(-w * 0.15)} ${f1(len * 0.88)} 0" fill="none" stroke="${INK}" stroke-opacity=".4" stroke-width="${sw * 0.7}" stroke-linecap="round"/>` : ''
    }</g>`;
  }

  /* Farnwedel: wächst entlang -y */
  function fern(x, y, s, rot, fill, n = 9, L = 170) {
    let out = `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${s})">`;
    out += `<path d="M0 0 Q 16 ${-L * 0.5} 4 ${-L}" fill="none" stroke="${C.tief}" stroke-width="3.2" stroke-linecap="round"/>`;
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      const px = 2 * (1 - t) * t * 16 + t * t * 4;
      const py = -L * t;
      const len = 50 * (1 - t * 0.78);
      const w = len * 0.26;
      out += leaf(px, py, -28 - t * 10, len, w, fill, 1.3, false);
      out += leaf(px, py, -152 + t * 10, len, w, fill, 1.3, false);
    }
    out += leaf(4, -L, -90, 18, 5, fill, 1.3, false);
    return out + '</g>';
  }

  function grass(x, y, s, color, rnd) {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const bx = (i - 3) * 6;
      const h = 30 + rnd() * 28;
      const lean = (rnd() - 0.5) * 26;
      d += `M${bx} 0 Q ${f1(bx + lean * 0.4)} ${f1(-h * 0.6)} ${f1(bx + lean)} ${f1(-h)} `;
    }
    return `<path transform="translate(${f1(x)} ${f1(y)}) scale(${s})" d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>`;
  }

  /* kleiner Deko-Pilz für Szenen */
  function tinyShroom(x, y, s, cap, flip = 1) {
    return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * flip)} ${f1(s)})">
      <path d="M-7 0 C -8 -14 -6 -26 -5 -34 L 5 -34 C 6 -26 8 -14 7 0 Z" fill="${C.creme}" stroke="${INK}" stroke-width="2"/>
      <path d="M-26 -32 C -26 -52 -14 -64 0 -64 C 14 -64 26 -52 26 -32 C 14 -36 -14 -36 -26 -32 Z" fill="${cap}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M-16 -50 C -12 -58 -4 -60 2 -59" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
    </g>`;
  }

  function stone(x, y, rx, ry, fill = C.stein) {
    return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M${-rx} 0 C ${-rx} ${-ry * 1.1} ${rx * 0.3} ${-ry * 1.3} ${rx} ${-ry * 0.2} C ${rx * 1.1} ${ry * 0.6} ${-rx * 0.6} ${ry * 0.7} ${-rx} 0 Z" fill="${fill}" stroke="${INK}" stroke-width="2"/><path d="M${-rx * 0.5} ${-ry * 0.6} Q 0 ${-ry * 0.95} ${rx * 0.45} ${-ry * 0.55}" stroke="#fff" stroke-opacity=".3" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
  }

  /* =======================================================================
     FIGUREN
     ======================================================================= */

  /* ---- Myra ------------------------------------------------------------ */
  // Kleines Waldwesen: breite Pilzmütze, Haar-Pony, Elfenohren, Blätterumhang mit Eichel-Schließe
  function myra(state = 'neutral') {
    const HAIR = '#8A5A42', HAIR_D = '#6E4434', SLEEVE = C.moos;
    const eyes = {
      neutral: `<ellipse cx="88" cy="132" rx="5.6" ry="7.2" fill="${INK}"/><ellipse cx="112" cy="132" rx="5.6" ry="7.2" fill="${INK}"/><circle cx="90" cy="129" r="2.2" fill="#fff"/><circle cx="114" cy="129" r="2.2" fill="#fff"/>`,
      happy: `<path d="M82 134 Q 88 125 94 134" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M106 134 Q 112 125 118 134" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      thinking: `<ellipse cx="88" cy="133" rx="5.2" ry="6.6" fill="${INK}"/><circle cx="90" cy="130" r="2" fill="#fff"/><path d="M106 134 Q 112 131 118 134" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M81 120 Q 88 116 95 119" fill="none" stroke="${HAIR_D}" stroke-width="2.4" stroke-linecap="round"/>`,
      encouraging: `<ellipse cx="88" cy="131" rx="6" ry="7.8" fill="${INK}"/><ellipse cx="112" cy="131" rx="6" ry="7.8" fill="${INK}"/><circle cx="90.5" cy="128" r="2.5" fill="#fff"/><circle cx="114.5" cy="128" r="2.5" fill="#fff"/><path d="M82 119 Q 88 115 94 118" fill="none" stroke="${HAIR_D}" stroke-width="2.2" stroke-linecap="round"/><path d="M106 118 Q 112 115 118 119" fill="none" stroke="${HAIR_D}" stroke-width="2.2" stroke-linecap="round"/>`
    }[state];
    const mouth = {
      neutral: `<path d="M95 146 Q 100 150 105 146" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`,
      happy: `<path d="M92 143 Q 100 156 108 143 Z" fill="#8A4A3E" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M96 150 Q 100 152 104 150" fill="none" stroke="#D98C82" stroke-width="2" stroke-linecap="round"/>`,
      thinking: `<ellipse cx="104" cy="147" rx="3" ry="2.6" fill="#8A4A3E" stroke="${INK}" stroke-width="1.8"/>`,
      encouraging: `<path d="M92 144 Q 100 153 108 144" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
    }[state];
    // Arme: [Pfad links, Pfad rechts, Hand links, Hand rechts]
    const armsDef = {
      neutral: ['M76 172 Q 68 186 70 202', 'M124 172 Q 132 186 130 202', [70, 203], [130, 203]],
      happy: ['M76 170 Q 62 160 54 140', 'M124 170 Q 138 160 146 140', [54, 139], [146, 139]],
      thinking: ['M76 172 Q 68 186 70 202', 'M124 172 Q 128 162 114 158', [70, 203], [113, 157]],
      encouraging: ['M76 172 Q 68 186 70 202', 'M124 170 Q 142 158 150 136', [70, 203], [150, 135]]
    }[state];
    const tilt = state === 'thinking' ? -5 : state === 'encouraging' ? 4 : state === 'happy' ? 2 : 0;
    const arm = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${SLEEVE}" stroke-width="8.5" stroke-linecap="round"/>`;
    const hand = ([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${C.haut}" stroke="${INK}" stroke-width="2"/>`;
    const hem = [[64, 214, 104, C.wald], [80, 222, 96, C.moos], [100, 225, 90, C.wald], [120, 222, 84, C.moos], [136, 214, 76, C.wald]]
      .map(([x, y, r, c]) => leaf(x, y, r, 22, 9, c, 1.8)).join('');
    const handOnTop = state === 'thinking';
    return `<svg class="char char-myra state-${state}" viewBox="0 0 200 250" role="img" aria-label="Myra">
    <g filter="url(#f-paint)">
      <ellipse cx="100" cy="244" rx="46" ry="6" fill="${INK}" opacity=".16"/>
      <!-- Beine -->
      <path d="M90 222 L 89 236 M110 222 L 111 236" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
      <path d="M90 222 L 89 236 M110 222 L 111 236" stroke="${C.braun}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="86" cy="239" rx="9" ry="5" fill="#5A4231" stroke="${INK}" stroke-width="2"/><ellipse cx="114" cy="239" rx="9" ry="5" fill="#5A4231" stroke="${INK}" stroke-width="2"/>
      <!-- Blätterumhang -->
      <path d="M100 154 C 78 154 66 172 62 196 C 59 214 66 224 82 224 L 118 224 C 134 224 141 214 138 196 C 134 172 122 154 100 154 Z" fill="${C.wald}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M86 160 C 78 176 74 196 76 218 M114 160 C 122 176 126 196 124 218" fill="none" stroke="${C.tief}" stroke-width="2" stroke-opacity=".55" stroke-linecap="round"/>
      ${hem}
      ${arm(armsDef[0])}${handOnTop ? '' : arm(armsDef[1])}
      ${hand(armsDef[2])}${handOnTop ? '' : hand(armsDef[3])}
      <!-- Kragen aus zwei Blättern mit Eichel-Schließe -->
      ${leaf(100, 162, 200, 26, 10, C.salbei, 1.8)}${leaf(100, 162, -20, 26, 10, C.salbei, 1.8)}
      <circle cx="100" cy="163" r="5.5" fill="${C.honig}" stroke="${INK}" stroke-width="1.8"/>
      <g class="myra-head" transform="rotate(${tilt} 100 132)">
        <!-- Haar hinten -->
        <path d="M66 110 C 60 134 62 152 72 160 C 80 162 84 156 84 150 L 116 150 C 116 156 120 162 128 160 C 138 152 140 134 134 110 Z" fill="${HAIR}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
        <!-- Elfenohren -->
        <path d="M69 128 C 58 124 52 116 50 108 C 58 112 64 114 70 118 Z" fill="${C.haut}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M131 128 C 142 124 148 116 150 108 C 142 112 136 114 130 118 Z" fill="${C.haut}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
        <!-- Gesicht -->
        <path d="M68 128 C 68 108 82 100 100 100 C 118 100 132 108 132 128 C 132 148 118 160 100 160 C 82 160 68 148 68 128 Z" fill="${C.haut}" stroke="${INK}" stroke-width="2.4"/>
        <ellipse cx="80" cy="142" rx="6.5" ry="4" fill="${C.beere}" opacity=".5"/><ellipse cx="120" cy="142" rx="6.5" ry="4" fill="${C.beere}" opacity=".5"/>
        ${eyes}${mouth}
        <!-- Pony -->
        <path d="M70 116 C 74 104 86 100 100 100 C 114 100 126 104 130 116 C 124 112 118 116 112 112 C 106 118 98 114 94 110 C 88 116 80 112 70 116 Z" fill="${HAIR}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
        <!-- Pilzmütze -->
        <path d="M36 106 C 30 64 62 30 100 30 C 138 30 170 64 164 106 C 158 110 150 108 142 111 C 126 116 74 116 58 111 C 50 108 42 110 36 106 Z" fill="${C.rost}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M44 108 C 70 120 130 120 156 108 C 146 120 54 120 44 108 Z" fill="${C.sand}" stroke="${INK}" stroke-width="2"/>
        <path d="M58 113 L 60 117 M72 115 L 73 119 M86 116 L 86 120 M100 117 L 100 121 M114 116 L 114 120 M128 115 L 127 119 M142 113 L 140 117" stroke="${C.braun}" stroke-width="1.3" stroke-opacity=".7"/>
        <ellipse cx="70" cy="76" rx="9" ry="6" fill="${C.creme}" transform="rotate(-24 70 76)"/>
        <ellipse cx="102" cy="52" rx="7" ry="5" fill="${C.creme}"/>
        <ellipse cx="134" cy="78" rx="9.5" ry="6.5" fill="${C.creme}" transform="rotate(22 134 78)"/>
        <ellipse cx="96" cy="88" rx="5" ry="3.6" fill="${C.creme}"/>
        <ellipse cx="52" cy="96" rx="4.5" ry="3.2" fill="${C.creme}"/><ellipse cx="150" cy="98" rx="4" ry="3" fill="${C.creme}"/>
        <path d="M56 74 C 64 54 82 42 98 40" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="6" stroke-linecap="round"/>
        <path d="M100 31 C 99 24 101 18 105 14" fill="none" stroke="${C.tief}" stroke-width="2.6" stroke-linecap="round"/>
        ${leaf(105, 15, -38, 18, 7, C.moos, 1.6)}
      </g>
      ${handOnTop ? arm(armsDef[1]) + hand(armsDef[3]) : ''}
    </g></svg>`;
  }

  /* ---- Bruno, der Steinpilz -------------------------------------------- */
  function bruno(state = 'neutral') {
    const eyes = {
      neutral: `<ellipse cx="94" cy="170" rx="5.5" ry="7" fill="${INK}"/><ellipse cx="126" cy="170" rx="5.5" ry="7" fill="${INK}"/><circle cx="96" cy="167" r="2" fill="#fff"/><circle cx="128" cy="167" r="2" fill="#fff"/>`,
      happy: `<path d="M87 172 Q 94 163 101 172" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M119 172 Q 126 163 133 172" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      thinking: `<ellipse cx="94" cy="171" rx="5" ry="6.5" fill="${INK}"/><path d="M120 172 Q 126 169 132 172" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><circle cx="96" cy="168" r="1.8" fill="#fff"/>`,
      encouraging: `<ellipse cx="94" cy="169" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="126" cy="169" rx="6" ry="7.5" fill="${INK}"/><circle cx="96.5" cy="166" r="2.4" fill="#fff"/><circle cx="128.5" cy="166" r="2.4" fill="#fff"/>`
    }[state];
    const brows = state === 'thinking'
      ? `<path d="M85 156 Q 94 150 103 155" stroke="${C.braun}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M118 158 Q 126 156 134 159" stroke="${C.braun}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      : `<path d="M86 157 Q 94 152 102 156" stroke="${C.braun}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M118 156 Q 126 152 134 157" stroke="${C.braun}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const mouth = {
      neutral: `<path d="M102 188 Q 110 194 118 188" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`,
      happy: `<path d="M99 185 Q 110 200 121 185 Z" fill="#8A4A3E" stroke="${INK}" stroke-width="2.3" stroke-linejoin="round"/>`,
      thinking: `<path d="M104 190 Q 110 187 117 190" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`,
      encouraging: `<path d="M98 185 Q 110 199 122 185" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
    }[state];
    const armR = state === 'happy' || state === 'encouraging' ? 'M150 190 Q 172 176 176 156' : 'M150 196 Q 166 204 168 218';
    const armL = state === 'thinking' ? 'M70 198 Q 80 196 92 196' : 'M70 196 Q 54 204 52 218';
    return `<svg class="char char-bruno state-${state}" viewBox="0 0 220 260" role="img" aria-label="Bruno, der Steinpilz">
    <g filter="url(#f-paint)">
      <ellipse cx="110" cy="246" rx="66" ry="8" fill="${INK}" opacity=".16"/>
      <path d="${armL}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${armL}" fill="none" stroke="#E9DCC2" stroke-width="8.5" stroke-linecap="round"/>
      <path d="${armR}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="${armR}" fill="none" stroke="#E9DCC2" stroke-width="8.5" stroke-linecap="round"/>
      <path d="M72 238 C 56 208 62 160 80 130 L 140 130 C 158 160 164 208 148 238 C 128 250 92 250 72 238 Z" fill="#E9DCC2" stroke="${INK}" stroke-width="2.6"/>
      <path d="M84 140 l 8 8 m 4 -8 l 8 8 m 4 -8 l 8 8 m 4 -8 l 8 8 m -36 0 l 8 -8 m 4 8 l 8 -8 m 4 8 l 8 -8 m 4 8 l 8 -8" stroke="${C.braun}" stroke-width="1.3" stroke-opacity=".45" fill="none"/>
      <path d="M142 150 C 152 180 152 212 140 236" fill="none" stroke="${C.sand}" stroke-width="7" stroke-linecap="round" opacity=".9"/>
      <ellipse cx="88" cy="184" rx="8" ry="5" fill="${C.beere}" opacity=".45"/><ellipse cx="132" cy="184" rx="8" ry="5" fill="${C.beere}" opacity=".45"/>
      ${brows}${eyes}${mouth}
      <path d="M22 128 C 18 66 68 28 110 28 C 152 28 202 66 198 128 C 170 140 50 140 22 128 Z" fill="#8B5E3C" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M30 126 C 70 140 150 140 190 126 C 172 146 48 146 30 126 Z" fill="#E3D3A0" stroke="${INK}" stroke-width="2.2"/>
      <g fill="${C.braun}" opacity=".35">${Array.from({ length: 14 }, (_, i) => `<circle cx="${44 + i * 10}" cy="${133 + Math.sin(i) * 2}" r="1.6"/>`).join('')}</g>
      <path d="M54 76 C 66 54 90 42 110 41" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="8" stroke-linecap="round"/>
      <path d="M150 52 C 170 66 184 88 186 108" fill="none" stroke="${INK}" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>
    </g></svg>`;
  }

  /* ---- Fips, die Waldmaus ---------------------------------------------- */
  function fips(state = 'neutral') {
    const eyes = {
      neutral: `<circle cx="88" cy="104" r="6" fill="${INK}"/><circle cx="112" cy="104" r="6" fill="${INK}"/><circle cx="90" cy="101.5" r="2" fill="#fff"/><circle cx="114" cy="101.5" r="2" fill="#fff"/>`,
      happy: `<path d="M81 106 Q 88 98 95 106" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M105 106 Q 112 98 119 106" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`,
      thinking: `<circle cx="88" cy="104" r="5.5" fill="${INK}"/><path d="M106 105 Q 112 102 118 105" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="90" cy="101.5" r="1.8" fill="#fff"/>`,
      encouraging: `<circle cx="88" cy="103" r="6.5" fill="${INK}"/><circle cx="112" cy="103" r="6.5" fill="${INK}"/><circle cx="90.5" cy="100" r="2.4" fill="#fff"/><circle cx="114.5" cy="100" r="2.4" fill="#fff"/>`
    }[state];
    const mouth = state === 'happy'
      ? `<path d="M93 126 Q 100 135 107 126 Z" fill="#8A4A3E" stroke="${INK}" stroke-width="2"/>`
      : state === 'thinking' ? `<circle cx="104" cy="128" r="2.6" fill="#8A4A3E" stroke="${INK}" stroke-width="1.6"/>`
      : `<path d="M94 126 Q 100 131 106 126" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    const earTilt = state === 'thinking' ? 8 : state === 'happy' ? -6 : 0;
    return `<svg class="char char-fips state-${state}" viewBox="0 0 200 220" role="img" aria-label="Fips, die Waldmaus">
    <g filter="url(#f-paint)">
      <ellipse cx="100" cy="210" rx="44" ry="6" fill="${INK}" opacity=".16"/>
      <path d="M136 192 C 170 196 186 172 176 150 C 170 138 156 142 160 152" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <path d="M136 192 C 170 196 186 172 176 150 C 170 138 156 142 160 152" fill="none" stroke="#C9A79A" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="164" rx="42" ry="44" fill="#9C8A7C" stroke="${INK}" stroke-width="2.4"/>
      <ellipse cx="100" cy="176" rx="26" ry="28" fill="${C.creme}"/>
      <ellipse cx="80" cy="206" rx="13" ry="6" fill="#C9A79A" stroke="${INK}" stroke-width="2"/><ellipse cx="120" cy="206" rx="13" ry="6" fill="#C9A79A" stroke="${INK}" stroke-width="2"/>
      <g transform="rotate(${-earTilt} 66 76)"><circle cx="64" cy="74" r="27" fill="#9C8A7C" stroke="${INK}" stroke-width="2.4"/><circle cx="64" cy="76" r="17" fill="#D9AFA8"/></g>
      <g transform="rotate(${earTilt} 134 76)"><circle cx="136" cy="74" r="27" fill="#9C8A7C" stroke="${INK}" stroke-width="2.4"/><circle cx="136" cy="76" r="17" fill="#D9AFA8"/></g>
      <circle cx="100" cy="106" r="36" fill="#9C8A7C" stroke="${INK}" stroke-width="2.4"/>
      <ellipse cx="100" cy="120" rx="19" ry="13" fill="#B8A698"/>
      ${eyes}
      <ellipse cx="100" cy="114" rx="6" ry="4.6" fill="${C.beere}" stroke="${INK}" stroke-width="1.8"/>
      ${mouth}
      <path d="M78 118 L 56 112 M78 122 L 56 124 M122 118 L 144 112 M122 122 L 144 124" stroke="${INK}" stroke-width="1.3" stroke-opacity=".55" stroke-linecap="round"/>
      <ellipse cx="78" cy="122" rx="6" ry="3.6" fill="${C.beere}" opacity=".4"/><ellipse cx="122" cy="122" rx="6" ry="3.6" fill="${C.beere}" opacity=".4"/>
      <path d="M70 160 Q 78 170 88 168" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M130 160 Q 122 170 112 168" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>
    </g></svg>`;
  }

  /* ---- Lila, das Glühwürmchen ------------------------------------------ */
  function lila(state = 'neutral') {
    const eyes = state === 'happy'
      ? `<path d="M51 38 Q 55 33 59 38" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M63 38 Q 67 33 71 38" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
      : `<circle cx="55" cy="37" r="3.2" fill="${INK}"/><circle cx="67" cy="37" r="3.2" fill="${INK}"/><circle cx="56" cy="36" r="1.1" fill="#fff"/><circle cx="68" cy="36" r="1.1" fill="#fff"/>`;
    return `<svg class="char char-lila" viewBox="0 0 120 120" role="img" aria-label="Lila, das Glühwürmchen">
      <circle class="lila-glow" cx="61" cy="76" r="34" fill="url(#g-lila)"/>
      <g filter="url(#f-paint)">
        <ellipse cx="42" cy="48" rx="15" ry="24" fill="${C.creme}" fill-opacity=".8" stroke="${INK}" stroke-width="1.6" transform="rotate(-34 42 48)"/>
        <ellipse cx="80" cy="48" rx="15" ry="24" fill="${C.creme}" fill-opacity=".8" stroke="${INK}" stroke-width="1.6" transform="rotate(34 80 48)"/>
        <ellipse cx="61" cy="78" rx="16" ry="20" fill="${C.honig}" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="61" cy="82" rx="9" ry="12" fill="#FFF3C9" opacity=".9"/>
        <path d="M47 70 Q 61 74 75 70 M46 80 Q 61 85 76 80" stroke="${C.braun}" stroke-width="1.4" fill="none" stroke-opacity=".5"/>
        <circle cx="61" cy="52" r="10" fill="${C.braun}" stroke="${INK}" stroke-width="2"/>
        <circle cx="61" cy="38" r="12" fill="#8A6A52" stroke="${INK}" stroke-width="2"/>
        ${eyes}
        <path d="M57 44 Q 61 47 65 44" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M55 27 C 52 18 46 14 40 16" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M67 27 C 70 18 76 14 82 16" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="40" cy="16" r="3" fill="${C.honig}" stroke="${INK}" stroke-width="1.4"/><circle cx="82" cy="16" r="3" fill="${C.honig}" stroke="${INK}" stroke-width="1.4"/>
      </g></svg>`;
  }

  /* ---- der geheimnisvolle Bewohner (Avatar im Dialog) ------------------- */
  function mystery() {
    return `<svg class="char char-mystery" viewBox="0 0 120 120" role="img" aria-label="Geheimnisvolle Stimme">
      <g filter="url(#f-blur2)"><ellipse cx="60" cy="64" rx="44" ry="40" fill="${C.nebel}"/></g>
      <g filter="url(#f-blur1)" opacity=".75"><path d="M20 62 C 18 32 40 16 60 16 C 80 16 102 32 100 62 C 86 68 34 68 20 62 Z" fill="#6E6259"/><path d="M42 66 C 36 84 40 100 46 108 L 74 108 C 80 100 84 84 78 66 Z" fill="#8B8077"/></g>
      <circle cx="50" cy="84" r="3" fill="${C.honig}"/><circle cx="70" cy="84" r="3" fill="${C.honig}"/>
    </svg>`;
  }

  /* =======================================================================
     PILZARTEN (Steckbriefe, Lexikon, spätere Missionen)
     Jede Grafik hat Teilgruppen data-part="hut|unten|stiel" für Lupen-Interaktion
     ======================================================================= */
  const SHROOMS = {
    fliegenpilz: () => `
      <g data-part="stiel">
        <path d="M66 172 C 62 146 68 118 70 100 L 90 100 C 92 118 98 146 94 172 Z" fill="#F3EEE4" stroke="${INK}" stroke-width="2.4"/>
        <path d="M54 178 C 52 164 64 156 80 156 C 96 156 108 164 106 178 C 96 184 64 184 54 178 Z" fill="#EFE8DA" stroke="${INK}" stroke-width="2.4"/>
        <path d="M60 166 q 4 4 8 2 m 16 2 q 6 2 10 -2" stroke="${C.stein}" stroke-width="1.6" fill="none"/>
        <path d="M64 118 C 70 128 90 128 96 118 C 98 128 92 136 80 136 C 68 136 62 128 64 118 Z" fill="#F6F1E6" stroke="${INK}" stroke-width="2"/>
      </g>
      <g data-part="unten">
        <path d="M22 98 C 48 114 112 114 138 98 C 120 110 40 110 22 98 Z" fill="#F4EEDF" stroke="${INK}" stroke-width="2"/>
        <path d="M34 103 L 40 108 M46 105 L 50 110 M58 106 L 61 111 M70 107 L 72 111 M82 107 L 82 111 M94 107 L 92 111 M106 106 L 103 110 M118 104 L 114 109 M128 101 L 124 106" stroke="${C.stein}" stroke-width="1.4"/>
      </g>
      <g data-part="hut">
        <path d="M18 100 C 16 58 48 28 80 28 C 112 28 144 58 142 100 C 120 90 40 90 18 100 Z" fill="${C.rot}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M34 64 C 44 46 60 38 76 36" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="6" stroke-linecap="round"/>
        <g fill="#FBF6EC" stroke="${INK}" stroke-width="1.3">
          <path d="M42 70 l 7 -3 l 4 6 l -6 4 z"/><path d="M70 50 l 8 -2 l 3 6 l -8 3 z"/><path d="M100 58 l 9 0 l 1 7 l -9 1 z"/>
          <path d="M118 80 l 7 -2 l 3 6 l -7 2 z"/><path d="M60 80 l 6 -1 l 2 5 l -6 2 z"/><path d="M88 74 l 6 -2 l 2 6 l -6 1 z"/><path d="M32 88 l 5 -1 l 1 5 l -5 1 z"/>
        </g>
      </g>`,
    steinpilz: () => {
      // Schulbuch-Schema: Röhrenschicht als dicke Schicht unter dem Hut, Netz am oberen Stiel, bauchiger Stielfuß
      const tubes = [];
      for (let x = 26; x <= 134; x += 4.5) {
        const t = (x - 80) / 58;
        const top = 95.5 + 4 * (1 - t * t);
        const bot = 99 + 15 * Math.sqrt(Math.max(0, 1 - t * t));
        tubes.push(`M${f1(x)} ${f1(top)} L ${f1(x)} ${f1(Math.max(top + 2, bot))}`);
      }
      const pores = [];
      for (let x = 30; x <= 130; x += 6) {
        const t = (x - 80) / 58;
        pores.push(`<ellipse cx="${x}" cy="${f1(98.5 + 15 * Math.sqrt(Math.max(0, 1 - t * t)))}" rx="1.6" ry="1" />`);
      }
      const net = [];
      for (let y = 104; y < 150; y += 7) {
        for (let x = 64; x < 98; x += 7) {
          const w = 1 - (y - 104) / 60;
          net.push(`M${x} ${y} l 3.5 3.5 l -3.5 3.5 l -3.5 -3.5 Z`.replace(/^M(\d+)/, (m, v) => `M${v}`));
          if (w < 0.3) break;
        }
      }
      return `
      <g data-part="unten">
        <path d="M22 94 C 44 101 116 101 138 94 C 136 106 126 115 110 116 L 50 116 C 34 115 24 106 22 94 Z" fill="#E4D49A" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="${tubes.join(' ')}" stroke="#A89350" stroke-width="1.1" stroke-opacity=".75"/>
        <g fill="#8E7A3E" opacity=".55">${pores.join('')}</g>
        <path d="M26 100 C 46 106 114 106 134 100" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
      </g>
      <g data-part="stiel">
        <path d="M64 100 C 60 122 50 146 54 168 C 57 182 103 182 106 168 C 110 146 100 122 96 100 Z" fill="#ECDFC3" stroke="${INK}" stroke-width="2.4"/>
        <path d="${net.join(' ')}" fill="none" stroke="${C.braun}" stroke-width=".9" stroke-opacity=".5"/>
        <path d="M98 118 C 104 138 106 156 100 172" fill="none" stroke="${C.sand}" stroke-width="6" stroke-linecap="round"/>
        <path d="M62 134 C 58 150 58 162 62 172" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3.5" stroke-linecap="round"/>
      </g>
      <g data-part="hut">
        <path d="M18 94 C 14 50 48 22 80 22 C 112 22 146 50 142 94 C 120 100 40 100 18 94 Z" fill="#8B5E3C" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M20 92 C 42 98 118 98 140 92" fill="none" stroke="#C9A27A" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M36 58 C 46 40 62 31 78 30" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="7" stroke-linecap="round"/>
        <path d="M114 38 C 128 50 136 66 137 82" fill="none" stroke="${INK}" stroke-opacity=".14" stroke-width="9" stroke-linecap="round"/>
        <path d="M56 70 q 6 -2 10 1 M92 52 q 5 -1 8 2 M104 76 q 5 -2 9 0" fill="none" stroke="${INK}" stroke-opacity=".14" stroke-width="1.6" stroke-linecap="round"/>
      </g>`;
    },
    pfifferling: () => `
      <g data-part="stiel">
        <path d="M66 110 C 70 136 70 156 68 178 L 92 178 C 90 156 90 136 94 110 Z" fill="#E7B04A" stroke="${INK}" stroke-width="2.4"/>
      </g>
      <g data-part="unten">
        <path d="M30 70 C 34 86 54 94 66 112 L 94 112 C 106 94 126 86 130 70 Z" fill="#E8A83C" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M42 80 Q 58 96 70 116 M52 84 Q 64 100 74 120 M64 86 Q 72 104 78 126 M80 88 L 80 128 M96 86 Q 88 104 82 126 M108 84 Q 96 100 86 120 M118 80 Q 102 96 90 116" stroke="${C.braun}" stroke-width="1.3" stroke-opacity=".55" fill="none"/>
      </g>
      <g data-part="hut">
        <path d="M24 70 C 30 58 44 60 52 56 C 62 52 72 58 80 56 C 90 53 100 56 108 55 C 118 56 130 58 136 70 C 116 82 44 82 24 70 Z" fill="#EDBB55" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M46 68 C 60 64 100 64 116 68" fill="none" stroke="${C.braun}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
        <path d="M40 64 C 50 60 62 60 70 61" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>
      </g>`,
    champignon: () => `
      <g data-part="stiel">
        <path d="M64 170 C 60 150 64 124 66 104 L 94 104 C 96 124 100 150 96 170 C 88 178 72 178 64 170 Z" fill="#F2ECE1" stroke="${INK}" stroke-width="2.4"/>
        <path d="M64 120 C 72 128 88 128 96 120 C 96 130 90 134 80 134 C 70 134 64 130 64 120 Z" fill="#F7F2E8" stroke="${INK}" stroke-width="1.8"/>
      </g>
      <g data-part="unten">
        <path d="M26 102 C 50 118 110 118 134 102 C 118 112 42 112 26 102 Z" fill="#B98A7E" stroke="${INK}" stroke-width="2"/>
        <path d="M38 106 L 44 111 M50 108 L 54 113 M62 109 L 64 114 M74 110 L 75 114 M86 110 L 85 114 M98 109 L 96 114 M110 108 L 106 113 M122 106 L 116 111" stroke="#7E5A50" stroke-width="1.3"/>
      </g>
      <g data-part="hut">
        <path d="M24 104 C 22 68 48 46 80 46 C 112 46 138 68 136 104 C 112 96 48 96 24 104 Z" fill="#EFE6D6" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M40 76 C 50 60 64 54 78 53" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
        <path d="M108 58 C 122 68 130 82 130 96" fill="none" stroke="${C.sand}" stroke-width="8" stroke-linecap="round" opacity=".8"/>
      </g>`,
    maronenroehrling: () => `
      <g data-part="stiel">
        <path d="M68 176 C 64 150 68 122 70 100 L 92 100 C 94 122 98 150 94 176 C 86 182 76 182 68 176 Z" fill="#B89B6A" stroke="${INK}" stroke-width="2.4"/>
        <path d="M74 112 L 73 168 M82 112 L 82 170 M89 112 L 90 168" stroke="${C.braun}" stroke-width="1.4" stroke-opacity=".5"/>
      </g>
      <g data-part="unten">
        <path d="M22 94 C 50 110 110 110 138 94 C 124 112 36 112 22 94 Z" fill="#D6BE5F" stroke="${INK}" stroke-width="2"/>
        <ellipse cx="104" cy="104" rx="9" ry="4" fill="#6F86A8" opacity=".85"/>
        <g fill="${C.braun}" opacity=".4">${Array.from({ length: 11 }, (_, i) => `<circle cx="${36 + i * 8}" cy="${102 + (i % 2)}" r="1.3"/>`).join('')}</g>
      </g>
      <g data-part="hut">
        <path d="M18 96 C 18 64 46 42 80 42 C 114 42 142 64 142 96 C 120 102 40 102 18 96 Z" fill="#6E4430" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M36 70 C 46 56 60 50 76 49" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
      </g>`
  };
  function shroom(type, opts = {}) {
    const body = (SHROOMS[type] || SHROOMS.steinpilz)();
    return `<svg class="shroom shroom-${type}" viewBox="0 0 160 190" role="img" aria-label="${opts.label || type}">
      <ellipse cx="80" cy="180" rx="56" ry="7" fill="${INK}" opacity=".14"/>
      <g filter="url(#f-paint)">${body}</g></svg>`;
  }

  /* =======================================================================
     AUSWAHLBILDER Mission 1  (viewBox 0 0 160 160)
     ======================================================================= */
  const PICS = {
    pilz: () => `<g transform="translate(8 0) scale(.9)">${SHROOMS.steinpilz()}</g>`,
    schnecke: () => `
      <path d="M18 136 C 30 140 110 142 136 132 C 146 128 148 118 140 112 C 132 108 124 112 120 118 L 64 122 C 46 122 30 126 18 136 Z" fill="${C.salbei}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M126 114 C 128 96 130 86 128 76 M136 114 C 142 98 148 90 150 82" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="128" cy="74" r="4.5" fill="${INK}"/><circle cx="150" cy="80" r="4.5" fill="${INK}"/>
      <circle cx="72" cy="88" r="40" fill="${C.beere}" stroke="${INK}" stroke-width="2.6"/>
      <path d="M72 88 m 0 -6 a 6 6 0 1 1 -6 8 a 14 14 0 1 1 18 -16 a 24 24 0 1 1 -30 26 a 33 33 0 0 1 32 -46" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-opacity=".75"/>
      <path d="M46 66 C 54 56 66 52 76 52" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>`,
    farn: () => `${fern(80, 150, 0.82, 0, C.moos, 9, 170)}${fern(60, 150, 0.6, -24, C.salbei, 8, 160)}${fern(102, 150, 0.6, 22, C.wald, 8, 160)}`,
    eichel: () => `
      <path d="M50 66 C 42 104 56 140 80 144 C 104 140 118 104 110 66 Z" fill="${C.holzHell}" stroke="${INK}" stroke-width="2.6"/>
      <path d="M58 80 C 56 104 64 126 78 134" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>
      <path d="M38 70 C 36 48 56 36 80 36 C 104 36 124 48 122 70 C 104 78 56 78 38 70 Z" fill="${C.braun}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M48 56 l 8 6 l 8 -6 l 8 6 l 8 -6 l 8 6 l 8 -6 l 8 6 M46 66 l 8 -5 l 8 5 l 8 -5 l 8 5 l 8 -5 l 8 5 l 8 -5 l 8 5" fill="none" stroke="${INK}" stroke-width="1.3" stroke-opacity=".5"/>
      <path d="M80 36 C 80 28 84 22 90 18" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`,
    myzel: () => `
      <rect x="10" y="46" width="140" height="104" rx="18" fill="#8A6B52" stroke="${INK}" stroke-width="2.2"/>
      <path d="M10 64 C 50 56 110 70 150 60" stroke="${C.moos}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g fill="none" stroke="#F8F2E4" stroke-width="2" stroke-linecap="round">
        <path d="M80 70 C 70 90 50 96 30 108 M80 70 C 88 94 110 98 132 112 M80 70 C 80 100 76 118 70 138 M56 92 C 50 110 44 122 26 132 M108 98 C 112 114 120 124 136 136 M72 112 C 90 118 98 128 104 142 M40 104 C 46 96 52 90 54 80 M118 106 C 124 96 132 90 140 86"/>
      </g>
      <path d="M74 66 C 74 52 76 42 80 34 C 84 42 86 52 86 66 Z" fill="#E9DCC2" stroke="${INK}" stroke-width="2"/>
      <path d="M58 40 C 58 24 70 14 80 14 C 90 14 102 24 102 40 C 92 44 68 44 58 40 Z" fill="#8B5E3C" stroke="${INK}" stroke-width="2.2"/>`,
    wurzeln: () => `
      <rect x="10" y="46" width="140" height="104" rx="18" fill="#8A6B52" stroke="${INK}" stroke-width="2.2"/>
      <path d="M10 64 C 50 56 110 70 150 60" stroke="${C.moos}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g fill="none" stroke="${C.holzHell}" stroke-linecap="round">
        <path d="M80 66 C 80 92 74 112 62 140" stroke-width="7"/><path d="M80 80 C 96 96 108 108 126 124" stroke-width="5"/><path d="M78 88 C 62 98 46 104 32 118" stroke-width="5"/><path d="M70 116 C 60 122 50 128 42 140" stroke-width="3"/><path d="M106 106 C 112 120 114 130 112 142" stroke-width="3"/>
      </g>
      <path d="M80 66 L 80 40" stroke="${C.tief}" stroke-width="4" stroke-linecap="round"/>
      ${leaf(80, 44, -140, 26, 10, C.moos)}${leaf(80, 40, -40, 28, 10, C.salbei)}${leaf(80, 26, -90, 22, 8, C.moos)}`,
    hut: () => `
      <path d="M22 110 C 18 64 50 36 80 36 C 110 36 142 64 138 110 C 116 120 44 120 22 110 Z" fill="#8B5E3C" stroke="${INK}" stroke-width="2.6"/>
      <path d="M28 108 C 56 124 104 124 132 108 C 120 130 40 130 28 108 Z" fill="#E3D3A0" stroke="${INK}" stroke-width="2"/>
      <path d="M40 72 C 50 54 64 46 80 45" fill="none" stroke="#fff" stroke-opacity=".26" stroke-width="7" stroke-linecap="round"/>`
  };
  function pic(name) {
    return `<svg class="pic pic-${name}" viewBox="0 0 160 160" aria-hidden="true"><g filter="url(#f-paint)">${(PICS[name] || PICS.pilz)()}</g></svg>`;
  }

  /* =======================================================================
     HINWEIS-SYMBOLE (viewBox 0 0 48 48), Strichzeichnungen
     ======================================================================= */
  const HINT_ICONS = {
    notboth: `<path d="M12 30 C 8 22 12 14 18 14 C 22 14 24 18 24 22" fill="none"/><circle cx="15" cy="12" r="2.4"/><path d="M28 34 C 28 24 32 16 40 12 C 40 22 36 30 28 34 Z"/><path d="M8 40 L 40 8"/>`,
    threads: `<path d="M4 18 L 44 18"/><path d="M24 18 C 20 26 12 30 6 36 M24 18 C 28 28 36 30 42 38 M24 18 C 24 28 22 36 20 44 M14 28 C 12 34 10 38 6 42 M34 30 C 36 36 38 40 40 44"/><path d="M20 18 C 20 12 22 8 24 6 C 26 8 28 12 28 18"/>`,
    hat: `<path d="M8 26 C 6 14 16 6 24 6 C 32 6 42 14 40 26 C 32 30 16 30 8 26 Z"/><path d="M19 28 C 18 34 18 40 17 44 L 31 44 C 30 40 30 34 29 28"/>`,
    many: `<path d="M3 30 C 3 22 8 18 12 18 C 16 18 21 22 21 30 Z M10 30 L 10 42 L 14 42 L 14 30"/><path d="M19 22 C 20 14 26 10 30 12 C 34 14 36 18 34 22 Z M26 22 L 26 42 L 30 42 L 30 22"/><path d="M34 34 C 36 28 40 26 44 28 C 46 30 46 34 44 36 Z M39 35 L 39 42 L 42 42 L 42 35"/>`,
    shade: `<path d="M24 6 C 18 16 14 22 14 28 C 14 34 18 38 24 38 C 30 38 34 34 34 28 C 34 22 30 16 24 6 Z"/><path d="M6 44 L 42 44"/><path d="M38 8 L 44 14 M44 8 L 38 14"/>`
  };
  function hintIcon(name) {
    return `<svg class="hint-ico" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${HINT_ICONS[name] || ''}</g></svg>`;
  }

  /* =======================================================================
     UI-SYMBOLE (Toolbar, Wegweiser)
     ======================================================================= */
  const ICONS = {
    back: `<path d="M28 10 L 14 24 L 28 38"/><path d="M15 24 L 38 24"/>`,
    home: `<path d="M8 24 L 24 9 L 40 24"/><path d="M13 21 L 13 39 L 35 39 L 35 21"/><path d="M21 39 L 21 29 L 27 29 L 27 39"/>`,
    soundOn: `<path d="M8 19 L 15 19 L 24 11 L 24 37 L 15 29 L 8 29 Z"/><path d="M30 18 C 33 21 33 27 30 30"/><path d="M35 13 C 41 19 41 29 35 35"/>`,
    soundOff: `<path d="M8 19 L 15 19 L 24 11 L 24 37 L 15 29 L 8 29 Z"/><path d="M31 19 L 41 29 M41 19 L 31 29"/>`,
    key: `<circle cx="16" cy="24" r="8"/><path d="M24 24 L 42 24 M36 24 L 36 31 M41 24 L 41 29"/>`,
    play: `<path d="M16 10 L 38 24 L 16 38 Z"/>`,
    next: `<path d="M12 24 L 34 24"/><path d="M26 14 L 36 24 L 26 34"/>`,
    close: `<path d="M12 12 L 36 36 M36 12 L 12 36"/>`,
    plus: `<path d="M24 10 L 24 38 M10 24 L 38 24"/>`,
    minus: `<path d="M10 24 L 38 24"/>`,
    trash: `<path d="M10 14 L 38 14"/><path d="M19 14 L 19 9 L 29 9 L 29 14"/><path d="M13 14 L 15 40 L 33 40 L 35 14"/>`,
    swap: `<path d="M10 16 L 36 16 M30 10 L 36 16 L 30 22"/><path d="M38 32 L 12 32 M18 26 L 12 32 L 18 38"/>`,
    check: `<path d="M10 25 L 20 35 L 38 13"/>`,
    pen: `<path d="M10 38 L 14 28 L 32 10 L 38 16 L 20 34 Z"/><path d="M28 14 L 34 20"/>`,
    eraser: `<path d="M8 32 L 24 16 L 36 28 L 26 38 L 14 38 Z"/><path d="M18 22 L 30 34"/>`,
    hand: `<path d="M16 40 C 12 34 10 28 10 22 C 10 19 14 19 15 22 L 17 27 L 17 10 C 17 7 21 7 21 10 L 21 23 L 21 7 C 21 4 25 4 25 7 L 25 23 L 25 9 C 25 6 29 6 29 9 L 29 24 L 29 13 C 29 10 33 10 33 13 L 33 30 C 33 36 30 40 26 42 Z"/>`,
    mund: `<path d="M10 26 C 16 20 32 20 38 26 C 32 34 16 34 10 26 Z"/><path d="M8 8 L 40 40"/>`,
    erwachsen: `<circle cx="16" cy="10" r="5"/><path d="M16 15 L 16 32 M8 22 L 24 22 M16 32 L 10 42 M16 32 L 22 42"/><circle cx="35" cy="22" r="4"/><path d="M35 26 L 35 36 M29 30 L 41 30 M35 36 L 31 43 M35 36 L 39 43"/>`,
    stopp: `<path d="M16 40 C 12 34 10 28 10 22 C 10 19 14 19 15 22 L 17 27 L 17 10 C 17 7 21 7 21 10 L 21 23 L 21 7 C 21 4 25 4 25 7 L 25 23 L 25 9 C 25 6 29 6 29 9 L 29 24 L 29 13 C 29 10 33 10 33 13 L 33 30 C 33 36 30 40 26 42 Z"/>`,
    ja: `<path d="M10 25 L 20 35 L 38 13"/>`,
    nein: `<path d="M12 12 L 36 36 M36 12 L 12 36"/>`,
    haende: `<path d="M14 40 C 10 34 10 26 12 20 L 16 12 C 18 10 20 12 19 15 L 18 22 L 26 10 C 28 8 31 10 30 13 L 24 24 L 34 16 C 36 14 39 17 37 19 L 26 32 C 24 38 20 42 14 40 Z"/><path d="M38 30 q 2 4 0 6 q -2 -2 0 -6 M42 20 q 2 4 0 6 q -2 -2 0 -6"/>`,
    lupe: `<circle cx="20" cy="20" r="12"/><path d="M29 29 L 41 41"/>`,
    topf: `<path d="M8 20 L 40 20 L 37 40 L 11 40 Z"/><path d="M4 20 L 44 20 M18 14 C 18 10 30 10 30 14"/>`,
    uhr: `<circle cx="24" cy="24" r="16"/><path d="M24 14 L 24 24 L 31 29"/>`,
    lock: `<rect x="12" y="22" width="24" height="18" rx="4"/><path d="M17 22 L 17 16 C 17 8 31 8 31 16 L 31 22"/>`,
    download: `<path d="M24 8 L 24 32 M14 22 L 24 32 L 34 22"/><path d="M10 40 L 38 40"/>`,
    copy: `<rect x="16" y="16" width="22" height="24" rx="3"/><path d="M10 32 L 10 8 L 30 8"/>`
  };
  function icon(name, cls = '') {
    return `<svg class="ico ${cls}" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</g></svg>`;
  }

  /* Illustrierte Wegweiser-Symbole */
  const SIGN_ICONS = {
    abenteuer: `<path d="M10 52 C 22 44 18 32 32 28 C 44 24 40 14 52 10" fill="none" stroke="${C.creme}" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 8"/>
      <path d="M48 28 L 48 6 L 60 11 L 48 16" fill="${C.rost}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M48 6 L 48 30" stroke="${INK}" stroke-width="2.4"/>
      <circle cx="12" cy="52" r="5" fill="${C.honig}" stroke="${INK}" stroke-width="2"/>`,
    lexikon: `<g transform="translate(4 4) scale(.33)">${SHROOMS.fliegenpilz()}</g>
      <circle cx="44" cy="36" r="13" fill="${C.creme}" fill-opacity=".55" stroke="${INK}" stroke-width="3"/><path d="M53 46 L 62 56" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    forscherbuch: `<path d="M8 14 C 18 10 26 12 32 18 C 38 12 46 10 56 14 L 56 54 C 46 50 38 52 32 58 C 26 52 18 50 8 54 Z" fill="${C.creme}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M32 18 L 32 58" stroke="${INK}" stroke-width="2"/><path d="M14 24 L 26 26 M14 32 L 26 34 M14 40 L 24 42" stroke="${C.braun}" stroke-width="2" stroke-linecap="round"/>
      <g transform="translate(36 22) scale(.14)">${SHROOMS.champignon()}</g>`,
    meinwald: `<path d="M8 54 C 20 46 44 46 56 54 Z" fill="${C.moos}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M34 50 L 34 26" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="M26 26 L 42 26 L 40 14 L 28 14 Z" fill="${C.honig}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="34" cy="20" r="3.4" fill="#FFF4CF"/><path d="M28 14 L 34 8 L 40 14" fill="${C.braun}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      ${fern(16, 52, 0.18, -12, C.salbei, 6, 150)}${tinyShroom(48, 52, 0.36, C.rost)}`
  };
  function signIcon(name) {
    return `<svg class="sign-ico" viewBox="0 0 64 64" aria-hidden="true"><g filter="url(#f-wob)">${SIGN_ICONS[name]}</g></svg>`;
  }

  /* Planke hinter einem Wegweiser-Button (wird gestreckt) */
  function plank(color, dir = 'right') {
    const d = dir === 'right'
      ? 'M6 10 C 60 4 200 6 262 8 L 294 40 L 262 74 C 200 76 60 78 8 72 C 2 52 2 28 6 10 Z'
      : 'M294 10 C 240 4 100 6 38 8 L 6 40 L 38 74 C 100 76 240 78 292 72 C 298 52 298 28 294 10 Z';
    return `<svg class="plank-bg" viewBox="0 0 300 82" preserveAspectRatio="none" aria-hidden="true">
      <g filter="url(#f-paint)"><path d="${d}" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
      <path d="M30 26 C 90 22 170 30 240 24 M40 54 C 110 58 180 50 250 56" fill="none" stroke="${INK}" stroke-opacity=".16" stroke-width="2.5" vector-effect="non-scaling-stroke"/></g></svg>`;
  }

  /* Waldlicht (Belohnungssymbol) */
  function lightOrb(size = 28) {
    return `<svg class="orb" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="19.5" fill="url(#g-orb)"/><circle cx="20" cy="20" r="10.5" fill="${C.honig}" stroke="${C.ink}" stroke-width="2"/><circle cx="17" cy="17" r="3.6" fill="#FFF8DE"/></svg>`;
  }

  /* =======================================================================
     PROFIL-SYMBOLE (anonyme Forscherprofile) viewBox 0 0 64 64
     ======================================================================= */
  const SYMBOLS = {
    eichel: `<path d="M20 28 C 16 44 22 56 32 58 C 42 56 48 44 44 28 Z" fill="${C.holzHell}" stroke="${INK}" stroke-width="2"/><path d="M14 30 C 12 18 22 12 32 12 C 42 12 52 18 50 30 C 42 34 22 34 14 30 Z" fill="${C.braun}" stroke="${INK}" stroke-width="2"/><path d="M32 12 C 32 8 34 5 37 4" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
    blatt: `<g transform="translate(10 52) rotate(-50)">${leaf(0, 0, 0, 52, 18, C.moos, 2)}</g>`,
    feder: `<path d="M14 54 C 20 34 34 14 52 8 C 50 28 36 46 14 54 Z" fill="${C.creme}" stroke="${INK}" stroke-width="2"/><path d="M12 56 C 24 40 36 26 48 14" stroke="${INK}" stroke-width="1.8" fill="none"/><path d="M26 40 L 22 34 M32 32 L 28 26 M38 26 L 36 20 M30 42 L 36 40 M36 34 L 42 32" stroke="${C.braun}" stroke-width="1.4"/>`,
    beere: `<circle cx="22" cy="40" r="11" fill="${C.beere}" stroke="${INK}" stroke-width="2"/><circle cx="40" cy="42" r="11" fill="${C.beere}" stroke="${INK}" stroke-width="2"/><circle cx="31" cy="26" r="10" fill="${C.beere}" stroke="${INK}" stroke-width="2"/><circle cx="19" cy="37" r="2.4" fill="#fff" opacity=".5"/><path d="M31 16 C 31 10 36 6 42 6" stroke="${C.tief}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${leaf(36, 10, -10, 16, 6, C.moos, 1.6)}`,
    schneckenhaus: `<circle cx="32" cy="34" r="22" fill="${C.sand}" stroke="${INK}" stroke-width="2"/><path d="M32 34 m 0 -4 a 4 4 0 1 1 -4 5 a 9 9 0 1 1 12 -10 a 15 15 0 1 1 -20 16 a 20 20 0 0 1 20 -27" fill="none" stroke="${C.braun}" stroke-width="2" stroke-linecap="round"/>`,
    zapfen: `<path d="M32 6 C 46 16 50 36 42 52 C 38 58 26 58 22 52 C 14 36 18 16 32 6 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2"/><path d="M22 22 L 32 28 L 42 22 M20 32 L 32 38 L 44 32 M22 42 L 32 48 L 42 42" fill="none" stroke="${INK}" stroke-width="1.6" stroke-opacity=".6"/>`
  };
  function symbol(name, bg) {
    return `<svg class="sym" viewBox="0 0 64 64" aria-hidden="true">${bg ? `<circle cx="32" cy="32" r="31" fill="${bg}"/>` : ''}<g filter="url(#f-wob)">${SYMBOLS[name] || ''}</g></svg>`;
  }

  /* =======================================================================
     GARTEN-ELEMENTE  viewBox 0 0 120 120  (Fuß bei y≈112)
     ======================================================================= */
  const GARDEN = {
    blume: () => `<path d="M60 112 C 58 90 60 70 64 50" stroke="${C.tief}" stroke-width="3" fill="none"/>${leaf(60, 96, -150, 26, 9, C.moos)}${leaf(61, 86, -30, 24, 8, C.salbei)}
      <path d="M64 50 C 52 50 50 34 58 28 C 62 34 66 34 70 28 C 78 34 76 50 64 50 Z" fill="${C.beere}" stroke="${INK}" stroke-width="2"/>
      <path d="M78 72 C 70 70 70 60 74 56 C 76 60 80 60 82 56 C 86 60 86 70 78 72 Z" fill="${C.blau}" stroke="${INK}" stroke-width="2"/><path d="M78 72 Q 72 92 62 104" stroke="${C.tief}" stroke-width="2.4" fill="none"/>`,
    farn: () => `${fern(60, 114, 0.56, -4, C.moos, 9, 170)}${fern(46, 114, 0.44, -30, C.salbei, 8, 160)}${fern(74, 114, 0.44, 28, C.wald, 8, 160)}`,
    stein: () => `${stone(54, 108, 40, 26)}${stone(88, 110, 18, 12, '#B8B2A8')}<path d="M30 106 C 40 100 56 102 62 108" stroke="${C.moos}" stroke-width="6" stroke-linecap="round" fill="none"/>`,
    stumpf: () => `<path d="M26 112 C 30 96 28 66 32 46 L 88 46 C 92 66 90 96 94 112 C 104 114 108 116 100 118 L 20 118 C 12 116 16 114 26 112 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.4"/>
      <ellipse cx="60" cy="46" rx="28" ry="10" fill="${C.holzHell}" stroke="${INK}" stroke-width="2.2"/><ellipse cx="60" cy="46" rx="16" ry="5.5" fill="none" stroke="${C.braun}" stroke-width="1.6"/><ellipse cx="60" cy="46" rx="6" ry="2" fill="none" stroke="${C.braun}" stroke-width="1.4"/>
      <path d="M44 60 L 42 100 M62 62 L 62 108 M78 58 L 80 102" stroke="${INK}" stroke-opacity=".25" stroke-width="2"/>${tinyShroom(88, 70, 0.32, C.honig)}${tinyShroom(96, 76, 0.24, C.honig)}`,
    laterne: () => `<path d="M60 112 L 60 40" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M60 40 C 60 30 74 26 80 30" stroke="${INK}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="54" r="22" fill="url(#g-orb)" class="glow-anim"/>
      <path d="M70 44 L 90 44 L 88 66 L 72 66 Z" fill="${C.honig}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="80" cy="55" r="5" fill="#FFF6D8"/><path d="M70 44 L 80 34 L 90 44" fill="${C.braun}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
      ${grass(60, 114, 0.6, C.moos, rng(4))}`,
    haus: () => `<path d="M34 112 C 32 96 34 78 38 66 L 82 66 C 86 78 88 96 86 112 Z" fill="#EEE3CF" stroke="${INK}" stroke-width="2.4"/>
      <path d="M52 112 L 52 92 C 52 84 68 84 68 92 L 68 112 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2"/><circle cx="64" cy="100" r="1.6" fill="${INK}"/>
      <circle cx="74" cy="80" r="5" fill="${C.honig}" stroke="${INK}" stroke-width="1.8"/>
      <path d="M12 70 C 10 38 34 20 60 20 C 86 20 110 38 108 70 C 84 76 36 76 12 70 Z" fill="${C.rost}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="40" cy="44" rx="7" ry="5" fill="${C.creme}"/><ellipse cx="66" cy="32" rx="6" ry="4" fill="${C.creme}"/><ellipse cx="86" cy="52" rx="7" ry="5" fill="${C.creme}"/><ellipse cx="56" cy="58" rx="4" ry="3" fill="${C.creme}"/>
      <path d="M92 26 L 92 12 L 100 12 L 100 32" fill="${C.steinDunkel}" stroke="${INK}" stroke-width="2"/>`
  };
  function gardenItem(name) {
    return `<svg class="g-item g-${name}" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="114" rx="36" ry="5" fill="${INK}" opacity=".14"/><g filter="url(#f-paint)">${(GARDEN[name] || GARDEN.stein)()}</g></svg>`;
  }

  /* =======================================================================
     SZENEN
     ======================================================================= */

  function canopy(x, y, r, fill, rnd, n = 5) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd();
      const rr = r * (0.55 + rnd() * 0.35);
      s += `<circle cx="${f1(x + Math.cos(a) * r * 0.55)}" cy="${f1(y + Math.sin(a) * r * 0.4)}" r="${f1(rr)}"/>`;
    }
    return `<g fill="${fill}">${s}<circle cx="${x}" cy="${y}" r="${f1(r * 0.7)}"/></g>`;
  }

  function trunk(x, w, top, bottom, fill, lines = true) {
    const d = `M${x - w / 2} ${bottom} C ${x - w * 0.46} ${bottom - 200} ${x - w * 0.42} ${top + 100} ${x - w * 0.4} ${top} L ${x + w * 0.4} ${top} C ${x + w * 0.42} ${top + 100} ${x + w * 0.46} ${bottom - 200} ${x + w / 2} ${bottom} Z`;
    let l = '';
    if (lines) l = `<path d="M${x - w * 0.15} ${bottom - 30} C ${x - w * 0.2} ${bottom - 200} ${x - w * 0.1} ${top + 140} ${x - w * 0.14} ${top + 30} M${x + w * 0.18} ${bottom - 60} C ${x + w * 0.22} ${bottom - 240} ${x + w * 0.12} ${top + 160} ${x + w * 0.16} ${top + 60}" fill="none" stroke="${INK}" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>`;
    return `<path d="${d}" fill="${fill}"/>${l}`;
  }

  /* ---- Startbildschirm ------------------------------------------------- */
  function homeScene(progress = 0) {
    const r = rng(12);
    const farX = [70, 250, 430, 560, 1060, 1200, 1360, 1530];
    const far = farX.map((x, i) => trunk(x, 34 + (i % 3) * 10, -20, 720, '#C7CBB1', false)).join('');
    const farCan = farX.map((x, i) => canopy(x, 40 + (i % 2) * 30, 120, '#C2CCAE', r, 4)).join('');
    const midX = [130, 330, 1270, 1480];
    const mid = midX.map((x, i) => trunk(x, 70 + (i % 2) * 20, -20, 790, '#8E7A63')).join('');
    const midCan = midX.map((x) => canopy(x, 20, 170, '#7E9572', r, 5)).join('');
    const lit = progress > 0;
    const lanterns = [];
    // je abgeschlossenem Kapitel erscheint ein Licht am Weg
    const spots = [[690, 900], [915, 880], [740, 820], [860, 800], [760, 770], [840, 760]];
    for (let i = 0; i < Math.min(progress, 6); i++) {
      const [x, y] = spots[i];
      lanterns.push(`<g transform="translate(${x} ${y})"><circle r="26" fill="url(#g-orb)" class="glow-anim"/><circle r="6" fill="${C.honig}" stroke="${INK}" stroke-width="1.6"/></g>`);
    }
    return `<svg class="scene scene-home" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9E3C9"/><stop offset=".6" stop-color="#F3ECDA"/><stop offset="1" stop-color="#EDE3CC"/></linearGradient>
        <radialGradient id="hs-sun" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#F6E3A6" stop-opacity=".85"/><stop offset="1" stop-color="#F6E3A6" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#hs-sky)"/>
      <ellipse cx="800" cy="380" rx="620" ry="420" fill="url(#hs-sun)"/>
      <g filter="url(#f-wc)">${far}${farCan}</g>
      <g filter="url(#f-soft)" opacity=".5">
        <path d="M620 0 L 700 0 L 980 720 L 820 720 Z" fill="#FBEFC4"/>
        <path d="M900 0 L 940 0 L 1120 700 L 1030 700 Z" fill="#FBEFC4" opacity=".7"/>
        <path d="M440 0 L 480 0 L 640 700 L 560 700 Z" fill="#FBEFC4" opacity=".6"/>
      </g>
      <g filter="url(#f-wc)">
        <path d="M0 700 C 240 640 480 660 700 690 C 920 660 1200 630 1600 680 L 1600 1000 L 0 1000 Z" fill="#B9C5A2"/>
        ${mid}${midCan}
        <path d="M0 760 C 300 720 520 740 800 752 C 1100 736 1300 720 1600 744 L 1600 1000 L 0 1000 Z" fill="#9DAF86"/>
      </g>
      <!-- großer alter Baum -->
      <g filter="url(#f-paint)">
        <path d="M680 760 C 696 640 714 480 724 300 L 876 300 C 886 480 904 640 920 760 C 960 772 1000 780 1030 792 C 980 800 900 790 860 784 C 830 796 770 796 740 784 C 700 790 620 800 570 792 C 600 780 640 772 680 760 Z" fill="${C.braun}" stroke="${INK}" stroke-width="3"/>
        <path d="M742 740 C 732 600 746 460 752 330 M850 740 C 860 600 852 460 848 330 M800 600 C 796 520 804 420 800 340" fill="none" stroke="${INK}" stroke-opacity=".22" stroke-width="5" stroke-linecap="round"/>
        <path d="M880 470 C 900 440 940 430 960 446" fill="none" stroke="${INK}" stroke-width="3"/>
        ${canopy(800, 150, 330, C.wald, rng(3), 7)}
        ${canopy(640, 230, 170, '#5E7B5F', rng(8), 5)}${canopy(970, 220, 180, '#5E7B5F', rng(9), 5)}
        <g fill="${C.salbei}" opacity=".45">${canopy(760, 90, 140, C.salbei, rng(21), 4)}</g>
        <!-- runde Tür -->
        <path d="M748 770 L 748 668 C 748 608 852 608 852 668 L 852 770 Z" fill="#4E392B" stroke="${INK}" stroke-width="3"/>
        <path d="M760 770 L 760 670 C 760 624 840 624 840 670 L 840 770 Z" fill="#A9774E" stroke="${INK}" stroke-width="2.4"/>
        <path d="M787 632 L 787 770 M813 632 L 813 770" stroke="${INK}" stroke-opacity=".3" stroke-width="2.4"/>
        <circle cx="800" cy="672" r="17" fill="${lit ? '#FBE29A' : '#D9C38A'}" stroke="${INK}" stroke-width="2.6"/>
        <path d="M800 655 L 800 689 M783 672 L 817 672" stroke="${INK}" stroke-width="2"/>
        <circle cx="828" cy="716" r="5" fill="${C.honig}" stroke="${INK}" stroke-width="2"/>
        <path d="M734 776 C 760 770 840 770 866 776" stroke="${C.steinDunkel}" stroke-width="10" stroke-linecap="round"/>
      </g>
      ${lit ? `<circle cx="800" cy="672" r="60" fill="url(#g-orb)" class="glow-anim"/>` : ''}
      <!-- Weg -->
      <g filter="url(#f-wc)">
        <path d="M470 1000 C 560 950 700 930 760 880 C 800 846 784 806 790 782 L 812 782 C 820 812 830 846 880 886 C 950 940 1080 960 1180 1000 Z" fill="#E4D2B0"/>
        <path d="M560 990 C 640 954 720 930 770 892" fill="none" stroke="${C.sand}" stroke-width="10" stroke-linecap="round"/>
      </g>
      <g filter="url(#f-paint)">
        ${stone(740, 960, 36, 14, '#CFC6B6')}${stone(860, 912, 28, 11, '#CFC6B6')}${stone(790, 850, 20, 8, '#CFC6B6')}
      </g>
      ${lanterns.join('')}
      <!-- Vordergrund -->
      <g filter="url(#f-paint)">
        <path d="M-20 1010 C -10 900 120 860 240 880 C 340 840 440 880 470 940 C 500 960 520 990 520 1010 Z" fill="${C.moos}" stroke="${INK}" stroke-width="3"/>
        <path d="M1120 1010 C 1160 920 1260 880 1360 900 C 1450 860 1580 880 1620 930 L 1620 1010 Z" fill="${C.moos}" stroke="${INK}" stroke-width="3"/>
        ${fern(60, 960, 1.0, -18, C.wald)}${fern(150, 990, 1.15, 8, '#5E7B5F')}${fern(300, 960, 0.8, 26, C.salbei)}
        ${fern(1480, 970, 1.1, 14, C.wald)}${fern(1560, 990, 0.9, 30, '#5E7B5F')}${fern(1330, 960, 0.75, -20, C.salbei)}
        ${tinyShroom(390, 935, 1.1, C.rost)}${tinyShroom(430, 950, 0.75, C.rost, -1)}
        ${tinyShroom(1240, 930, 0.9, '#8B5E3C')}${tinyShroom(1200, 950, 0.6, '#8B5E3C', -1)}
        ${grass(250, 1000, 1, C.tief, rng(5))}${grass(1400, 1000, 1, C.tief, rng(6))}${grass(560, 1000, 0.8, C.wald, rng(7))}
      </g>
    </svg>`;
  }

  /* ---- Waldkarte -------------------------------------------------------- */
  // Knotenpositionen: Querformat und Hochformat
  // Wissenswand: Startpunkt des Weges, vor Kapitel 1
  const WALL_POS = { land: [150, 500], port: [740, 1488] };
  const MAP_LAYOUT = {
    land: { w: 1600, h: 1000, nodes: [[230, 770], [560, 590], [880, 770], [1170, 560], [830, 300], [1360, 230]] },
    port: { w: 1000, h: 1600, nodes: [[270, 1410], [720, 1190], [300, 950], [700, 720], [290, 490], [660, 250]] }
  };

  function smoothPath(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  function segPath(a, b, prev, next) { return smoothPath([a, b].map((p) => p)).replace(/^/, ''); }

  const NODE_ART = {
    1: () => `<g>${stone(-58, 34, 22, 14)}${stone(58, 36, 24, 14)}
      <path d="M-56 34 L -56 -20 C -56 -78 56 -78 56 -20 L 56 34 L 34 34 L 34 -18 C 34 -50 -34 -50 -34 -18 L -34 34 Z" fill="${C.stein}" stroke="${INK}" stroke-width="3"/>
      <path d="M-34 34 L -34 -18 C -34 -50 34 -50 34 -18 L 34 34 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/><path d="M0 -50 L 0 34" stroke="${INK}" stroke-width="2.4"/>
      <path d="M-50 -10 L -40 -6 M-50 14 L -40 18 M40 -4 L 50 -8 M40 20 L 50 18 M-30 -48 L -24 -40 M24 -40 L 30 -48" stroke="${INK}" stroke-opacity=".5" stroke-width="2.4"/>
      ${leaf(-56, -30, -150, 30, 10, C.moos)}${leaf(52, -36, -40, 26, 9, C.moos)}</g>`,
    2: () => `<g><path d="M-62 40 C -58 10 -60 -20 -56 -40 L 56 -40 C 60 -20 58 10 62 40 Z" fill="${C.holz}" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="0" cy="-40" rx="56" ry="16" fill="${C.holzHell}" stroke="${INK}" stroke-width="2.6"/><ellipse cx="0" cy="-40" rx="32" ry="9" fill="none" stroke="${C.braun}" stroke-width="2"/>
      <path d="M-18 40 L -18 6 C -18 -10 18 -10 18 6 L 18 40 Z" fill="#4E392B" stroke="${INK}" stroke-width="2.4"/>
      <circle cx="-38" cy="0" r="10" fill="${C.honig}" stroke="${INK}" stroke-width="2.2"/><circle cx="38" cy="0" r="10" fill="${C.honig}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M30 -56 L 30 -80 L 40 -80 L 40 -54" fill="${C.steinDunkel}" stroke="${INK}" stroke-width="2.4"/>${tinyShroom(-60, 44, 0.6, '#8B5E3C')}</g>`,
    3: () => `<g>${[[-46, 30, 0.95, C.rost], [10, 36, 1.2, '#8B5E3C'], [56, 26, 0.8, C.honig], [-14, -6, 0.7, C.beere]].map(([x, y, s, c]) => `<g transform="translate(${x} ${y}) scale(${s})">
        <path d="M-14 0 C -15 -14 -13 -26 -12 -32 L 12 -32 C 13 -26 15 -14 14 0 Z" fill="#EEE3CF" stroke="${INK}" stroke-width="2.6"/><path d="M-5 0 L -5 -12 C -5 -18 5 -18 5 -12 L 5 0 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2"/>
        <path d="M-36 -30 C -36 -60 -18 -74 0 -74 C 18 -74 36 -60 36 -30 C 18 -36 -18 -36 -36 -30 Z" fill="${c}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>
        <ellipse cx="-14" cy="-52" rx="5" ry="3.5" fill="${C.creme}" opacity=".85"/><ellipse cx="10" cy="-60" rx="4" ry="3" fill="${C.creme}" opacity=".85"/></g>`).join('')}</g>`,
    4: () => `<g>${[[-50, 40, 1], [0, 30, 1.25], [52, 42, 0.9]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 0 L -6 -50 L 6 -50 L 8 0 Z" fill="${C.braun}" stroke="${INK}" stroke-width="2.4"/>
        <path d="M0 -110 C 24 -96 30 -70 26 -50 C 10 -42 -10 -42 -26 -50 C -30 -70 -24 -96 0 -110 Z" fill="${C.tief}" stroke="${INK}" stroke-width="2.6"/></g>`).join('')}
      <path d="M-80 36 C -50 20 -20 30 0 24 C 30 16 60 30 84 22" stroke="#F4F1EA" stroke-width="18" stroke-linecap="round" fill="none" opacity=".8"/>
      <path d="M-70 0 C -40 -14 -10 -6 10 -12 C 40 -20 64 -8 80 -14" stroke="#F4F1EA" stroke-width="12" stroke-linecap="round" fill="none" opacity=".6"/>
      ${tinyShroom(-20, 52, 0.55, C.rot)}${tinyShroom(24, 54, 0.5, '#8B5E3C', -1)}</g>`,
    5: () => `<g><path d="M-58 44 L -58 -18 L 0 -66 L 58 -18 L 58 44 Z" fill="#EEE3CF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-70 -14 L 0 -76 L 70 -14" fill="none" stroke="${C.wald}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0" cy="-18" r="18" fill="${C.blau}" stroke="${INK}" stroke-width="2.6"/><path d="M0 -36 L 0 0 M-18 -18 L 18 -18" stroke="${INK}" stroke-width="2"/>
      <path d="M-40 44 L -40 14 L -16 14 L -16 44" fill="${C.holz}" stroke="${INK}" stroke-width="2.4"/>
      <path d="M18 18 L 18 6 L 30 6 L 30 18 C 40 22 40 40 24 42 C 8 40 8 22 18 18 Z" fill="#DCE6E0" fill-opacity=".9" stroke="${INK}" stroke-width="2.2"/><path d="M14 32 C 20 28 28 34 34 30" stroke="${C.moos}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
    6: () => `<g><path d="M-80 -40 C -40 -6 40 -6 80 -40" fill="none" stroke="${INK}" stroke-width="2.4"/>
      ${[-60, -30, 0, 30, 60].map((x, i) => `<path d="M${x - 9} ${-26 + Math.abs(x) * 0.18} L ${x + 9} ${-26 + Math.abs(x) * 0.18} L ${x} ${-6 + Math.abs(x) * 0.18} Z" fill="${[C.rost, C.honig, C.beere, C.salbei, C.rost][i]}" stroke="${INK}" stroke-width="2"/>`).join('')}
      <g transform="translate(0 46) scale(1.3)"><path d="M-10 0 C -11 -14 -9 -24 -8 -30 L 8 -30 C 9 -24 11 -14 10 0 Z" fill="#EEE3CF" stroke="${INK}" stroke-width="2.2"/>
      <path d="M-36 -28 C -36 -56 -18 -68 0 -68 C 18 -68 36 -56 36 -28 C 18 -34 -18 -34 -36 -28 Z" fill="${C.rost}" stroke="${INK}" stroke-width="2.4"/><ellipse cx="-14" cy="-48" rx="5" ry="3.5" fill="${C.creme}"/><ellipse cx="12" cy="-54" rx="5" ry="3.5" fill="${C.creme}"/></g>
      <path d="M-64 46 L -64 6 M64 46 L 64 6" stroke="${C.braun}" stroke-width="5" stroke-linecap="round"/><circle cx="-64" cy="2" r="9" fill="${C.honig}" stroke="${INK}" stroke-width="2"/><circle cx="64" cy="2" r="9" fill="${C.honig}" stroke="${INK}" stroke-width="2"/></g>`
  };

  function mapScene(layoutKey, chapters, status) {
    const L = MAP_LAYOUT[layoutKey];
    const nodes = L.nodes;
    const r = rng(layoutKey === 'land' ? 44 : 77);
    const fullPts = [WALL_POS[layoutKey], ...nodes];
    // Baumgruppen streuen, Abstand zu Weg/Knoten halten
    const samples = [];
    for (let i = 0; i < fullPts.length - 1; i++) for (let t = 0; t <= 1; t += 0.1) samples.push([fullPts[i][0] + (fullPts[i + 1][0] - fullPts[i][0]) * t, fullPts[i][1] + (fullPts[i + 1][1] - fullPts[i][1]) * t]);
    const trees = [];
    const cols = [C.wald, C.moos, '#5E7B5F', C.salbei, C.tief];
    for (let y = -40; y < L.h + 60; y += 74) {
      for (let x = -40; x < L.w + 60; x += 82) {
        const tx = x + (r() - 0.5) * 60, ty = y + (r() - 0.5) * 50;
        const dmin = Math.min(...samples.map((p) => Math.hypot(p[0] - tx, p[1] - ty)));
        const dnode = Math.min(...[...nodes, WALL_POS[layoutKey]].map((p) => Math.hypot(p[0] - tx, p[1] - (ty + 30))));
        if (dmin < 95 || dnode < 175) continue;
        if (r() < 0.55) continue;
        trees.push([tx, ty, 26 + r() * 22, cols[Math.floor(r() * cols.length)]]);
      }
    }
    trees.sort((a, b) => a[1] - b[1]);
    const treeSvg = trees.map(([x, y, s, c]) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-4 0 L -3 ${f1(-s * 0.6)} L 3 ${f1(-s * 0.6)} L 4 0 Z" fill="${C.braun}"/><g stroke="${INK}" stroke-width="1.6" stroke-opacity=".55">${canopy(0, -s * 0.95, s, c, r, 4)}</g></g>`).join('');

    // Wegsegmente: Status
    let path = '';
    const base = smoothPath(fullPts);
    path += `<path d="${base}" fill="none" stroke="#C9B48E" stroke-width="46" stroke-linecap="round" stroke-linejoin="round"/>`;
    path += `<path d="${base}" fill="none" stroke="#EFE4CB" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>`;
    // beleuchtete Teilstrecke bis zum letzten offenen Knoten
    const lastOpen = Math.max(0, ...chapters.map((c, i) => (status[i] !== 'locked' ? i : 0)));
    const litPts = fullPts.slice(0, lastOpen + 2);
    if (litPts.length > 1) path += `<path d="${smoothPath(litPts)}" fill="none" stroke="${C.honig}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 18" opacity=".95"/>`;
    // Nebel über gesperrten Bereichen
    let fog = '';
    chapters.forEach((c, i) => {
      if (status[i] === 'locked') {
        const [x, y] = nodes[i];
        fog += `<ellipse cx="${x}" cy="${y - 10}" rx="150" ry="100" fill="#F1EDE3" opacity=".45"/>`;
      }
    });

    const nodeSvg = chapters.map((c, i) => {
      const [x, y] = nodes[i];
      const st = status[i];
      const lines = c.mapLabel;
      const fs = layoutKey === 'land' ? 30 : 34;
      const lh = fs * 1.12;
      const lw = Math.max(...lines.map((l) => l.length)) * fs * 0.52 + 44;
      const lhTot = lines.length * lh + 18;
      const labelY = 74;
      const glow = st === 'done' ? `<circle r="120" fill="url(#g-orb)" class="glow-anim"/>` : st === 'open' ? `<circle r="104" fill="none" stroke="${C.honig}" stroke-width="6" stroke-dasharray="8 14" class="ring-anim"/>` : '';
      const extra = st === 'done' ? `<g>${[[-86, 44], [90, 40], [-70, -50], [80, -60]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="${C.honig}" stroke="${INK}" stroke-width="1.6"/>`).join('')}${leaf(-92, 60, -120, 30, 10, C.moos)}${leaf(96, 58, -60, 30, 10, C.moos)}${GARDEN_MINI_FLOWERS}</g>` : '';
      const badge = st === 'locked'
        ? `<g transform="translate(70 -64)"><circle r="20" fill="${C.creme}" stroke="${INK}" stroke-width="2.4"/><g transform="translate(-12 -12) scale(.5)" fill="none" stroke="${C.braun}" stroke-width="4" stroke-linecap="round">${ICONS.lock}</g></g>`
        : st === 'done' ? `<g transform="translate(70 -64)"><circle r="20" fill="${C.honig}" stroke="${INK}" stroke-width="2.4"/><g transform="translate(-12 -12) scale(.5)" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${ICONS.check}</g></g>` : '';
      return `<g class="map-node is-${st}" data-ch="${c.id}" role="button" tabindex="0" aria-label="${c.title}${st === 'locked' ? ' – noch im Nebel' : st === 'done' ? ' – geschafft' : ''}" transform="translate(${x} ${y})">
        <circle r="110" fill="transparent"/>
        ${glow}
        <g class="node-art" ${st === 'locked' ? 'filter="url(#f-grey)" opacity=".8"' : 'filter="url(#f-paint)"'}>${NODE_ART[c.id]()}</g>
        ${extra}${badge}
        <g transform="translate(0 ${labelY})">
          <path d="M${-lw / 2} 6 C ${-lw / 4} 0 ${lw / 4} 2 ${lw / 2} 6 L ${lw / 2 - 4} ${lhTot} C ${lw / 4} ${lhTot + 4} ${-lw / 4} ${lhTot + 2} ${-lw / 2 + 4} ${lhTot} Z" fill="${st === 'locked' ? '#E7E2D6' : C.creme}" stroke="${INK}" stroke-width="2.4" filter="url(#f-wob)"/>
          ${lines.map((l, k) => `<text x="0" y="${18 + fs * 0.9 + k * lh}" text-anchor="middle" font-size="${fs}" class="map-label" fill="${st === 'locked' ? '#8D857B' : INK}">${l}</text>`).join('')}
        </g>
      </g>`;
    }).join('');

    return `<svg class="scene scene-map" viewBox="0 0 ${L.w} ${L.h}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Waldkarte">
      <rect x="-400" y="-400" width="${L.w + 800}" height="${L.h + 800}" fill="#E8DCC2"/>
      <g filter="url(#f-wc)">
        <path d="M0 0 L ${L.w} 0 L ${L.w} ${L.h} L 0 ${L.h} Z" fill="#E6D9BC"/>
        ${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${f1(r() * L.w)}" cy="${f1(r() * L.h)}" rx="${f1(160 + r() * 220)}" ry="${f1(110 + r() * 160)}" fill="${[C.salbei, '#CBD2B2', '#D7CDAE'][i % 3]}" opacity=".55"/>`).join('')}
        ${layoutKey === 'land'
          ? `<path d="M1600 760 C 1480 740 1420 820 1440 900 C 1460 960 1540 980 1600 1000 Z" fill="${C.blau}" opacity=".55"/>`
          : `<path d="M0 1120 C 80 1100 140 1160 120 1240 C 100 1300 30 1320 0 1330 Z" fill="${C.blau}" opacity=".55"/>`}
      </g>
      <g filter="url(#f-wc)">${path}</g>
      <g filter="url(#f-paint)">${treeSvg}</g>
      <g filter="url(#f-soft)">${fog}</g>
      ${nodeSvg}
    </svg>`;
  }
  const GARDEN_MINI_FLOWERS = `<g transform="translate(-30 70)"><circle r="5" fill="${C.beere}" stroke="${INK}" stroke-width="1.4"/></g><g transform="translate(40 74)"><circle r="5" fill="${C.blau}" stroke="${INK}" stroke-width="1.4"/></g>`;

  /* ---- Mission 1: Waldtor ---------------------------------------------- */
  // Eine gemeinsame Geometrie für Bogen, Pfeiler, Öffnung und Türflügel,
  // damit die Türen die Öffnung genau ausfüllen.
  const GATE = { cx: 500, base: 470, irx: 182, iry: 210, srx: 212, sry: 240, ground: 690 };
  const gateAt = (deg, rx = GATE.srx, ry = GATE.sry) => [GATE.cx + Math.cos((deg * Math.PI) / 180) * rx, GATE.base - Math.sin((deg * Math.PI) / 180) * ry];
  const GATE_STONES = [165, 125, 90, 55, 15].map((d) => gateAt(d).map((v) => Math.round(v)));

  function gateScene() {
    const r = rng(31);
    const G = GATE;
    const L = G.cx - G.irx, R = G.cx + G.irx, T = G.base - G.iry; // Öffnung: 318 … 682, Scheitel 260
    // Bogensteine entlang einer Ellipse, tangential gedreht
    const archStones = [];
    const N = 16;
    for (let i = 0; i <= N; i++) {
      const deg = 180 - (i / N) * 180;
      const [x, y] = gateAt(deg);
      const a = (deg * Math.PI) / 180;
      const tang = (Math.atan2(-Math.cos(a) * G.sry, -Math.sin(a) * G.srx) * 180) / Math.PI;
      archStones.push(`<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(tang)})"><path d="M-23 -31 C -8 -34 10 -33 23 -30 L 22 31 C 8 34 -10 34 -22 31 Z" fill="${[C.stein, '#B5AFA5', '#9F998F'][i % 3]}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M-14 -22 L 12 -24" stroke="#fff" stroke-opacity=".22" stroke-width="3" stroke-linecap="round"/></g>`);
    }
    // Pfeiler: genau so breit wie der Bogen (srx ± 30)
    const pillars = [];
    const pw = 60, h = (G.ground - G.base) / 3;
    for (let k = 0; k < 3; k++) {
      const y = G.base + k * h;
      const jit = () => f1((r() - 0.5) * 3);
      pillars.push(`<path d="M${G.cx - G.srx - 30 + +jit()} ${f1(y + 1)} L ${G.cx - G.srx + 30} ${f1(y + jit())} L ${G.cx - G.srx + 30} ${f1(y + h)} L ${G.cx - G.srx - 30} ${f1(y + h + +jit())} Z" fill="${[C.stein, '#B5AFA5', '#A8A298'][k % 3]}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`);
      pillars.push(`<path d="M${G.cx + G.srx - 30} ${f1(y + jit())} L ${G.cx + G.srx + 30 + +jit()} ${f1(y + 1)} L ${G.cx + G.srx + 30} ${f1(y + h + +jit())} L ${G.cx + G.srx - 30} ${f1(y + h)} Z" fill="${[C.stein, '#B5AFA5', '#A8A298'][(k + 1) % 3]}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`);
    }
    // y-Wert der Bogenlinie innen für Holzfugen
    const archY = (x) => G.base - G.iry * Math.sqrt(Math.max(0, 1 - ((x - G.cx) / G.irx) ** 2));
    const seamsL = [362, 408, 454].map((x) => `M${x} ${G.ground} L ${x} ${f1(archY(x) + 4)}`).join(' ');
    const seamsR = [546, 592, 638].map((x) => `M${x} ${G.ground} L ${x} ${f1(archY(x) + 4)}`).join(' ');
    const opening = `M${L} ${G.ground} L ${L} ${G.base} A ${G.irx} ${G.iry} 0 0 1 ${R} ${G.base} L ${R} ${G.ground} Z`;
    const doorL = `M${L} ${G.ground} L ${L} ${G.base} A ${G.irx} ${G.iry} 0 0 1 ${G.cx} ${T} L ${G.cx} ${G.ground} Z`;
    const doorR = `M${R} ${G.ground} L ${R} ${G.base} A ${G.irx} ${G.iry} 0 0 0 ${G.cx} ${T} L ${G.cx} ${G.ground} Z`;
    const ironBand = (y) => { const x0 = L + 4, x1 = R - 4; return `<path d="M${x0} ${y} L ${G.cx - 6} ${y} M${G.cx + 6} ${y} L ${x1} ${y}" stroke="#5E4A3A" stroke-width="9" stroke-linecap="round"/>`; };

    const hintStones = GATE_STONES.map(([x, y], i) => `<g class="hstone" data-i="${i}" role="button" tabindex="-1" aria-label="Hinweisstein ${i + 1}" transform="translate(${x} ${y})">
        <circle class="hs-glow" r="62" fill="url(#g-orb)"/>
        <circle class="hs-ring" r="45" fill="none" stroke="${C.honig}" stroke-width="7" stroke-dasharray="14 10"/>
        <circle r="34" fill="#A49E94" stroke="${INK}" stroke-width="3" class="hs-face"/>
        <circle r="34" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="6" stroke-dasharray="40 200"/>
        <text class="hs-q" y="13" text-anchor="middle" font-size="40" fill="${INK}" fill-opacity=".55">?</text>
        <g class="hs-ico" transform="translate(-20 -20) scale(.84)" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"></g>
      </g>`).join('');
    // Myzel-Fäden unter der Erde (erscheinen bei Lösung) – Ursprung unter Brunos Stiel
    const myz = `<g class="myzel" fill="none" stroke="#FBF5E6" stroke-width="2.6" stroke-linecap="round">
      <path d="M500 694 C 460 722 400 732 330 760 C 280 780 220 790 140 800"/><path d="M500 694 C 548 722 600 728 680 760 C 730 782 800 790 880 796"/>
      <path d="M500 694 C 496 730 486 760 470 800"/><path d="M420 728 C 410 750 390 770 360 800"/><path d="M600 726 C 616 750 640 770 670 800"/>
      <path d="M330 760 C 300 740 270 740 240 750"/><path d="M680 760 C 710 744 740 742 770 750"/><path d="M470 760 C 450 770 430 780 420 800"/>
    </g>`;
    return `<svg class="scene scene-gate" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Das geheimnisvolle Waldtor">
      <defs>
        <clipPath id="gate-clip"><path d="${opening}"/></clipPath>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E2CC"/><stop offset="1" stop-color="#F0E9D6"/></linearGradient>
        <linearGradient id="gs-door" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".3" stop-color="#000" stop-opacity="0"/></linearGradient>
      </defs>
      <rect width="1000" height="800" fill="url(#gs-sky)"/>
      <g filter="url(#f-wc)">
        ${[60, 180, 830, 950].map((x, i) => trunk(x, 44 + (i % 2) * 16, -20, 640, '#BDC2A8', false)).join('')}
        ${[60, 180, 830, 950].map((x) => canopy(x, 40, 120, '#B5C1A0', r, 4)).join('')}
        <path d="M0 620 C 200 590 380 610 500 618 C 640 606 820 590 1000 616 L 1000 800 L 0 800 Z" fill="#A2B38A"/>
      </g>
      <!-- Durchblick hinter dem Tor -->
      <g clip-path="url(#gate-clip)">
        <rect x="${L - 4}" y="${T - 4}" width="${G.irx * 2 + 8}" height="${G.ground - T + 8}" fill="#DCDFC8"/>
        <g filter="url(#f-wc)"><path d="M${L} 610 C 420 590 560 598 ${R} 606 L ${R} ${G.ground} L ${L} ${G.ground} Z" fill="#9DAF86"/></g>
        <g class="mystery-silhouette" filter="url(#f-blur4)">
          <g transform="translate(374 370) scale(1.15)">
            <g class="sil-shape" opacity=".6"><path d="M22 128 C 18 66 68 28 110 28 C 152 28 202 66 198 128 C 170 140 50 140 22 128 Z" fill="#5E534B"/><path d="M72 238 C 56 208 62 160 80 130 L 140 130 C 158 160 164 208 148 238 C 128 250 92 250 72 238 Z" fill="#7A6E65"/></g>
          </g>
        </g>
        <g class="bruno-reveal" transform="translate(374 370) scale(1.15)"></g>
        <g class="mist" filter="url(#f-soft)">
          <ellipse cx="410" cy="580" rx="140" ry="70" fill="#F7F3EA" opacity=".85"/><ellipse cx="600" cy="500" rx="130" ry="80" fill="#F7F3EA" opacity=".8"/><ellipse cx="500" cy="380" rx="170" ry="80" fill="#F7F3EA" opacity=".75"/><ellipse cx="500" cy="650" rx="200" ry="60" fill="#F7F3EA" opacity=".8"/>
        </g>
        <g class="gate-door door-l" filter="url(#f-paint)">
          <path d="${doorL}" fill="${C.holz}" stroke="${INK}" stroke-width="3"/>
          <path d="${seamsL}" stroke="${INK}" stroke-opacity=".3" stroke-width="3"/>
          <path d="${doorL}" fill="url(#gs-door)"/>
          <g clip-path="url(#gate-clip)">${ironBand(400)}${ironBand(600)}</g>
          <circle cx="480" cy="520" r="9" fill="${C.honig}" stroke="${INK}" stroke-width="2.4"/>
          ${leaf(L + 16, 520, -60, 40, 14, C.moos)}${leaf(L + 46, 610, -20, 36, 12, C.salbei)}${leaf(L + 12, 430, -80, 34, 12, C.moos)}${leaf(L + 30, 350, -40, 30, 11, C.salbei)}
        </g>
        <g class="gate-door door-r" filter="url(#f-paint)">
          <path d="${doorR}" fill="#8E6A4B" stroke="${INK}" stroke-width="3"/>
          <path d="${seamsR}" stroke="${INK}" stroke-opacity=".3" stroke-width="3"/>
          <path d="${doorR}" fill="url(#gs-door)"/>
          <g clip-path="url(#gate-clip)">${ironBand(400)}${ironBand(600)}</g>
          <circle cx="520" cy="520" r="9" fill="${C.honig}" stroke="${INK}" stroke-width="2.4"/>
          ${leaf(R - 16, 500, -120, 40, 14, C.moos)}${leaf(R - 40, 630, -160, 34, 12, C.salbei)}${leaf(R - 20, 380, -110, 32, 11, C.moos)}
        </g>
      </g>
      <!-- Schatten der Bogenlaibung -->
      <path d="${opening}" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-width="10"/>
      <g filter="url(#f-paint)">${pillars.join('')}${archStones.join('')}
        ${leaf(278, 320, -130, 44, 15, C.moos)}${leaf(262, 360, -160, 38, 13, C.wald)}${leaf(720, 300, -50, 42, 15, C.moos)}${leaf(744, 340, -20, 36, 12, C.salbei)}
      </g>
      <!-- Boden + Myzel -->
      <g filter="url(#f-wc)"><path d="M0 690 C 200 676 360 684 500 688 C 660 682 820 676 1000 690 L 1000 800 L 0 800 Z" fill="#8A6B52"/>
        <path d="M0 694 C 200 680 360 690 500 692 C 660 686 820 680 1000 694" stroke="${C.moos}" stroke-width="20" fill="none"/></g>
      ${myz}
      <g filter="url(#f-paint)">${fern(130, 700, 0.9, -14, C.wald)}${fern(200, 700, 0.66, 18, C.salbei)}${fern(870, 700, 0.95, 12, C.wald)}${fern(800, 700, 0.62, -20, '#5E7B5F')}
        ${stone(232, 704, 26, 12)}${stone(772, 706, 24, 11)}</g>
      <g class="gate-flowers">${[[170, 696, C.beere], [250, 700, C.honig], [750, 700, C.blau], [840, 696, C.beere], [420, 706, C.honig], [580, 706, C.beere]].map(([x, y, c], i) => `<g class="gflower" style="--d:${i * 0.12}s" transform="translate(${x} ${y})"><path d="M0 0 L 0 -26" stroke="${C.tief}" stroke-width="3"/><circle cy="-30" r="8" fill="${c}" stroke="${INK}" stroke-width="2"/><circle cy="-30" r="3" fill="${C.creme}"/></g>`).join('')}</g>
      ${hintStones}
    </svg>`;
  }

  /* ---- Mein Wald (Garten-Hintergrund) ----------------------------------- */
  function gardenScene(progress = 0) {
    const r = rng(52);
    const grey = progress === 0;
    return `<svg class="scene scene-garden" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="gd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${grey ? '#E3E1D6' : '#E6E7CF'}"/><stop offset="1" stop-color="#F2ECDC"/></linearGradient></defs>
      <rect width="1000" height="640" fill="url(#gd-sky)"/>
      <g filter="url(#f-wc)" ${grey ? 'opacity=".75"' : ''}>
        ${[40, 150, 860, 960].map((x, i) => trunk(x, 46 + (i % 2) * 14, -20, 380, '#A8977F', false)).join('')}
        ${[40, 150, 860, 960].map((x) => canopy(x, 30, 140, grey ? '#AEB4A2' : '#8FA47D', r, 5)).join('')}
        <path d="M0 330 C 200 300 420 310 520 316 C 700 304 860 296 1000 320 L 1000 640 L 0 640 Z" fill="${grey ? '#B7BCA9' : '#A9BB8F'}"/>
        <path d="M0 380 C 260 360 520 370 1000 372 L 1000 640 L 0 640 Z" fill="${grey ? '#AAB39C' : '#94AA7C'}"/>
      </g>
      ${progress > 0 ? `<g opacity=".8">${Array.from({ length: 6 + progress * 2 }, () => `<circle cx="${f1(80 + r() * 840)}" cy="${f1(140 + r() * 200)}" r="${f1(4 + r() * 5)}" fill="#FBE7A8" class="mote-svg"/>`).join('')}</g>` : ''}
      <g filter="url(#f-paint)">${fern(30, 640, 0.9, 16, C.wald)}${fern(980, 640, 0.9, -16, C.wald)}
        ${grass(180, 420, 0.8, C.moos, rng(1))}${grass(820, 430, 0.9, C.moos, rng(2))}${grass(500, 610, 1, C.tief, rng(3))}
        ${progress > 0 ? `${tinyShroom(120, 470, 0.7, C.rost)}${tinyShroom(880, 480, 0.6, C.honig, -1)}<g transform="translate(250 360) scale(.6)">${GARDEN.blume()}</g><g transform="translate(700 350) scale(.55)">${GARDEN.blume()}</g>` : ''}
      </g>
    </svg>`;
  }

  /* ---- Mission 2: Pilzwerkstatt ---------------------------------------- */
  // Steinpilz-Teile einzeln (gleiche Koordinaten wie SHROOMS.steinpilz)
  const STEIN_OUT = {
    hut: 'M18 94 C 14 50 48 22 80 22 C 112 22 146 50 142 94 C 120 100 40 100 18 94 Z',
    roehren: 'M22 94 C 44 101 116 101 138 94 C 136 106 126 115 110 116 L 50 116 C 34 115 24 106 22 94 Z',
    stiel: 'M64 100 C 60 122 50 146 54 168 C 57 182 103 182 106 168 C 110 146 100 122 96 100 Z'
  };
  const steinPart = (id) => {
    const src = SHROOMS.steinpilz();
    const key = id === 'roehren' ? 'unten' : id;
    const m = src.match(new RegExp(`<g data-part="${key}">([\\s\\S]*?)</g>\\s*(?=<g data-part|$)`));
    return m ? m[1] : '';
  };
  // Myzel: verzweigtes Geflecht feiner Fäden, das am Stielfuß (280/296) ansetzt
  const MYZEL = (() => {
    const R = rng(77), main = [], side = [];
    const walk = (x, y, ang, n, len, out, depth) => {
      let d = `M${f1(x)} ${f1(y)}`;
      for (let i = 0; i < n; i++) {
        ang += (R() - 0.5) * 0.7;
        const nx = Math.min(528, Math.max(32, x + Math.cos(ang) * len));
        const ny = Math.min(426, Math.max(302, y + Math.sin(ang) * len * 0.62));
        d += ` Q ${f1((x + nx) / 2 + (R() - 0.5) * 10)} ${f1((y + ny) / 2 + (R() - 0.5) * 8)} ${f1(nx)} ${f1(ny)}`;
        if (depth < 2 && i > 0 && R() < 0.75) walk(nx, ny, ang + (R() < 0.5 ? -1 : 1) * (0.6 + R() * 0.6), 2 + Math.floor(R() * 2), len * 0.62, depth === 0 ? side : side, depth + 1);
        x = nx; y = ny;
      }
      out.push(d);
    };
    [0.25, 0.55, 0.95, 1.35, 1.6, 2.2, 2.6, 2.9].forEach((a) => walk(280, 297, a, 5, 36, main, 0));
    return { main, side };
  })();
  const MYZEL_PATHS = MYZEL.main;
  const myzelSvg = (w = 3) => `<g fill="none" stroke="#F8F2E4" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="${w}">${MYZEL.main.map((d) => `<path d="${d}"/>`).join('')}</g><g stroke-width="${w * 0.55}" opacity=".9">${MYZEL.side.map((d) => `<path d="${d}"/>`).join('')}</g></g>`;
  const SHEET_T = 'translate(152 4) scale(1.6)';
  // Ziel- und Beschriftungsfelder im Blatt
  const SHEET = {
    hit: { hut: [176, 34, 208, 118], roehren: [176, 152, 208, 40], stiel: [226, 192, 108, 106], myzel: [24, 304, 512, 128] },
    slots: {
      'l-hut': { x: 14, y: 62, to: [214, 100] },
      'l-roehren': { x: 14, y: 168, to: [210, 174] },
      'l-stiel': { x: 406, y: 214, to: [318, 236] },
      'c-fk': { x: 406, y: 96, to: [382, 120] },
      'c-my': { x: 406, y: 344, to: [400, 364] }
    }
  };

  function workshopSheet(cfg) {
    // cfg: { zones: ['hut',…], pre: ['roehren'], slots: ['l-hut',…] }
    const zones = cfg.zones || [], pre = cfg.pre || [], slots = cfg.slots || [];
    const soilShown = zones.includes('myzel') || pre.includes('myzel');
    const partSvg = (id) => id === 'myzel'
      ? myzelSvg(3)
      : `<g transform="${SHEET_T}">${steinPart(id)}</g>`;
    const outline = (id) => id === 'myzel'
      ? `<rect x="40" y="312" width="480" height="112" rx="40" fill="none" class="dz-line"/><g fill="none" class="dz-line dz-faint">${MYZEL_PATHS.slice(0, 4).map((d) => `<path d="${d}"/>`).join('')}</g>`
      : `<path transform="${SHEET_T}" d="${STEIN_OUT[id]}" fill="none" class="dz-line" vector-effect="non-scaling-stroke"/>`;
    // Reihenfolge der Ebenen: Myzel, Stiel, Röhren, Hut
    const order = ['myzel', 'roehren', 'stiel', 'hut'];
    const layers = order.filter((id) => zones.includes(id) || pre.includes(id)).map((id) => `<g class="pp pp-${id} ${pre.includes(id) ? 'is-on' : ''}" data-part="${id}">${partSvg(id)}</g>`).join('');
    const outlines = order.filter((id) => zones.includes(id)).map((id) => `<g class="dz-out" data-out="${id}">${outline(id)}</g>`).join('');
    const hits = zones.map((id) => { const [x, y, w, h] = SHEET.hit[id]; return `<g class="dz" data-zone="${id}" role="button" tabindex="0" aria-label="Platz im Bild"><rect class="dz-hit" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="transparent"/></g>`; }).join('');
    const slotSvg = slots.map((id) => {
      const s = SHEET.slots[id];
      const w = 142, h = 46;
      const fromX = s.x < 280 ? s.x + w : s.x, fromY = s.y + h / 2;
      return `<g class="lslot" data-zone="${id}" role="button" tabindex="0" aria-label="Schild für ein Wort">
        <path class="lslot-line" d="M${fromX} ${fromY} Q ${(fromX + s.to[0]) / 2} ${fromY - 10} ${s.to[0]} ${s.to[1]}" fill="none"/>
        <circle cx="${s.to[0]}" cy="${s.to[1]}" r="5" class="lslot-dot"/>
        <rect class="lslot-box dz-hit" x="${s.x}" y="${s.y}" width="${w}" height="${h}" rx="12"/>
        <text class="lslot-t" x="${s.x + w / 2}" y="${s.y + 31}" text-anchor="middle"></text>
      </g>`;
    }).join('');
    const fk = slots.includes('c-fk') ? `<rect class="fk-frame" x="176" y="30" width="208" height="272" rx="44"/>` : '';
    const myArea = slots.includes('c-my') ? `<rect class="my-frame" x="30" y="306" width="500" height="124" rx="40"/>` : '';
    return `<svg class="sheet" viewBox="0 0 560 450" role="group" aria-label="Brunos Zeichnung">
      <g filter="url(#f-wob)">
        <path d="M6 10 C 120 4 440 6 552 8 L 554 442 C 440 446 120 444 8 444 Z" fill="#FBF5E6" stroke="${INK}" stroke-width="3"/>
        <path d="M6 10 L 40 14 L 10 40 Z" fill="${C.sand}" opacity=".6"/>
      </g>
      <circle cx="40" cy="26" r="8" fill="${C.rost}" stroke="${INK}" stroke-width="2"/><circle cx="520" cy="26" r="8" fill="${C.rost}" stroke="${INK}" stroke-width="2"/>
      <g filter="url(#f-wc)">
        ${soilShown ? `<path d="M24 300 C 140 292 420 296 536 300 L 536 432 C 420 438 140 436 24 432 Z" fill="#A58466" opacity=".85"/>` : ''}
        <path d="M24 300 C 140 290 420 296 536 300" stroke="${C.moos}" stroke-width="12" fill="none" stroke-linecap="round"/>
      </g>
      ${grass(70, 300, 0.7, C.moos, rng(41))}${grass(500, 300, 0.7, C.moos, rng(42))}
      ${fk}${myArea}
      ${outlines}
      <g filter="url(#f-paint)">${layers}</g>
      ${hits}${slotSvg}
    </svg>`;
  }

  /* einzelne Puzzleteile für die Werkbank */
  function workPiece(id) {
    if (id === 'myzel') {
      return `<svg class="piece-svg" viewBox="40 290 480 150" aria-hidden="true"><g filter="url(#f-paint)"><rect x="44" y="300" width="472" height="132" rx="40" fill="#A58466" stroke="${INK}" stroke-width="3"/>${myzelSvg(4.5)}</g></svg>`;
    }
    const vb = { hut: '12 18 136 84', roehren: '18 90 124 30', stiel: '46 96 68 90' }[id];
    return `<svg class="piece-svg" viewBox="${vb}" aria-hidden="true"><g filter="url(#f-paint)">${steinPart(id)}</g></svg>`;
  }

  /* Baumpilze an einem Holzstück: nicht alle Pilze haben Hut und Stiel */
  function bracketLog() {
    const shelf = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C 10 -14 50 -18 74 -6 C 80 -2 78 6 70 8 C 50 12 20 10 0 6 Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 -2 C 26 -10 50 -12 68 -4" fill="none" stroke="${C.creme}" stroke-opacity=".6" stroke-width="2.4"/><path d="M14 -6 C 30 -12 50 -13 64 -8" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-width="1.6"/></g>`;
    return `<svg class="bracket-log" viewBox="0 0 220 200" role="img" aria-label="Baumpilze an einem Holzstamm"><g filter="url(#f-paint)">
      <path d="M30 196 L 34 20 C 34 8 86 8 86 20 L 90 196 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/>
      <ellipse cx="60" cy="20" rx="26" ry="9" fill="${C.holzHell}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M46 40 L 44 180 M62 44 L 64 190 M76 40 L 78 176" stroke="${INK}" stroke-opacity=".2" stroke-width="2"/>
      ${shelf(84, 70, 1.1, '#A8794E')}${shelf(84, 104, 0.9, '#C49A62')}${shelf(84, 136, 1.2, '#8E6440')}
    </g></svg>`;
  }

  function workshopScene(lit = false) {
    const r = rng(61);
    const planks = Array.from({ length: 15 }, (_, i) => `<path d="M${i * 70 + (r() - 0.5) * 6} 0 L ${i * 70 + (r() - 0.5) * 6} 700" stroke="${INK}" stroke-opacity=".16" stroke-width="3"/>`).join('');
    const jar = (x, y, w, h, inner) => `<g transform="translate(${x} ${y})"><rect x="0" y="${-h}" width="${w}" height="${h}" rx="14" fill="#DCE6E0" fill-opacity=".75" stroke="${INK}" stroke-width="2.4"/><rect x="${w * 0.15}" y="${-h - 10}" width="${w * 0.7}" height="12" rx="4" fill="${C.holz}" stroke="${INK}" stroke-width="2"/>${inner}<path d="M${w * 0.2} ${-h + 14} L ${w * 0.2} ${-14}" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></g>`;
    return `<svg class="scene scene-workshop" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="ws-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9946B"/><stop offset=".5" stop-color="#CFAE85"/><stop offset="1" stop-color="#C29E75"/></linearGradient>
        <radialGradient id="ws-light" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#FBE7B0" stop-opacity="${lit ? 0.75 : 0.35}"/><stop offset="1" stop-color="#FBE7B0" stop-opacity="0"/></radialGradient></defs>
      <rect width="1000" height="800" fill="url(#ws-wall)"/>
      <g filter="url(#f-wc)">${planks}</g>
      <ellipse cx="500" cy="330" rx="520" ry="380" fill="url(#ws-light)"/>
      <!-- rundes Fenster -->
      <g filter="url(#f-paint)">
        <circle cx="140" cy="150" r="104" fill="#E9EED6" stroke="${INK}" stroke-width="3"/>
                ${canopy(110, 120, 70, C.salbei, rng(62), 4)}${canopy(196, 190, 50, '#B5C1A0', rng(63), 4)}
        <circle cx="140" cy="150" r="104" fill="none" stroke="${C.holz}" stroke-width="22"/>
        <circle cx="140" cy="150" r="104" fill="none" stroke="${INK}" stroke-width="2.6"/><circle cx="140" cy="150" r="115" fill="none" stroke="${INK}" stroke-width="2.6"/>
        <path d="M140 46 L 140 254 M36 150 L 244 150" stroke="${C.holz}" stroke-width="10"/>
      </g>
      <!-- Regal rechts -->
      <g filter="url(#f-paint)">
        <path d="M760 250 L 1000 250 L 1000 268 L 760 268 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/>
        ${jar(778, 250, 56, 76, `${tinyShroom(28, -8, 0.5, C.rost)}`)}${jar(850, 250, 46, 60, `<circle cx="14" cy="-16" r="5" fill="${C.honig}"/><circle cx="28" cy="-22" r="5" fill="${C.honig}"/><circle cx="22" cy="-10" r="5" fill="${C.honig}"/>`)}
        <path d="M914 250 L 914 196 L 936 196 L 936 250 Z M940 250 L 944 206 L 962 208 L 960 250 Z" fill="${C.beere}" stroke="${INK}" stroke-width="2.2"/>
        <path d="M790 470 L 1000 470 L 1000 488 L 790 488 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/>
        <path d="M806 470 C 800 440 812 420 830 420 C 848 420 860 440 854 470 Z" fill="${C.rost}" stroke="${INK}" stroke-width="2.4"/>${fern(830, 424, 0.34, -10, C.moos, 7, 150)}
        ${jar(880, 470, 60, 70, `<path d="M10 -20 C 20 -40 40 -40 50 -20" stroke="${C.creme}" stroke-width="3" fill="none"/>`)}
      </g>
      <!-- Laterne -->
      <path d="M640 0 L 640 74" stroke="${INK}" stroke-width="3"/>
      <circle cx="640" cy="104" r="${lit ? 70 : 46}" fill="url(#g-orb)" class="glow-anim"/>
      <g filter="url(#f-paint)"><path d="M622 80 L 658 80 L 654 124 L 626 124 Z" fill="${C.honig}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M618 80 L 640 64 L 662 80 Z" fill="${C.braun}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><circle cx="640" cy="102" r="7" fill="#FFF6D8"/></g>
      <!-- Werkzeug an der Wand -->
      <g filter="url(#f-paint)">
        <circle cx="96" cy="400" r="26" fill="#E9EED6" fill-opacity=".7" stroke="${INK}" stroke-width="5"/><path d="M114 420 L 142 452" stroke="${C.holz}" stroke-width="11" stroke-linecap="round"/>
        <path d="M60 470 L 64 560" stroke="${C.holz}" stroke-width="7" stroke-linecap="round"/><path d="M56 556 C 56 580 72 584 72 560 Z" fill="${C.sand}" stroke="${INK}" stroke-width="2"/>
      </g>
      <!-- Boden -->
      <g filter="url(#f-wc)"><path d="M0 690 L 1000 690 L 1000 800 L 0 800 Z" fill="#A9825C"/>
        <path d="M0 690 L 1000 690" stroke="${INK}" stroke-opacity=".35" stroke-width="5"/>${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${712 + i * 18} L 1000 ${714 + i * 18}" stroke="${INK}" stroke-opacity=".12" stroke-width="2"/>`).join('')}</g>
      <!-- Staffelei hinter dem Blatt -->
      <g filter="url(#f-paint)"><path d="M380 760 L 470 60 M620 760 L 530 60 M500 80 L 500 780" stroke="${C.holz}" stroke-width="18" stroke-linecap="round"/><path d="M380 760 L 470 60 M620 760 L 530 60" stroke="${INK}" stroke-width="2" stroke-opacity=".5"/></g>
      <!-- Korb -->
      <g filter="url(#f-paint)"><path d="M820 700 C 820 650 960 650 960 700 L 950 760 L 830 760 Z" fill="${C.holzHell}" stroke="${INK}" stroke-width="2.6"/><path d="M826 690 L 954 690 M832 716 L 950 716 M836 740 L 946 740" stroke="${INK}" stroke-opacity=".3" stroke-width="2"/>${tinyShroom(860, 664, 0.5, '#8B5E3C')}${tinyShroom(900, 660, 0.6, C.honig, -1)}</g>
    </svg>`;
  }

  /* ---- Mission 3: Dorf der hundert Hüte ------------------------------- */
  const ROOF = {
    fliegenpilz: { c: C.rot, spots: true }, steinpilz: { c: '#8B5E3C' }, pfifferling: { c: '#E7AE3E', wavy: true },
    champignon: { c: '#EFE6D6' }, maronenroehrling: { c: '#6E4430' }, plain: { c: '#BDB6A8' }
  };
  function roof(id) {
    const R = ROOF[id] || { c: C.rost };
    const d = R.wavy
      ? 'M8 84 C 10 60 30 40 56 34 C 70 22 86 28 100 22 C 116 28 130 22 144 34 C 170 40 190 60 192 84 C 140 92 60 92 8 84 Z'
      : 'M8 84 C 6 40 50 8 100 8 C 150 8 194 40 192 84 C 140 92 60 92 8 84 Z';
    const spots = R.spots ? `<g fill="#FBF6EC"><ellipse cx="60" cy="40" rx="9" ry="6"/><ellipse cx="104" cy="24" rx="8" ry="5"/><ellipse cx="146" cy="44" rx="10" ry="7"/><ellipse cx="94" cy="58" rx="6" ry="4"/><ellipse cx="36" cy="66" rx="5" ry="4"/><ellipse cx="168" cy="70" rx="5" ry="4"/></g>` : '';
    return `<svg class="roof-svg" viewBox="0 0 200 96" preserveAspectRatio="none" aria-hidden="true"><g filter="url(#f-paint)">
      <path d="${d}" fill="${R.c}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${spots}
      <path d="M40 40 C 56 24 76 18 96 16" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="7" stroke-linecap="round"/>
      <rect x="150" y="2" width="12" height="26" fill="${C.steinDunkel}" stroke="${INK}" stroke-width="2.4"/></g></svg>`;
  }
  /* Unterseite von unten gesehen: Lamellen, Röhren, Leisten */
  function underIcon(type) {
    let inner = '';
    if (type === 'lamellen') {
      for (let a = 0; a < 360; a += 9) { const r1 = a % 18 ? 26 : 12; inner += `<path d="M${f1(40 + Math.cos(a * Math.PI / 180) * r1)} ${f1(40 + Math.sin(a * Math.PI / 180) * r1)} L ${f1(40 + Math.cos(a * Math.PI / 180) * 33)} ${f1(40 + Math.sin(a * Math.PI / 180) * 33)}"/>`; }
      inner = `<g stroke="${C.braun}" stroke-width="1.4">${inner}</g>`;
    } else if (type === 'roehren') {
      for (let y = 10; y <= 70; y += 6) for (let x = 10; x <= 70; x += 6) { const ox = x + ((y / 6) % 2) * 3; if (Math.hypot(ox - 40, y - 40) < 32 && Math.hypot(ox - 40, y - 40) > 11) inner += `<circle cx="${ox}" cy="${y}" r="1.9"/>`; }
      inner = `<g fill="#8E7A3E">${inner}</g>`;
    } else {
      for (let a = 0; a < 360; a += 30) {
        const r = (v) => [f1(40 + Math.cos(((a + v) * Math.PI) / 180) * 0), 0];
        const p = (ang, rad) => `${f1(40 + Math.cos((ang * Math.PI) / 180) * rad)} ${f1(40 + Math.sin((ang * Math.PI) / 180) * rad)}`;
        inner += `<path d="M${p(a, 11)} Q ${p(a + 4, 22)} ${p(a, 26)} M${p(a, 26)} L ${p(a - 7, 33)} M${p(a, 26)} L ${p(a + 7, 33)}"/>`;
      }
      inner = `<g stroke="#B57A1E" stroke-width="3" stroke-linecap="round" fill="none">${inner}</g>`;
    }
    const fill = { lamellen: '#F3ECDD', roehren: '#E4D49A', leisten: '#F0C25C' }[type];
    return `<svg class="under-ico" viewBox="0 0 80 80" aria-hidden="true"><g filter="url(#f-wob)"><circle cx="40" cy="40" r="35" fill="${fill}" stroke="${INK}" stroke-width="2.6"/>${inner}<circle cx="40" cy="40" r="10" fill="#ECDFC3" stroke="${INK}" stroke-width="2"/></g></svg>`;
  }
  function villageScene(named = 0, total = 5) {
    const r = rng(83);
    const lit = named / Math.max(1, total);
    const lamps = Array.from({ length: 9 }, (_, i) => {
      const x = 60 + i * 110, y = 120 + Math.sin(i * 0.9) * 14;
      const on = i < Math.round(lit * 9);
      return `<g transform="translate(${x} ${y})">${on ? `<circle r="26" fill="url(#g-orb)" class="glow-anim"/>` : ''}<circle r="8" fill="${on ? C.honig : '#CFC8BA'}" stroke="${INK}" stroke-width="1.8"/></g>`;
    }).join('');
    return `<svg class="scene scene-village" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="vl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit > 0.5 ? '#EDE6C8' : '#E2E0D4'}"/><stop offset="1" stop-color="#F3ECDA"/></linearGradient></defs>
      <rect width="1000" height="700" fill="url(#vl-sky)"/>
      <g filter="url(#f-wc)" opacity="${0.7 + lit * 0.3}">
        ${[30, 170, 840, 980].map((x, i) => trunk(x, 40 + (i % 2) * 14, -20, 420, '#A8977F', false)).join('')}
        ${[30, 170, 840, 980].map((x) => canopy(x, 20, 130, lit > 0.3 ? '#8FA47D' : '#AEB4A2', r, 5)).join('')}
        <path d="M0 380 C 200 340 400 360 520 368 C 700 352 860 344 1000 372 L 1000 700 L 0 700 Z" fill="${lit > 0.3 ? '#A9BB8F' : '#B7BCA9'}"/>
        <path d="M0 560 C 260 540 600 548 1000 556 L 1000 700 L 0 700 Z" fill="${lit > 0.3 ? '#94AA7C' : '#AAB39C'}"/>
        <path d="M-20 640 C 300 600 700 610 1020 640 L 1020 700 L -20 700 Z" fill="#E2D2B2"/>
      </g>
      <path d="M0 100 C 200 150 400 110 500 130 C 640 150 820 100 1000 130" fill="none" stroke="${INK}" stroke-opacity=".5" stroke-width="2"/>
      ${lamps}
      <g filter="url(#f-paint)" opacity="${0.6 + lit * 0.4}">${tinyShroom(70, 620, 1.3, C.rost)}${tinyShroom(950, 630, 1.1, C.honig, -1)}${tinyShroom(900, 650, 0.7, C.beere)}
        ${fern(20, 700, 0.7, 16, C.wald)}${fern(990, 700, 0.7, -16, C.wald)}</g>
    </svg>`;
  }

  /* ---- Mission 4: Wald der Verwechslungen ----------------------------- */
  function mistForest(clear = 0) {
    const r = rng(97);
    const fog = Math.max(0, 1 - clear);
    const trees = [40, 130, 230, 330, 690, 790, 880, 970].map((x, i) => trunk(x, 34 + (i % 3) * 12, -20, 560 + (i % 2) * 40, i % 2 ? '#8E7A63' : '#A8977F', false)).join('');
    const cans = [40, 130, 230, 330, 690, 790, 880, 970].map((x, i) => canopy(x, 30 + (i % 2) * 40, 110, i % 2 ? '#6F8A5B' : '#8FA47D', r, 5)).join('');
    return `<svg class="scene scene-mist" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="1000" height="700" fill="#DCE0CC"/>
      <g filter="url(#f-wc)">${trees}${cans}
        <path d="M0 520 C 220 490 420 506 520 512 C 700 500 860 492 1000 516 L 1000 700 L 0 700 Z" fill="#94AA7C"/>
        <path d="M380 700 C 430 620 470 560 500 520 C 530 560 570 620 620 700 Z" fill="#E2D2B2"/></g>
      <g filter="url(#f-paint)">${fern(60, 700, 0.9, 12, C.wald)}${fern(950, 700, 0.9, -12, C.wald)}${tinyShroom(160, 640, 0.9, '#B5AFA5')}${tinyShroom(860, 650, 0.8, '#B5AFA5', -1)}${tinyShroom(820, 640, 0.5, '#B5AFA5')}</g>
      <g class="mist-layers" filter="url(#f-soft)" style="opacity:${f1(fog)}">
        <ellipse cx="200" cy="420" rx="320" ry="120" fill="#F7F4EC" opacity=".85"/><ellipse cx="760" cy="380" rx="340" ry="130" fill="#F7F4EC" opacity=".8"/>
        <ellipse cx="500" cy="240" rx="420" ry="120" fill="#F7F4EC" opacity=".7"/><ellipse cx="500" cy="600" rx="520" ry="110" fill="#F7F4EC" opacity=".75"/>
      </g>
    </svg>`;
  }
  const SIT = {
    spielplatz: () => `<rect x="0" y="170" width="400" height="90" fill="#E2D2B2"/><path d="M60 190 L 230 190 L 250 240 L 40 240 Z" fill="${C.holzHell}" stroke="${INK}" stroke-width="3"/><path d="M58 198 L 232 198 L 246 232 L 46 232 Z" fill="#F0E2C0"/>
      <path d="M290 60 L 290 200 M330 60 L 330 200 M290 60 L 330 60" stroke="${C.rost}" stroke-width="8" stroke-linecap="round"/><path d="M290 90 C 260 120 230 170 200 196" stroke="${C.honig}" stroke-width="16" fill="none" stroke-linecap="round"/>
      ${tinyShroom(130, 214, 0.9, '#F1ECE0')}${tinyShroom(160, 220, 0.6, '#F1ECE0', -1)}`,
    champi: () => `<path d="M0 200 C 100 170 300 170 400 200 L 400 260 L 0 260 Z" fill="${C.moos}"/>${grass(120, 210, 1, C.tief, rng(9))}${grass(300, 214, 0.9, C.tief, rng(8))}
      <g transform="translate(140 40) scale(.9)">${SHROOMS.champignon()}</g>
      <text x="320" y="90" font-size="70" font-weight="800" fill="${C.rost}" class="svgd">?</text>`,
    farbe: () => `<path d="M0 200 C 100 170 300 170 400 200 L 400 260 L 0 260 Z" fill="${C.moos}"/>
      <g transform="translate(40 50) scale(.85)">${SHROOMS.fliegenpilz()}</g><g transform="translate(230 50) scale(.85)">${SHROOMS.steinpilz()}</g>
      <text x="200" y="120" text-anchor="middle" font-size="60" font-weight="800" fill="${INK}" class="svgd">?</text>`,
    haende: () => `<rect x="0" y="190" width="400" height="70" fill="#D9CDB4"/><path d="M110 120 L 290 120 C 290 170 250 196 200 196 C 150 196 110 170 110 120 Z" fill="#EAF0EE" stroke="${INK}" stroke-width="3"/>
      <path d="M200 120 L 200 60 L 240 60 L 240 76" fill="none" stroke="${C.steinDunkel}" stroke-width="12" stroke-linecap="round"/><path d="M240 84 q 6 10 0 14 q -6 -4 0 -14 M246 104 q 6 10 0 14 q -6 -4 0 -14" fill="${C.blau}"/>
      <rect x="300" y="150" width="50" height="28" rx="10" fill="${C.beere}" stroke="${INK}" stroke-width="2.4"/><circle cx="318" cy="142" r="6" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="332" cy="134" r="4" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`,
    oma: () => `<rect x="0" y="200" width="400" height="60" fill="#D9CDB4"/><path d="M70 150 C 70 120 230 120 230 150 L 218 222 L 82 222 Z" fill="${C.holzHell}" stroke="${INK}" stroke-width="3"/><path d="M86 150 C 100 70 200 70 214 150" fill="none" stroke="${C.holz}" stroke-width="8"/>
      ${tinyShroom(110, 150, 0.8, '#8B5E3C')}${tinyShroom(150, 146, 0.9, '#C9B79C', -1)}${tinyShroom(190, 152, 0.7, C.honig)}
      <rect x="260" y="40" width="130" height="70" rx="10" fill="${C.creme}" stroke="${INK}" stroke-width="3"/><path d="M325 110 L 325 210" stroke="${C.holz}" stroke-width="8"/>
      <text x="325" y="70" text-anchor="middle" font-size="20" font-weight="800" fill="${INK}" class="svgd">Pilz-</text><text x="325" y="94" text-anchor="middle" font-size="20" font-weight="800" fill="${INK}" class="svgd">beratung</text>`,
    schnecke: () => `<path d="M0 200 C 100 170 300 170 400 200 L 400 260 L 0 260 Z" fill="${C.moos}"/><g transform="translate(150 30) scale(.9)">${SHROOMS.steinpilz()}</g><g transform="translate(60 120) scale(.6)">${PICS.schnecke()}</g>`,
    notfall: () => `<rect x="0" y="200" width="400" height="60" fill="#D9CDB4"/><rect x="140" y="40" width="120" height="180" rx="20" fill="${C.ink}"/><rect x="152" y="60" width="96" height="130" rx="8" fill="#F3EEDF"/>
      <text x="200" y="140" text-anchor="middle" font-size="44" font-weight="800" fill="${C.rost}" class="svgd">112</text><circle cx="200" cy="206" r="7" fill="#555"/>`
  };
  function sitArt(id) {
    return `<svg class="sit-svg" viewBox="0 0 400 260" aria-hidden="true"><g filter="url(#f-paint)">${(SIT[id] || SIT.champi)()}</g></svg>`;
  }

  /* ---- Mission 5: Forscherlabor --------------------------------------- */
  function stageArt(id) {
    const soil = `<rect x="6" y="104" width="148" height="50" rx="10" fill="#7E5F48" stroke="${INK}" stroke-width="2.4"/><path d="M10 108 C 50 102 110 104 150 108" stroke="#5E4535" stroke-width="5" fill="none"/>`;
    const threads = (op = 1) => `<g fill="none" stroke="#FBF5E6" stroke-width="2" stroke-linecap="round" opacity="${op}"><path d="M20 120 C 40 116 60 130 80 122 C 100 114 120 130 140 120"/><path d="M30 140 C 50 130 70 146 90 136 C 110 128 130 142 146 136"/><path d="M50 116 C 52 128 46 138 40 148 M100 118 C 104 130 112 138 120 148 M76 124 C 72 134 76 142 70 150"/></g>`;
    let top = '';
    if (id === 'myzel') top = threads(1);
    if (id === 'koepfchen') top = threads(.7) + [[40, 104, 5], [62, 104, 4], [86, 104, 6], [108, 104, 4], [126, 104, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y - r + 2}" r="${r}" fill="#F7F2E8" stroke="${INK}" stroke-width="1.6"/>`).join('');
    if (id === 'knopf') top = threads(.5) + [[52, 1], [104, .8]].map(([x, sc]) => `<g transform="translate(${x} 106) scale(${sc})"><path d="M-10 0 L -10 -18 L 10 -18 L 10 0 Z" fill="#F2ECE1" stroke="${INK}" stroke-width="2"/><path d="M-26 -16 C -28 -48 28 -48 26 -16 C 16 -10 -16 -10 -26 -16 Z" fill="#EFE6D6" stroke="${INK}" stroke-width="2.2"/><path d="M-16 -32 C -10 -40 0 -42 6 -41" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/></g>`).join('');
    if (id === 'offen') top = threads(.4) + `<g transform="translate(80 106)"><path d="M-9 0 L -8 -40 L 8 -40 L 9 0 Z" fill="#F2ECE1" stroke="${INK}" stroke-width="2"/><path d="M-9 -30 L 9 -30" stroke="${INK}" stroke-width="2"/>
      <path d="M-50 -40 C -48 -82 48 -82 50 -40 Z" fill="#E9DFCB" stroke="${INK}" stroke-width="2.4"/><path d="M-50 -40 C -30 -30 30 -30 50 -40 C 30 -44 -30 -44 -50 -40 Z" fill="#6E4A3C" stroke="${INK}" stroke-width="2"/>
      <path d="M-40 -39 L -36 -36 M-28 -38 L -26 -34 M-16 -37 L -15 -33 M-4 -37 L -4 -33 M8 -37 L 8 -33 M20 -37 L 19 -33 M32 -38 L 30 -34 M42 -39 L 39 -36" stroke="#3E2A22" stroke-width="1.4"/></g>`;
    return `<svg class="stage-svg" viewBox="0 0 160 160" aria-hidden="true"><rect width="160" height="160" fill="#F1EEE2"/><g filter="url(#f-paint)">${soil}${top}</g></svg>`;
  }
  const NEED_ART = {
    feucht: `<path d="M40 12 C 30 28 22 38 22 50 C 22 62 30 70 40 70 C 50 70 58 62 58 50 C 58 38 50 28 40 12 Z" fill="${C.blau}" stroke="${INK}" stroke-width="2.6"/><path d="M32 50 C 32 58 36 62 40 62" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`,
    erde: `<path d="M8 40 L 72 40 L 66 70 L 14 70 Z" fill="#7E5F48" stroke="${INK}" stroke-width="2.6"/><path d="M14 46 C 30 42 50 50 66 44" stroke="#FBF5E6" stroke-width="2" fill="none"/><path d="M20 58 C 34 54 46 62 60 56" stroke="#FBF5E6" stroke-width="2" fill="none"/>`,
    luft: `<path d="M10 30 C 30 30 46 30 54 24 C 62 18 54 8 46 14 M10 44 C 34 44 52 44 62 50 C 70 56 62 66 54 60 M10 58 C 24 58 32 58 38 62" fill="none" stroke="${C.blau}" stroke-width="4" stroke-linecap="round"/>`,
    sonne: `<circle cx="40" cy="40" r="14" fill="${C.honig}" stroke="${INK}" stroke-width="2.6"/><g stroke="${C.honig}" stroke-width="5" stroke-linecap="round">${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${f1(40 + Math.cos(a) * 21)} ${f1(40 + Math.sin(a) * 21)} L ${f1(40 + Math.cos(a) * 30)} ${f1(40 + Math.sin(a) * 30)}"/>`; }).join('')}</g>`,
    hitze: `<rect x="32" y="10" width="16" height="44" rx="8" fill="#fff" stroke="${INK}" stroke-width="2.6"/><circle cx="40" cy="62" r="11" fill="${C.rost}" stroke="${INK}" stroke-width="2.6"/><rect x="36" y="22" width="8" height="34" fill="${C.rost}"/>`
  };
  function needArt(id) { return `<svg class="need-svg" viewBox="0 0 80 80" aria-hidden="true"><g filter="url(#f-wob)">${NEED_ART[id] || ''}</g></svg>`; }

  function labScene(lit = false) {
    const r = rng(71);
    return `<svg class="scene scene-lab" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><radialGradient id="lab-light" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#FBE7B0" stop-opacity="${lit ? 0.7 : 0.35}"/><stop offset="1" stop-color="#FBE7B0" stop-opacity="0"/></radialGradient></defs>
      <rect width="1000" height="700" fill="#E7E2CF"/>
      <g filter="url(#f-wc)">${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 90 + 20} 0 L ${i * 90 + 20} 560" stroke="${INK}" stroke-opacity=".08" stroke-width="3"/>`).join('')}</g>
      <ellipse cx="500" cy="200" rx="560" ry="360" fill="url(#lab-light)"/>
      <g filter="url(#f-paint)">
        <path d="M60 230 L 360 230 L 360 246 L 60 246 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/>
        ${[90, 160, 230, 300].map((x, i) => `<g transform="translate(${x} 230)"><rect x="0" y="-70" width="44" height="70" rx="10" fill="#DCE6E0" fill-opacity=".8" stroke="${INK}" stroke-width="2.2"/><rect x="6" y="-80" width="32" height="12" rx="4" fill="${C.holz}" stroke="${INK}" stroke-width="2"/><rect x="4" y="-28" width="36" height="24" fill="${[C.moos, C.honig, C.beere, C.salbei][i]}" opacity=".7"/></g>`).join('')}
        <path d="M640 230 L 940 230 L 940 246 L 640 246 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/>
        <rect x="660" y="140" width="110" height="90" rx="6" fill="${C.creme}" stroke="${INK}" stroke-width="2.4"/><path d="M672 160 L 758 160 M672 178 L 740 178 M672 196 L 750 196" stroke="${C.braun}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="850" cy="180" r="38" fill="#E9EED6" stroke="${INK}" stroke-width="5"/><path d="M878 208 L 912 244" stroke="${C.holz}" stroke-width="12" stroke-linecap="round"/>
        <path d="M0 560 L 1000 560 L 1000 700 L 0 700 Z" fill="#B9946B"/><path d="M0 560 L 1000 560" stroke="${INK}" stroke-width="4" stroke-opacity=".4"/>
        ${fern(40, 560, 0.6, 14, C.moos)}${fern(960, 560, 0.6, -14, C.moos)}
      </g>
      <path d="M500 0 L 500 60" stroke="${INK}" stroke-width="3"/><circle cx="500" cy="90" r="${lit ? 70 : 44}" fill="url(#g-orb)" class="glow-anim"/>
      <g filter="url(#f-paint)"><path d="M480 66 L 520 66 L 516 112 L 484 112 Z" fill="${C.honig}" stroke="${INK}" stroke-width="2.4"/><path d="M476 66 L 500 50 L 524 66 Z" fill="${C.braun}" stroke="${INK}" stroke-width="2.4"/></g>
    </svg>`;
  }

  /* ---- Mission 6: Pilzfest ------------------------------------------- */
  function festScene(done = 0, total = 4) {
    const r = rng(19);
    const lit = done / total;
    const cols = [C.rost, C.honig, C.beere, C.salbei, C.blau];
    const flags = (y0, n) => Array.from({ length: n }, (_, i) => { const x = 30 + i * (940 / (n - 1)); const y = y0 + Math.sin((i / (n - 1)) * Math.PI) * 50; return `<path d="M${f1(x - 14)} ${f1(y)} L ${f1(x + 14)} ${f1(y)} L ${f1(x)} ${f1(y + 30)} Z" fill="${cols[i % 5]}" stroke="${INK}" stroke-width="2" opacity="${i / n < lit + 0.08 ? 1 : 0.25}"/>`; }).join('');
    const lamps = Array.from({ length: 10 }, (_, i) => { const x = 80 + i * 95, y = 170 + Math.sin(i) * 10; const on = i / 10 < lit; return `<g transform="translate(${x} ${y})">${on ? `<circle r="28" fill="url(#g-orb)" class="glow-anim"/>` : ''}<circle r="8" fill="${on ? C.honig : '#CFC8BA'}" stroke="${INK}" stroke-width="1.8"/></g>`; }).join('');
    return `<svg class="scene scene-fest" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit >= 1 ? '#F1E6C2' : '#E3E2D2'}"/><stop offset="1" stop-color="#F4EEDD"/></linearGradient></defs>
      <rect width="1000" height="700" fill="url(#fs-sky)"/>
      <g filter="url(#f-wc)">${[20, 140, 860, 980].map((x, i) => trunk(x, 40 + (i % 2) * 14, -20, 460, '#8E7A63', false)).join('')}${[20, 140, 860, 980].map((x) => canopy(x, 20, 130, lit > 0.5 ? '#7E9572' : '#9FA894', r, 5)).join('')}
        <path d="M0 440 C 240 410 520 420 1000 436 L 1000 700 L 0 700 Z" fill="${lit > 0.5 ? '#A9BB8F' : '#B4B9A6'}"/></g>
      <path d="M30 60 C 300 120 700 120 970 60" fill="none" stroke="${INK}" stroke-width="2"/>${flags(60, 15)}
      <path d="M40 170 C 300 190 700 190 960 170" fill="none" stroke="${INK}" stroke-opacity=".5" stroke-width="2"/>${lamps}
      <g filter="url(#f-paint)">
        <path d="M360 520 L 640 520 L 630 540 L 370 540 Z" fill="${C.holz}" stroke="${INK}" stroke-width="2.6"/><path d="M380 540 L 384 620 M620 540 L 616 620" stroke="${C.holz}" stroke-width="10"/>
        <path d="M430 520 C 430 490 500 490 500 520 Z" fill="${C.rost}" stroke="${INK}" stroke-width="2.4"/><path d="M510 520 L 516 494 L 560 494 L 566 520 Z" fill="${C.honig}" stroke="${INK}" stroke-width="2.4"/>
        ${lit >= 1 ? `${tinyShroom(220, 640, 1.4, C.rost)}${tinyShroom(800, 640, 1.2, C.honig, -1)}${tinyShroom(300, 660, 0.9, C.beere)}${tinyShroom(700, 664, 0.8, '#8B5E3C')}` : ''}
        ${fern(30, 700, 0.8, 14, C.wald)}${fern(970, 700, 0.8, -14, C.wald)}
      </g>
    </svg>`;
  }
  /* Urkunde (Rahmen + Siegel) */
  function certFrame() {
    const leaves = Array.from({ length: 22 }, (_, i) => {
      const t = i / 22, side = i % 4;
      const pos = [[40 + t * 4 * 720, 30], [770, 40 + (t * 4 - 1) * 520], [760 - (t * 4 - 2) * 720, 560], [30, 560 - (t * 4 - 3) * 520]][Math.min(3, Math.floor(t * 4))];
      return leaf(pos[0], pos[1], (i * 47) % 360, 26, 10, [C.moos, C.salbei, C.wald][i % 3], 1.6);
    }).join('');
    return `<svg class="cert-frame" viewBox="0 0 800 590" preserveAspectRatio="none" aria-hidden="true"><g filter="url(#f-paint)">
      <rect x="18" y="18" width="764" height="554" rx="26" fill="none" stroke="${C.wald}" stroke-width="10"/>
      <rect x="34" y="34" width="732" height="522" rx="18" fill="none" stroke="${C.honig}" stroke-width="3" stroke-dasharray="10 8"/>
      ${leaves}${tinyShroom(70, 560, 1.1, C.rost)}${tinyShroom(740, 560, 1.1, '#8B5E3C', -1)}</g></svg>`;
  }

  /* ---- Wissenswand (Station vor dem Abenteuer) ------------------------- */
  // (WALL_POS steht weiter oben bei der Karte)
  function wallNode(layoutKey, count = 0) {
    const [x, y] = WALL_POS[layoutKey];
    const notes = [[-38, -70, -6, '#F3DD8E'], [4, -76, 5, '#CFE0B8'], [-30, -36, 4, '#F2C6B4'], [12, -38, -4, '#D9C7E0']].slice(0, Math.max(1, Math.min(4, count || 2)))
      .map(([nx, ny, r, c]) => `<g transform="translate(${nx} ${ny}) rotate(${r})"><rect width="30" height="26" fill="${c}" stroke="${INK}" stroke-width="1.6"/><path d="M5 9 L 25 9 M5 15 L 22 15 M5 21 L 18 21" stroke="${INK}" stroke-opacity=".4" stroke-width="1.6"/><circle cx="15" cy="3" r="3" fill="${C.rost}" stroke="${INK}" stroke-width="1.2"/></g>`).join('');
    const fs = 30;
    return `<g class="map-node map-wall is-open" data-ch="0" role="button" tabindex="0" aria-label="Wissenswand: Was wissen wir schon?" transform="translate(${x} ${y})">
      <circle r="96" fill="transparent"/>
      <g class="node-art" filter="url(#f-paint)">
        <path d="M-50 40 L -46 -6 M50 40 L 46 -6" stroke="${C.holz}" stroke-width="9" stroke-linecap="round"/>
        <rect x="-58" y="-92" width="116" height="92" rx="8" fill="#C79A6A" stroke="${INK}" stroke-width="3"/>
        <rect x="-50" y="-84" width="100" height="76" rx="4" fill="#D8B486" stroke="${INK}" stroke-opacity=".4" stroke-width="1.6"/>
        ${notes}
        <path d="M-64 -92 L 0 -116 L 64 -92 Z" fill="${C.wald}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      </g>
      <g transform="translate(0 30)">
        <path d="M${-fs * 4.4} 6 C ${-fs * 2} 0 ${fs * 2} 2 ${fs * 4.4} 6 L ${fs * 4.4 - 4} ${fs * 2.6} C ${fs * 2} ${fs * 2.7} ${-fs * 2} ${fs * 2.6} ${-fs * 4.4 + 4} ${fs * 2.6} Z" fill="${C.creme}" stroke="${INK}" stroke-width="2.4" filter="url(#f-wob)"/>
        <text x="0" y="${fs * 1.15}" text-anchor="middle" font-size="${fs}" class="map-label" fill="${INK}">Wissenswand</text>
        <text x="0" y="${fs * 2.15}" text-anchor="middle" font-size="${fs * 0.72}" class="map-label" fill="${C.braun}">Was wissen wir schon?</text>
      </g>
    </g>`;
  }
  /* Zettel für die Wand (Pinnnadel) */
  function pin(color = C.rost) {
    return `<svg class="note-pin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="10" r="8" fill="${color}" stroke="${INK}" stroke-width="2"/><circle cx="9" cy="7" r="2.4" fill="#fff" opacity=".5"/></svg>`;
  }

  /* Belohnungs-/Forscherbuch-Kleinkram */
  function sizeIcon(size) {
    const s = { klein: 0.45, mittel: 0.7, gross: 1 }[size];
    return `<svg viewBox="0 0 160 190" class="size-ico" aria-hidden="true"><g transform="translate(${80 - 80 * s} ${190 - 190 * s}) scale(${s})" filter="url(#f-paint)">${SHROOMS.champignon()}</g></svg>`;
  }

  MW.Art = { C, myra, bruno, fips, lila, mystery, shroom, pic, hintIcon, HINT_ICONS, icon, signIcon, plank, lightOrb, symbol, gardenItem, homeScene, mapScene, MAP_LAYOUT, gateScene, GATE_STONES, gardenScene, sizeIcon, SHROOMS, workshopScene, workshopSheet, workPiece, bracketLog, roof, underIcon, villageScene, mistForest, sitArt, stageArt, needArt, labScene, festScene, certFrame, wallNode, pin, WALL_POS };
})();
