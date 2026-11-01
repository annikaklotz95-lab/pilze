/* =========================================================================
   Lerninhalte (fachlich geprüft, kindgerecht)
   -------------------------------------------------------------------------
   Texte nach Differenzierungsstufe:
     entdecker – sehr kurz, bildgestützt
     forscher  – Standard
     experte   – etwas mehr Sachinformation
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});

  const chapters = [
    { id: 1, title: 'Das geheimnisvolle Waldtor', mapLabel: ['Das Waldtor'], built: true, screen: 'mission1', reward: 3,
      goal: 'Vorwissen aktivieren, typische Merkmale von Pilzen kennenlernen' },
    { id: 2, title: 'Die Pilzwerkstatt', mapLabel: ['Pilzwerkstatt'], built: true, screen: 'mission2', host: 'bruno', reward: 3,
      goal: 'Aufbau eines Hutpilzes: Hut, Stiel, Lamellen/Röhren, Myzel' },
    { id: 3, title: 'Das Dorf der hundert Hüte', mapLabel: ['Dorf der', 'hundert Hüte'], built: true, screen: 'mission3', host: 'fips', reward: 3,
      goal: 'Pilzarten anhand sichtbarer Merkmale vergleichen' },
    { id: 4, title: 'Der Wald der Verwechslungen', mapLabel: ['Wald der', 'Verwechslungen'], built: true, screen: 'mission4', host: 'fips', reward: 3,
      goal: 'Sicherheit im Umgang mit Wildpilzen' },
    { id: 5, title: 'Myras Forscherlabor', mapLabel: ['Forscherlabor'], built: true, screen: 'mission5', host: 'myra', reward: 3,
      goal: 'Wachstum beobachten, dokumentieren, vergleichen' },
    { id: 6, title: 'Das große Pilzfest', mapLabel: ['Das Pilzfest'], built: true, screen: 'mission6', host: 'myra', reward: 4,
      goal: 'Wiederholen, anwenden, reflektieren; Urkunde' }
  ];

  /* ---- Mission 1: Wer bin ich? ---------------------------------------- */
  const mission1 = {
    showCardsAfter: 2, // Bildkarten erscheinen nach dem 2. Hinweis
    hints: [
      { icon: 'notboth',
        entdecker: 'Ich bin kein Tier. Und ich bin keine Pflanze.',
        forscher: 'Ich bin kein Tier. Und ich bin auch keine Pflanze.',
        experte: 'Ich bin kein Tier und keine Pflanze. Ich gehöre zu einer ganz eigenen Gruppe.' },
      { icon: 'threads',
        entdecker: 'Ein Teil von mir ist unter der Erde versteckt.',
        forscher: 'Ein großer Teil von mir ist versteckt. Er wächst unter der Erde – wie ganz feine Fäden.',
        experte: 'Mein größter Teil ist unsichtbar. Feine Fäden wachsen im Boden oder im Holz.' },
      { icon: 'hat',
        entdecker: 'Ich habe oft einen Hut.',
        forscher: 'Oben habe ich oft einen Hut. Darunter ist ein Stiel.',
        experte: 'Was man von mir sieht, hat oft einen Hut und einen Stiel. Aber nicht immer!' },
      { icon: 'many',
        entdecker: 'Es gibt mich in vielen Formen und Farben.',
        forscher: 'Es gibt ganz viele verschiedene Arten von mir.',
        experte: 'Es gibt sehr viele Arten von mir. Manche sind giftig.' },
      { icon: 'shade',
        entdecker: 'Ich mag es feucht und schattig.',
        forscher: 'Ich bin nicht grün. Ich brauche kein Sonnenlicht zum Wachsen. Ich mag es feucht.',
        experte: 'Ich bin nicht grün und brauche kein Sonnenlicht zum Wachsen. Im Herbst siehst du mich oft im Wald.' }
    ],
    options: {
      pilz: { label: 'Pilz', correct: true },
      schnecke: { label: 'Schnecke', why: 'Eine Schnecke ist ein Tier. Unser Bewohner ist kein Tier.' },
      farn: { label: 'Farn', why: 'Ein Farn ist eine Pflanze. Er hat grüne Blätter und braucht Licht.' },
      eichel: { label: 'Eichel', why: 'Die Eichel hat ein kleines Hütchen! Aber sie ist die Frucht von einem Baum. Sie gehört zu einer Pflanze.' }
    },
    optionsByLevel: {
      entdecker: ['pilz', 'schnecke', 'farn'],
      forscher: ['pilz', 'schnecke', 'farn', 'eichel'],
      experte: ['pilz', 'schnecke', 'farn', 'eichel']
    },
    // Abschlussfrage (nicht für Entdecker)
    bonus: {
      question: 'Weißt du noch? Welcher Teil von mir wächst unter der Erde?',
      byLevel: { forscher: ['myzel', 'wurzeln'], experte: ['myzel', 'wurzeln', 'hut'] },
      options: {
        myzel: { label: 'Feine Fäden', correct: true },
        wurzeln: { label: 'Wurzeln', why: 'Wurzeln haben Pflanzen. Bei Pilzen sind es ganz feine Fäden.' },
        hut: { label: 'Hut', why: 'Der Hut ist oben, über der Erde. Schau einmal, was unten in der Erde ist.' }
      }
    }
  };

  /* ---- Mission 2: Die Pilzwerkstatt ---------------------------------- */
  // Stufe 1 = Entdecker, Stufe 2 = Forscher, Stufe 3 = Pilzexperte
  const mission2 = {
    levels: {
      entdecker: { parts: ['hut', 'stiel'], pre: ['roehren'], labels: ['hut', 'stiel'], distractors: [], classify: null },
      forscher: { parts: ['hut', 'roehren', 'stiel'], pre: [], labels: ['hut', 'roehren', 'stiel'], distractors: ['lamellen'], classify: null },
      experte: { parts: ['hut', 'roehren', 'stiel', 'myzel'], pre: [], labels: ['hut', 'roehren', 'stiel'], distractors: ['lamellen'], classify: { words: ['fruchtkoerper', 'myzel'], distractors: ['wurzeln'] } }
    },
    words: { hut: 'Hut', roehren: 'Röhren', stiel: 'Stiel', lamellen: 'Lamellen', fruchtkoerper: 'Fruchtkörper', myzel: 'Myzel', wurzeln: 'Wurzeln' },
    // Wort → Schild im Bild
    slotFor: { hut: 'l-hut', roehren: 'l-roehren', stiel: 'l-stiel', fruchtkoerper: 'c-fk', myzel: 'c-my' },
    // Rückmeldung beim Zusammensetzen
    placed: {
      hut: 'Der Hut sitzt ganz oben.',
      roehren: 'Unter dem Hut sind die Röhren.',
      stiel: 'Der Stiel trägt den Hut.',
      myzel: 'Die feinen Pilzfäden wachsen in der Erde.'
    },
    hintPart: {
      hut: 'Der Hut ist oben. Er ist rund wie ein Dach.',
      roehren: 'Schau einmal unter den Hut. Was entdeckst du?',
      stiel: 'Der Stiel ist in der Mitte. Er steht auf dem Boden.',
      myzel: 'Die feinen Fäden sind versteckt – unter der Erde.'
    },
    hintWord: {
      lamellen: 'Lamellen sind ganz dünne Blättchen. Bruno hat unter dem Hut Röhren – wie ein Schwamm.',
      wurzeln: 'Wurzeln haben Pflanzen. Die feinen Fäden vom Pilz heißen Myzel.',
      fruchtkoerper: 'Der Fruchtkörper ist alles, was über der Erde wächst: Hut, Röhren und Stiel.',
      myzel: 'Das Myzel wächst unter der Erde.',
      _: 'Folge der Linie. Zu welchem Teil zeigt sie?'
    }
  };

  /* ---- Fotos -----------------------------------------------------------
     Dateien liegen in assets/fotos/. Punkte (spots) in Prozent der Bildbreite/-höhe.
     WICHTIG für die Veröffentlichung: Quelle und Lizenz eintragen (credit, license, source).
  */
  const photos = {
    steinpilz: {
      file: 'assets/fotos/steinpilz.webp', species: 'steinpilz', caption: 'Echte Steinpilze',
      alt: 'Foto: ein großer und ein junger Steinpilz', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[59, 15], [64, 22]], roehren: [[79, 38], [34, 38]], stiel: [[59, 62], [60, 75]], jung: [[26, 60]] }
    },
    laengsschnitt: {
      file: 'assets/fotos/laengsschnitt.webp', species: null, caption: 'Ein Röhrenpilz, aufgeschnitten',
      alt: 'Foto: ein Röhrenpilz der Länge nach aufgeschnitten', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[51, 8]], roehren: [[21, 23], [82, 21]], stiel: [[51, 62]] }
    },
    fliegenpilz: {
      file: 'assets/fotos/fliegenpilz.webp', species: 'fliegenpilz', caption: 'Fliegenpilz – giftig!',
      alt: 'Foto: Fliegenpilz mit rotem Hut und weißen Flocken', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[50, 15], [27, 20], [72, 19]], unten: [[50, 32], [29, 31]], ring: [[26, 43], [65, 39]], stiel: [[46, 71]] }
    },
    champignon: {
      file: 'assets/fotos/champignon.webp', species: 'champignon', caption: 'Junger Champignon: Die Lamellen sind noch unter einer Haut versteckt.',
      alt: 'Foto: junger weißer Zuchtchampignon', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[44, 34], [26, 51]], unten: [[50, 62], [74, 51]], stiel: [[81, 78]] }
    },
    maronenroehrling: {
      file: 'assets/fotos/maronenroehrling.webp', species: 'maronenroehrling', caption: 'Maronenröhrling im Moos',
      alt: 'Foto: Maronenröhrling mit glänzend braunem Hut und gelblichen Röhren', credit: 'Wikimedia Commons (Urheber bitte ergänzen)', license: 'CC BY-SA – bitte auf der Dateiseite prüfen', source: 'commons.wikimedia.org',
      spots: { hut: [[48, 31]], unten: [[51, 43], [30, 46]], stiel: [[51, 60]] }
    },
    pfifferling: {
      file: 'assets/fotos/pfifferling.webp', species: 'pfifferling', caption: 'Pfifferlinge im Moos',
      alt: 'Foto: drei gelbe Pfifferlinge mit Leisten unter dem Hut', credit: 'Wikimedia Commons (Urheber bitte ergänzen)', license: 'CC BY-SA – bitte auf der Dateiseite prüfen', source: 'commons.wikimedia.org',
      spots: { hut: [[30, 40], [65, 43], [80, 48]], unten: [[28, 63], [62, 51], [75, 51]], stiel: [[62, 67], [74, 67], [30, 77]] }
    },
    knollenblaetterpilz: {
      file: 'assets/fotos/knollenblaetterpilz.webp', species: null, caption: 'Grüner Knollenblätterpilz – tödlich giftig!',
      alt: 'Foto: Grüner Knollenblätterpilz mit grünlichem Hut, Ring und Knolle am Stielfuß', credit: 'Pixabay (bitte bestätigen)', license: 'Pixabay-Inhaltslizenz', source: 'pixabay.com',
      spots: { knolle: [[50, 92], [50, 86]] }
    },
    gallenroehrling: {
      file: 'assets/fotos/gallenroehrling.webp', species: null, caption: 'Gallenröhrling – sehr bitter',
      alt: 'Foto: Gallenröhrling mit hellbraunem Hut und dunklem Netz am Stiel', credit: 'Pixabay (bitte bestätigen)', license: 'Pixabay-Inhaltslizenz', source: 'pixabay.com', spots: { netz: [[46, 62]] }
    },
    falscherpfifferling: {
      file: 'assets/fotos/falscher-pfifferling.webp', species: null, caption: 'Falscher Pfifferling – kann Bauchweh machen',
      alt: 'Foto: Falscher Pfifferling, orange, mit dünnen Lamellen', credit: 'Pixabay (bitte bestätigen)', license: 'Pixabay-Inhaltslizenz', source: 'pixabay.com', spots: {}
    },
    lamellenpilz: {
      file: 'assets/fotos/lamellenpilz.webp', species: null, caption: 'Ein Pilz mit Lamellen',
      alt: 'Foto: ein Pilz mit Lamellen und Ring',
      // Art bewusst nicht benannt: weiße Lamellen, geriefter Ring – vermutlich ein Wulstling. Nicht als Champignon verwenden!
      credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[47, 10]], lamellen: [[81, 32], [21, 26], [66, 28]], ring: [[55, 41]], stiel: [[49, 68]] }
    },
    pilzmyzel: {
      file: 'assets/fotos/pilz-mit-myzel.webp', species: null, caption: 'Ein kleiner Pilz wächst aus dem Myzel',
      alt: 'Foto: kleiner Pilz auf Holz, am Stielfuß weißes Myzel', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com',
      spots: { hut: [[62, 17]], lamellen: [[54, 28], [73, 28]], stiel: [[60, 56]], myzel: [[41, 86], [22, 90], [66, 82]] }
    },
    myzelholz: {
      file: 'assets/fotos/myzel-holz.webp', species: null, caption: 'Myzel unter der Rinde',
      alt: 'Foto: weiße, verzweigte Pilzfäden auf Holz unter der Rinde', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com', spots: {}
    },
    baumpilz: {
      file: 'assets/fotos/baumpilz.webp', species: null, caption: 'Baumpilz am Stamm',
      alt: 'Foto: Baumpilz wächst wie ein Regal am Baumstamm', credit: 'Bildmaterial: Canva', license: 'Canva-Inhaltslizenz (Canva for Education)', source: 'canva.com', spots: {}
    }
  };

  /* ---- Mission 2: Am echten Pilz entdecken (Foto-Aufgaben) ---------------- */
  const mission2Photo = {
    byLevel: {
      entdecker: [['steinpilz', 'hut'], ['steinpilz', 'stiel']],
      forscher: [['steinpilz', 'hut'], ['steinpilz', 'roehren'], ['steinpilz', 'stiel'], ['laengsschnitt', 'schnitt'], ['lamellenpilz', 'lamellen']],
      experte: [['steinpilz', 'hut'], ['steinpilz', 'roehren'], ['steinpilz', 'stiel'], ['laengsschnitt', 'schnitt'], ['lamellenpilz', 'lamellen'], ['steinpilz', 'zaehlen'], ['pilzmyzel', 'myzel'], ['myzelholz', 'show']]
    },
    spotKey: { schnitt: 'roehren' },
    ask: {
      hut: 'Das ist ein Foto von echten Steinpilzen. Wo ist der Hut? Tippe darauf.',
      roehren: 'Wo siehst du die Röhren? Sie sind unter dem Hut – hell wie ein Schwamm.',
      stiel: 'Und wo ist der Stiel?',
      schnitt: 'Dieser Röhrenpilz ist aufgeschnitten. Wo sind die Röhren? Tippe darauf.',
      lamellen: 'Dieser Pilz hat keine Röhren. Er hat Lamellen. Tippe auf die Lamellen.',
      zaehlen: 'Wie viele Fruchtkörper siehst du auf dem Steinpilz-Foto?',
      myzel: 'Hier siehst du, wo ein kleiner Pilz herauswächst. Wo ist das Myzel?',
      show: 'So sieht Myzel unter der Rinde aus: ganz viele feine, weiße Fäden.'
    },
    hint: {
      hut: 'Der Hut ist ganz oben. Schau mit der Lupe.',
      roehren: 'Schau ganz genau unter den Hut.',
      stiel: 'Der Stiel trägt den Hut.',
      schnitt: 'Die Röhren sind die gelbliche Schicht unter dem Hut – links und rechts vom Stiel.',
      lamellen: 'Die Lamellen sind unter dem Hut. Sie sehen aus wie ganz dünne Blättchen.',
      myzel: 'Das Myzel ist weiß und flauschig – ganz unten am Stiel.'
    },
    found: {
      hut: 'Ja, das ist der Hut.',
      roehren: 'Genau. Das sind die Röhren – ganz viele winzige Löcher.',
      stiel: 'Richtig, das ist der Stiel.',
      schnitt: 'Genau! Im Schnitt siehst du: Die Röhren stehen dicht nebeneinander wie kleine Strohhalme.',
      lamellen: 'Genau, das sind Lamellen. Den Namen dieses Pilzes verraten wir nicht – Pilze bestimmen nur Fachleute.',
      myzel: 'Genau! Aus dem Myzel wächst der Fruchtkörper.'
    },
    labels: { hut: 'Hut', roehren: 'Röhren', stiel: 'Stiel', schnitt: 'Röhren', lamellen: 'Lamellen', myzel: 'Myzel' },
    checklist: { schnitt: 'Röhren im Schnitt', zaehlen: 'Fruchtkörper zählen', show: 'Myzel anschauen' },
    count: { options: [1, 2, 3], right: 2, yes: 'Genau, zwei: ein großer und ein junger Steinpilz. Fruchtkörper wachsen oft in Gruppen.', no: 'Zähle noch einmal die Hüte.' }
  };

  /* ---- Mission 3: Das Dorf der hundert Hüte ----------------------------- */
  const mission3 = {
    residents: {
      entdecker: ['fliegenpilz', 'steinpilz', 'champignon'],
      forscher: ['fliegenpilz', 'steinpilz', 'pfifferling', 'champignon', 'maronenroehrling'],
      experte: ['fliegenpilz', 'steinpilz', 'pfifferling', 'champignon', 'maronenroehrling']
    },
    under: { fliegenpilz: 'lamellen', steinpilz: 'roehren', pfifferling: 'leisten', champignon: 'lamellen', maronenroehrling: 'roehren' },
    baskets: { entdecker: ['lamellen', 'roehren'], forscher: ['lamellen', 'roehren', 'leisten'], experte: ['lamellen', 'roehren', 'leisten'] },
    basketLabels: { lamellen: 'Lamellen', roehren: 'Röhren', leisten: 'Leisten' },
    basketDesc: { lamellen: 'dünne Blättchen', roehren: 'wie ein Schwamm', leisten: 'dicke Falten' },
    // kurze Merkmalsbeschreibung für Rückmeldungen beim Vergleichen
    features: {
      fliegenpilz: 'einen roten Hut mit weißen Flocken',
      steinpilz: 'einen braunen Hut und einen dicken, hellen Stiel',
      pfifferling: 'einen gelben Hut, der aussieht wie ein Trichter',
      champignon: 'einen weißen, runden Hut',
      maronenroehrling: 'einen kastanienbraunen Hut und gelbliche Röhren'
    },
    sortHint: {
      lamellen: 'Lamellen sind ganz dünne Blättchen unter dem Hut.',
      roehren: 'Röhren sehen aus wie ein Schwamm mit winzigen Löchern.',
      leisten: 'Leisten sind dicke Falten, die bis zum Stiel hinunterlaufen.'
    },
    champNote: 'Beim jungen Champignon sind die Lamellen noch unter einer Haut versteckt. Im Lexikon kannst du nachschauen.',
    riddles: {
      entdecker: [
        { text: 'Mein Hut ist rot mit weißen Flocken. Wer bin ich?', a: 'fliegenpilz' },
        { text: 'Ich bin ganz weiß und rund. Wer bin ich?', a: 'champignon' }
      ],
      forscher: [
        { text: 'Ich bin gelb wie ein Eidotter. Unter meinem Hut habe ich Leisten. Wer bin ich?', a: 'pfifferling' },
        { text: 'Mein Hut ist rot. Unter dem Hut habe ich Lamellen. Wer bin ich?', a: 'fliegenpilz' },
        { text: 'Ich bin weiß. Man kann mich züchten – so wie ihr in der Klasse. Wer bin ich?', a: 'champignon' }
      ],
      experte: [
        { text: 'Ich habe Röhren. Mein Stiel ist dick und hat oben ein feines Netz. Wer bin ich?', a: 'steinpilz' },
        { text: 'Ich habe gelbliche Röhren. Drückt man darauf, werden sie blau. Wer bin ich?', a: 'maronenroehrling' },
        { text: 'Ich habe Lamellen und einen Ring am Stiel. Man kann mich züchten. Wer bin ich?', a: 'champignon' }
      ]
    },
    transfer: {
      q: 'Fips findet einen Pilz mit Röhren unter dem Hut. Kann das ein Fliegenpilz sein?',
      options: [
        { id: 'nein', label: 'Nein', right: true, why: 'Richtig. Der Fliegenpilz hat Lamellen – keine Röhren.' },
        { id: 'ja', label: 'Ja', why: 'Schau noch einmal: Was hat der Fliegenpilz unter dem Hut?' }
      ]
    }
  };

  /* ---- Mission 4: Der Wald der Verwechslungen ---------------------------
     Keine Aufgabe verlangt, anhand eines Fotos über Essbarkeit zu entscheiden.
     Die Kinder üben sichere Entscheidungen in Alltagssituationen.
  */
  const mission4 = {
    byLevel: {
      entdecker: ['spielplatz', 'laden', 'haende'],
      forscher: ['spielplatz', 'laden', 'farbe', 'haende', 'oma'],
      experte: ['laden', 'farbe', 'oma', 'schnecke', 'notfall']
    },
    situations: {
      spielplatz: { art: 'spielplatz', text: 'Auf dem Spielplatz wächst ein kleiner weißer Pilz. Fips hat Hunger. Was soll er tun?', easy: 'Auf dem Spielplatz wächst ein Pilz. Was soll Fips tun?',
        options: [
          { id: 'probieren', icon: 'mund', label: 'Ein kleines Stück probieren', why: 'Nein! Auch ein kleines Stück von einem Giftpilz kann sehr gefährlich sein.' },
          { id: 'bescheid', icon: 'erwachsen', label: 'Nicht essen und einem Erwachsenen Bescheid sagen', right: true, why: 'Genau. Unbekannte Pilze essen wir nie. Ein Erwachsener weiß, was zu tun ist.' }] },
      laden: { art: 'champi', text: 'Im Wald steht ein Pilz. Er sieht aus wie ein Champignon aus dem Supermarkt. Darf Fips ihn essen?', easy: 'Der Pilz sieht aus wie aus dem Laden. Darf Fips ihn essen?', pair: 'champ',
        options: [
          { id: 'ja', icon: 'mund', label: 'Ja, der ist bestimmt essbar', why: 'Vorsicht! Manche giftigen Pilze sehen Champignons sehr ähnlich.' },
          { id: 'nein', icon: 'stopp', label: 'Nein. Es könnte ein giftiger Doppelgänger sein', right: true, why: 'Richtig. Schau mal, wie ähnlich sie sich sehen.' }] },
      farbe: { art: 'farbe', text: 'Fips sagt: „Bunte Pilze sind giftig. Braune Pilze kann man essen.“ Stimmt das?', easy: 'Kann man an der Farbe sehen, ob man einen Pilz essen darf?', pair: 'stein',
        options: [
          { id: 'stimmt', icon: 'ja', label: 'Ja, das stimmt', why: 'Leider nicht. An der Farbe erkennt man das nicht sicher.' },
          { id: 'falsch', icon: 'nein', label: 'Nein, an der Farbe erkennt man das nicht', right: true, why: 'Genau! Der rote Fliegenpilz ist giftig – aber der bunte Pfifferling nicht. Und braune Pilze können sich zum Verwechseln ähneln.' }] },
      haende: { art: 'haende', text: 'Fips hat im Wald einen Pilz angefasst. Gleich gibt es Pausenbrot. Was macht er vorher?', easy: 'Fips hat einen Pilz angefasst. Was macht er vor dem Essen?',
        options: [
          { id: 'waschen', icon: 'haende', label: 'Hände waschen', right: true, why: 'Genau. Nach dem Pilze-Anfassen waschen wir die Hände – erst dann wird gegessen.' },
          { id: 'weiter', icon: 'mund', label: 'Einfach weiteressen', why: 'Lieber nicht. Erst Hände waschen, dann essen.' }] },
      oma: { art: 'oma', text: 'Oma hat im Wald Pilze gesammelt. Sie ist sich nicht ganz sicher, welche es sind. Was ist richtig?', easy: 'Oma ist sich bei ihren Pilzen nicht sicher. Was tut sie?',
        options: [
          { id: 'beratung', icon: 'lupe', label: 'Sie zeigt die Pilze einer Pilzberatung', right: true, why: 'Richtig. Pilzsachverständige prüfen Pilze ganz genau.' },
          { id: 'kochen', icon: 'topf', label: 'Sie kocht die Pilze trotzdem', why: 'Nein. Auch Kochen macht Giftpilze nicht ungiftig.' },
          { id: 'probe', icon: 'mund', label: 'Sie probiert erst einen', why: 'Nein. Probieren ist gefährlich – manche Gifte merkt man erst viel später.' }] },
      schnecke: { art: 'schnecke', text: 'An einem Pilz knabbert eine Schnecke. Fips meint: „Dann kann ich ihn auch essen!“ Stimmt das?', easy: 'Eine Schnecke isst einen Pilz. Darf Fips ihn dann auch essen?',
        options: [
          { id: 'ja', icon: 'ja', label: 'Ja, das stimmt', why: 'Nein! Tiere vertragen manche Pilze, die für Menschen giftig sind.' },
          { id: 'nein', icon: 'nein', label: 'Nein, das sagt gar nichts', right: true, why: 'Genau. Schnecken fressen sogar manche Giftpilze. Für uns Menschen sagt das nichts.' }] },
      notfall: { art: 'notfall', text: 'Ein Freund von Fips hat ein Stück von einem unbekannten Pilz gegessen. Was tust du?', easy: 'Ein Freund hat einen Pilz gegessen. Was tust du?',
        options: [
          { id: 'sagen', icon: 'erwachsen', label: 'Sofort einem Erwachsenen Bescheid sagen', right: true, why: 'Genau richtig. Der Erwachsene ruft den Giftnotruf oder die 112 an.' },
          { id: 'warten', icon: 'uhr', label: 'Abwarten, ob er Bauchweh bekommt', why: 'Nein. Nicht abwarten! Sofort einem Erwachsenen Bescheid sagen.' }] }
    },
    pairs: {
      champ: { a: 'champignon', b: 'knollenblaetterpilz', labelA: 'Champignon aus dem Laden', labelB: 'Grüner Knollenblätterpilz – tödlich giftig!',
        say: 'Sie sehen sich ähnlich. Der rechte ist ein Knollenblätterpilz. Er ist einer der gefährlichsten Giftpilze.',
        expert: { photo: 'knollenblaetterpilz', spot: 'knolle', ask: 'Fachleute achten auf viele Kleinigkeiten, zum Beispiel auf die Knolle am Stielfuß. Findest du sie?', found: 'Genau, das ist die Knolle. Aber Achtung: Sicher bestimmen können Pilze trotzdem nur Fachleute.' } },
      stein: { a: 'steinpilz', b: 'gallenroehrling', labelA: 'Steinpilz', labelB: 'Gallenröhrling – sehr bitter',
        say: 'Beide sind braun und haben Röhren. Der Gallenröhrling schmeckt so bitter, dass ein einziger das ganze Essen verdirbt.',
        extra: { a: 'pfifferling', b: 'falscherpfifferling', labelA: 'Pfifferling', labelB: 'Falscher Pfifferling', say: 'Auch diese beiden sind gelb-orange und sehen sich ähnlich. Der Falsche Pfifferling kann Bauchweh machen.' } }
    },
    rules: {
      entdecker: { pick: [
        { id: 'gut', text: 'Unbekannte Pilze esse ich nie.', right: true },
        { id: 'schlecht', text: 'Schöne Pilze darf ich essen.', why: 'Nein! Auch schöne Pilze können giftig sein.' }] },
      forscher: { sentences: [['Unbekannte Pilze', 'darf ich', 'niemals essen.']] },
      experte: { sentences: [['Unbekannte Pilze', 'darf ich', 'niemals essen.'], ['Wildpilze', 'bestimmen nur', 'Fachleute.']] }
    }
  };

  /* ---- Mission 5: Myras Forscherlabor ---------------------------------
     Allgemeine Wachstumsstufen (Sachwissen) – keine erfundenen Werte.
     Vergleiche nutzen ausschließlich echte Forscherbuch-Einträge.
  */
  const mission5 = {
    stages: {
      entdecker: ['myzel', 'knopf', 'offen'],
      forscher: ['myzel', 'koepfchen', 'knopf', 'offen'],
      experte: ['myzel', 'koepfchen', 'knopf', 'offen']
    },
    stageInfo: {
      myzel: { label: 'Weiße Fäden', text: 'Zuerst wächst das Myzel. Weiße Fäden ziehen durch die Erde.' },
      koepfchen: { label: 'Winzige Köpfchen', text: 'Dann bilden sich winzige weiße Köpfchen – so klein wie Stecknadelköpfe.' },
      knopf: { label: 'Kleiner Pilz', text: 'Die Köpfchen wachsen zu kleinen, runden Pilzen. Der Hut ist noch geschlossen.' },
      offen: { label: 'Großer Pilz', text: 'Später öffnet sich der Hut. Jetzt sieht man die Lamellen. Sie werden dunkelbraun.' }
    },
    needs: {
      entdecker: null,
      forscher: { yes: ['feucht', 'erde'], no: ['sonne'] },
      experte: { yes: ['feucht', 'erde', 'luft'], no: ['sonne', 'hitze'] }
    },
    needInfo: {
      feucht: { label: 'Feuchtigkeit', why: 'Ja. Champignons brauchen es feucht. Die Erde darf aber nicht nass sein.' },
      erde: { label: 'Nährboden', why: 'Ja. Im Nährboden findet das Myzel seine Nahrung.' },
      luft: { label: 'Frische Luft', why: 'Ja. Pilze brauchen frische Luft.' },
      sonne: { label: 'Sonnenlicht', why: 'Pilze sind keine Pflanzen. Sie brauchen kein Sonnenlicht zum Wachsen.' },
      hitze: { label: 'Große Hitze', why: 'Nein. Bei großer Hitze trocknen Champignons aus. Normale Zimmerwärme ist gut.' }
    }
  };

  /* ---- Mission 6: Das große Pilzfest ---------------------------------- */
  const mission6 = {
    stations: ['bruno', 'fips', 'safety', 'lila'],
    reflect: [
      { id: 'teile', label: 'Wie ein Pilz aufgebaut ist' },
      { id: 'arten', label: 'Verschiedene Pilzarten' },
      { id: 'regel', label: 'Die Pilzregel' },
      { id: 'zucht', label: 'Wie Champignons wachsen' }
    ],
    mood: [{ id: 'super', label: 'Super' }, { id: 'gut', label: 'Gut' }, { id: 'geht', label: 'Geht so' }]
  };

  /* ---- Wissenswand: Vorwissen sammeln --------------------------------- */
  const vorwissen = {
    impulses: [
      'Was ist ein Pilz?',
      'Wo wachsen Pilze?',
      'Wie sieht ein Pilz aus?',
      'Welche Pilze kennst du?',
      'Kann man Pilze essen?',
      'Ist ein Pilz eine Pflanze?',
      'Wie wachsen Pilze?'
    ],
    colors: ['#F3DD8E', '#CFE0B8', '#F2C6B4', '#D9C7E0', '#C8DDE6'],
    status: {
      stimmt: { label: 'Stimmt', icon: 'ja' },
      falsch: { label: 'Stimmt nicht', icon: 'nein' },
      offen: { label: 'Wissen wir noch nicht', icon: 'lupe' }
    }
  };

  /* ---- Pilzarten (Lexikon; später Mission 3) --------------------------- */
  const species = [
    { id: 'fliegenpilz', under: 'Lamellen', name: 'Fliegenpilz', tag: 'giftig',
      parts: {
        hut: 'Sein Hut ist rot mit weißen Flocken. Regen kann die Flocken abwaschen.',
        unten: 'Unter dem Hut hat er weiße Lamellen. Das sind ganz dünne Blättchen.',
        stiel: 'Der Stiel ist weiß. Oben hat er einen Ring, unten eine dicke Knolle.'
      },
      where: 'Er wächst oft bei Birken und Fichten.',
      note: 'Der Fliegenpilz ist giftig.' },
    { id: 'steinpilz', under: 'Röhren', name: 'Steinpilz', tag: 'speise',
      parts: {
        hut: 'Sein Hut ist braun – wie ein frisch gebackenes Brötchen.',
        unten: 'Unter dem Hut hat er Röhren. Das sieht aus wie ein Schwamm.',
        stiel: 'Sein Stiel ist dick und hell. Oben siehst du ein feines Netz.'
      },
      where: 'Er wächst im Wald, oft bei Fichten, Kiefern, Buchen oder Eichen.',
      note: 'Bruno ist ein Steinpilz!' },
    { id: 'pfifferling', under: 'Leisten', name: 'Pfifferling', tag: 'speise',
      parts: {
        hut: 'Er ist dottergelb. Sein Hut sieht aus wie ein kleiner Trichter.',
        unten: 'Unter dem Hut hat er Leisten. Sie laufen bis zum Stiel hinunter.',
        stiel: 'Hut und Stiel gehen ohne Grenze ineinander über.'
      },
      where: 'Er wächst gern im Moos, oft bei Fichten und Buchen.' },
    { id: 'champignon', under: 'Lamellen', name: 'Champignon', tag: 'zucht',
      parts: {
        hut: 'Sein Hut ist weiß oder hellbraun und rund.',
        unten: 'Darunter sind Lamellen. Erst sind sie rosa, später dunkelbraun.',
        stiel: 'Der Stiel ist kurz und hat einen kleinen Ring.'
      },
      where: 'Champignons kann man züchten – so wie wir in der Klasse.' },
    { id: 'maronenroehrling', under: 'Röhren', name: 'Maronenröhrling', tag: 'speise',
      parts: {
        hut: 'Sein Hut ist braun wie eine Kastanie.',
        unten: 'Unter dem Hut hat er gelbe Röhren. Drückt man darauf, werden sie blau.',
        stiel: 'Sein Stiel ist schlank und braun gestreift.'
      },
      where: 'Er wächst gern bei Kiefern und Fichten.' }
  ];
  const tags = {
    giftig: { label: 'Giftig', cls: 'tag-gift' },
    speise: { label: 'Speisepilz', cls: 'tag-speise' },
    zucht: { label: 'Zuchtpilz', cls: 'tag-zucht' }
  };
  const partLabels = { hut: 'Hut', unten: 'Unter dem Hut', stiel: 'Stiel' };
  const sporeLine = 'Hier entstehen die Sporen. Aus ihnen können neue Pilze wachsen.';
  const safetyRule = 'Unbekannte Pilze darfst du niemals essen. Wildpilze bestimmen nur Fachleute.';

  /* ---- Mein Wald: freischaltbare Elemente ------------------------------ */
  const gardenItems = [
    { id: 'blume', label: 'Waldblumen', cost: 1 },
    { id: 'farn', label: 'Farn', cost: 1 },
    { id: 'stein', label: 'Moosstein', cost: 1 },
    { id: 'stumpf', label: 'Baumstumpf', cost: 2 },
    { id: 'laterne', label: 'Waldlaterne', cost: 2 },
    { id: 'haus', label: 'Pilzhäuschen', cost: 3 }
  ];

  /* ---- Forscherbuch (echte Champignonzucht) ---------------------------- */
  const journal = {
    sizes: [{ id: 'klein', label: 'klein' }, { id: 'mittel', label: 'mittel' }, { id: 'gross', label: 'groß' }],
    changes: [
      { id: 'faeden', label: 'Weiße Fäden' },
      { id: 'koepfchen', label: 'Kleine Köpfchen' },
      { id: 'neu', label: 'Neue Pilze' },
      { id: 'groesser', label: 'Größer geworden' },
      { id: 'hutoffen', label: 'Hut geöffnet' },
      { id: 'nichts', label: 'Nichts verändert' }
    ],
    crayons: ['#5A4231', '#B8674A', '#E9C776', '#526F55', '#A7BA9A', '#F6EEDF']
  };

  /* ---- anonyme Forscherprofile ---------------------------------------- */
  const profileSymbols = [
    { id: 'eichel', noun: 'Eichel', g: 'f' }, { id: 'blatt', noun: 'Blatt', g: 'n' },
    { id: 'feder', noun: 'Feder', g: 'f' }, { id: 'beere', noun: 'Beere', g: 'f' },
    { id: 'schneckenhaus', noun: 'Schneckenhaus', g: 'n' }, { id: 'zapfen', noun: 'Tannenzapfen', g: 'm' }
  ];
  const profileColors = [
    { id: 'gelb', adj: 'gelb', hex: '#E9C776' }, { id: 'rot', adj: 'rot', hex: '#D08A6E' },
    { id: 'gruen', adj: 'grün', hex: '#A7BA9A' }, { id: 'rosa', adj: 'rosa', hex: '#CDA9AE' },
    { id: 'blau', adj: 'blau', hex: '#A9BFCA' }, { id: 'braun', adj: 'braun', hex: '#C9AE8E' }
  ];
  function profileName(symId, colId) {
    const s = profileSymbols.find((x) => x.id === symId);
    const c = profileColors.find((x) => x.id === colId);
    if (!s || !c) return 'Forscherkind';
    if (c.adj === 'rosa') return `${s.g === 'm' ? 'Der' : s.g === 'n' ? 'Das' : 'Die'} rosa ${s.noun}`;
    const end = { f: 'e', n: 'es', m: 'er' }[s.g];
    const adj = c.adj.charAt(0).toUpperCase() + c.adj.slice(1) + end;
    return `${adj} ${s.noun}`;
  }

  const levels = [
    { id: 'entdecker', label: 'Entdecker', desc: 'Bildgestützt, höchstens drei Auswahlbilder, sehr kurze Sätze.' },
    { id: 'forscher', label: 'Forscher', desc: 'Bild-Wort-Zuordnungen, kurze Sachinfos, eigene Entscheidungen.' },
    { id: 'experte', label: 'Pilzexperte', desc: 'Mehr Sachinformation, zusätzliche Transferfrage.' }
  ];

  MW.Content = { vorwissen, chapters, mission1, mission2, mission3, mission4, mission5, mission6, mission2Photo, photos, species, tags, partLabels, sporeLine, safetyRule, gardenItems, journal, profileSymbols, profileColors, profileName, levels };
})();
