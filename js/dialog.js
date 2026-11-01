/* =========================================================================
   Charakterdialoge
   -------------------------------------------------------------------------
   Jede Zeile: { who, state, text }  –  who: myra | bruno | fips | lila | mystery
   state: neutral | happy | thinking | encouraging
   Kurze Abschnitte, keine Lobformel-Lawinen.
   ========================================================================= */
(function () {
  const MW = (window.MW = window.MW || {});
  const L = (who, state, text) => ({ who, state, text });

  MW.Dialog = {
    names: { myra: 'Myra', bruno: 'Bruno', fips: 'Fips', lila: 'Lila', mystery: 'Geheimnisvolle Stimme' },

    home: {
      first: [
        L('myra', 'happy', 'Oh, hallo! Wie schön, dass du da bist!'),
        L('myra', 'neutral', 'Ich bin Myra. In unserem Pilzwald gibt es so viel zu entdecken.'),
        L('myra', 'encouraging', 'Hilfst du mir? Tippe auf den Wegweiser „Abenteuer“.')
      ],
      back: [L('myra', 'happy', 'Schön, dass du wieder da bist! Wohin gehen wir heute?')],
      task: { text: 'Tippe auf einen Wegweiser. „Abenteuer“ führt zur Waldkarte.', easy: 'Tippe auf ein Schild.' }
    },

    map: {
      first: [
        L('myra', 'neutral', 'Das ist unsere Waldkarte.'),
        L('myra', 'thinking', 'Viele Wege liegen noch im Nebel. Das Pilznetz unter der Erde ist schwach geworden.'),
        L('myra', 'encouraging', 'Am Anfang des Weges steht unsere Wissenswand. Was wisst ihr schon über Pilze? Danach geht es zum Waldtor.')
      ],
      after1: [L('myra', 'happy', 'Das Waldtor leuchtet wieder! Und der Weg zur Pilzwerkstatt ist frei.')],
      after6: [L('myra', 'happy', 'Der ganze Wald leuchtet! Danke, dass du uns geholfen hast.')],
      after5: [L('myra', 'happy', 'Mein Labor leuchtet! Und hörst du die Musik? Das große Pilzfest beginnt!')],
      after4: [L('myra', 'happy', 'Der Nebel im Wald der Verwechslungen ist weg! Jetzt kennst du die wichtigste Pilzregel.')],
      after3: [L('myra', 'happy', 'Im Dorf der hundert Hüte leuchten alle Häuser! Weiter geht es zum Wald der Verwechslungen.')],
      after2: [L('myra', 'happy', 'Brunos Werkstatt leuchtet! Der Weg zum Dorf der hundert Hüte ist frei.')],
      back: [L('myra', 'encouraging', 'Wohin möchtest du gehen? Tippe auf einen hellen Ort.')],
      locked: (prev) => [L('myra', 'thinking', `Dieser Weg liegt noch im Nebel. Hilf zuerst bei „${prev}“.`)],
      soon: {

      },
      task: { text: 'Tippe auf einen hellen Ort auf der Karte.', easy: 'Tippe auf den hellen Ort.' }
    },

    m1: {
      intro: [
        L('myra', 'neutral', 'Psst! Am Waldtor wartet jemand.'),
        L('myra', 'thinking', 'Er versteckt sich im Nebel. Und er hat seinen Namen vergessen!'),
        L('myra', 'encouraging', 'Tippe auf den leuchtenden Stein. Dann hörst du einen Hinweis.')
      ],
      cardsAppear: [
        L('myra', 'encouraging', 'Hast du schon eine Idee, wer es ist? Tippe auf ein Bild.'),
        L('myra', 'neutral', 'Oder hol dir noch einen Hinweis vom leuchtenden Stein.')
      ],
      moreHint: L('myra', 'encouraging', 'Hör dir noch einen Hinweis an.'),
      noMoreHints: L('myra', 'encouraging', 'Alle Hinweise sind da. Schau dir die Bilder noch einmal genau an.'),
      wrongIntro: L('myra', 'thinking', 'Hm, das passt noch nicht.'),
      correct: [L('myra', 'happy', 'Ja, es ist ein Pilz! Das war eine gute Beobachtung.')],
      reveal: {
        entdecker: [
          L('bruno', 'happy', 'Danke! Jetzt weiß ich es wieder: Ich bin Bruno, der Steinpilz.'),
          L('bruno', 'neutral', 'Unter der Erde habe ich ganz feine Fäden. Siehst du sie leuchten?')
        ],
        forscher: [
          L('bruno', 'happy', 'Danke! Jetzt weiß ich es wieder: Ich bin Bruno, der Steinpilz.'),
          L('bruno', 'neutral', 'Was du von mir siehst, ist nur ein kleiner Teil von mir.'),
          L('bruno', 'neutral', 'Unter der Erde wachsen ganz feine Pilzfäden. Man nennt sie Myzel.')
        ],
        experte: [
          L('bruno', 'happy', 'Danke! Jetzt weiß ich es wieder: Ich bin Bruno, der Steinpilz.'),
          L('bruno', 'neutral', 'Mein Hut und mein Stiel heißen zusammen Fruchtkörper.'),
          L('bruno', 'neutral', 'Unter der Erde wächst ein Geflecht aus feinen Fäden. Das ist das Myzel. Es ist viel größer als der Fruchtkörper.')
        ]
      },
      bonusRight: [L('bruno', 'happy', 'Genau, die feinen Fäden. Das ist das Myzel.')],
      bonusWrongIntro: L('bruno', 'thinking', 'Schau noch einmal genau hin.'),
      outro: (lights, first) => first
        ? [L('myra', 'happy', 'Schau! Das Waldtor leuchtet wieder.'), L('myra', 'encouraging', `Dafür bekommst du ${lights} Waldlichter für deinen eigenen Wald.`)]
        : [L('myra', 'happy', 'Du hast das Rätsel wieder gelöst!'), L('myra', 'neutral', 'Deine Waldlichter leuchten schon in deinem Wald.')],
      task: {
        stone: { text: 'Tippe auf den leuchtenden Stein und hör dir den Hinweis an.', easy: 'Tippe auf den hellen Stein.' },
        guess: { text: 'Wer ist der Bewohner? Tippe auf ein Bild. Du kannst auch noch einen Hinweis hören.', easy: 'Wer ist es? Tippe auf ein Bild.' },
        bonus: { text: 'Welcher Teil vom Pilz wächst unter der Erde? Tippe auf ein Bild.', easy: 'Was ist unter der Erde? Tippe auf ein Bild.' },
        done: { text: 'Geschafft! Geh zur Waldkarte oder in deinen eigenen Wald.', easy: 'Geschafft!' }
      }
    },

    m2: {
      intro: [
        L('bruno', 'thinking', 'Oh je! Der Wind hat meine Zeichnung zerpustet.'),
        L('fips', 'happy', 'Ich bin Fips! Ich habe die Teile gefunden. Sie liegen hier auf der Werkbank.'),
        L('bruno', 'encouraging', 'Setzt du meinen Pilz wieder zusammen? Bring jedes Teil an seinen Platz.')
      ],
      wrong: L('fips', 'thinking', 'Hm, das passt noch nicht. Wollen wir genauer hinschauen?'),
      toLabels: [
        L('bruno', 'happy', 'Jetzt ist mein Pilz wieder ganz!'),
        L('bruno', 'encouraging', 'Aber die Namen fehlen noch. Bring jedes Wort auf das passende Schild.')
      ],
      wordTip: L('fips', 'encouraging', 'Tipp: Wenn du ein Wort antippst, hörst du es.'),
      toClassify: [
        L('bruno', 'neutral', 'Jetzt kommt eine Frage für Pilzexperten.'),
        L('bruno', 'encouraging', 'Was über der Erde wächst, hat einen eigenen Namen. Und das unter der Erde auch. Ordne die Wörter zu.')
      ],
      end: {
        entdecker: [
          L('bruno', 'happy', 'Danke! Meine Zeichnung ist wieder ganz.'),
          L('bruno', 'neutral', 'Oben ist der Hut. Darunter ist der Stiel.')
        ],
        forscher: [
          L('bruno', 'happy', 'Danke! Meine Zeichnung ist wieder ganz.'),
          L('bruno', 'neutral', 'Unter meinem Hut habe ich Röhren – wie ein Schwamm.'),
          L('bruno', 'neutral', 'Viele andere Pilze haben dort Lamellen. Das sind ganz dünne Blättchen.')
        ],
        experte: [
          L('bruno', 'happy', 'Danke! Das hast du genau eingeordnet.'),
          L('bruno', 'neutral', 'Hut, Röhren und Stiel sind zusammen der Fruchtkörper. Er wächst aus dem Myzel.'),
          L('bruno', 'neutral', 'Das Myzel lebt viel länger im Boden. Der Fruchtkörper ist nur kurz da.'),
          L('bruno', 'encouraging', 'In den Röhren entstehen die Sporen. Aus ihnen können neue Pilze wachsen.')
        ]
      },
      bracket: [
        L('fips', 'thinking', 'Und was wächst da am Baumstamm? Hat das gar keinen Stiel?'),
        L('bruno', 'encouraging', 'Gut beobachtet! Das sind Baumpilze. Nicht alle Pilze haben Hut und Stiel.')
      ],
      outro: (lights, first) => first
        ? [L('bruno', 'happy', `Die Werkstatt leuchtet wieder. Dafür bekommst du ${lights} Waldlichter!`)]
        : [L('bruno', 'happy', 'Du kennst dich in meiner Werkstatt jetzt richtig gut aus.')],
      task: {
        build: { text: 'Setze den Pilz zusammen. Tippe ein Teil an und dann den passenden Platz im Bild. Du kannst die Teile auch ziehen.', easy: 'Tippe ein Teil an. Dann tippe auf den Platz im Bild.' },
        label: { text: 'Bring jedes Wort auf das passende Schild. Die Linie zeigt auf den Pilzteil.', easy: 'Tippe ein Wort an. Dann tippe auf ein Schild.' },
        classify: { text: 'Wie heißt alles über der Erde? Wie heißt das Pilzgeflecht unter der Erde? Ordne die Wörter zu.', easy: 'Ordne die Wörter zu.' },
        done: { text: 'Geschafft! Geh zur Waldkarte oder in deinen Wald.', easy: 'Geschafft!' }
      }
    },

    m3: {
      intro: [
        L('fips', 'happy', 'Willkommen im Dorf der hundert Hüte! Hier wohnen viele Pilze.'),
        L('fips', 'thinking', 'Oh nein – einige Bewohner haben ihre Namen vergessen. Ihre Häuser sind ganz grau geworden.'),
        L('fips', 'encouraging', 'Bring jedem Bewohner sein Namensschild. Schau dir die Fotos genau an!')
      ],
      nameTip: L('fips', 'encouraging', 'Tipp: Wenn du ein Namensschild antippst, hörst du den Namen.'),
      wrong: L('fips', 'thinking', 'Hm, das passt noch nicht. Wollen wir genauer hinschauen?'),
      named: (name) => L('fips', 'happy', `${name} – das ist mein Name! Danke!`),
      toSort: {
        entdecker: [L('fips', 'happy', 'Alle wissen ihre Namen wieder!'), L('bruno', 'encouraging', 'Jetzt schauen wir unter die Hüte. Wer hat Lamellen, wer hat Röhren? Bring jeden Pilz in den passenden Korb.')],
        forscher: [L('fips', 'happy', 'Alle wissen ihre Namen wieder!'), L('bruno', 'encouraging', 'Jetzt schauen wir unter die Hüte: Lamellen, Röhren oder Leisten? Bring jeden Pilz in den passenden Korb.')],
        experte: [L('fips', 'happy', 'Alle wissen ihre Namen wieder!'), L('bruno', 'encouraging', 'Jetzt schauen wir unter die Hüte: Lamellen, Röhren oder Leisten? Bring jeden Pilz in den passenden Korb.')]
      },
      sorted: L('bruno', 'happy', 'Gut sortiert.'),
      toRiddle: [L('fips', 'encouraging', 'Zum Schluss ein Ratespiel! Ich beschreibe einen Bewohner. Tippe auf ihn.')],
      riddleRight: (name) => L('fips', 'happy', `Ja, das ist der ${name}!`),
      end: [
        L('fips', 'happy', 'Alle Häuser leuchten wieder!'),
        L('bruno', 'neutral', 'An Hut, Stiel und der Unterseite kannst du Pilze vergleichen.'),
        L('bruno', 'thinking', 'Aber ob man einen Wildpilz essen darf, bestimmen nur Fachleute. Unbekannte Pilze isst du niemals.')
      ],
      outro: (lights, first) => first
        ? [L('fips', 'happy', `Dafür bekommst du ${lights} Waldlichter!`)]
        : [L('fips', 'happy', 'Du kennst jetzt alle Bewohner im Dorf.')],
      task: {
        name: { text: 'Bring jedem Pilz sein Namensschild. Tippe ein Schild an und dann den Platz unter dem Foto. Du kannst auch ziehen.', easy: 'Tippe einen Namen an. Dann tippe unter das passende Foto.' },
        sort: { text: 'Lamellen, Röhren oder Leisten? Tippe einen Pilz an und dann den passenden Korb. Oder ziehe ihn.', easy: 'Tippe einen Pilz an. Dann tippe auf einen Korb.' },
        riddle: { text: 'Hör dir das Rätsel an und tippe auf den passenden Pilz.', easy: 'Hör zu und tippe auf den Pilz.' },
        done: { text: 'Geschafft! Geh zur Waldkarte oder in deinen Wald.', easy: 'Geschafft!' }
      }
    },

    m4: {
      intro: [
        L('myra', 'thinking', 'Hier im Wald der Verwechslungen ist es ganz neblig.'),
        L('fips', 'happy', 'Ich habe einen Korb dabei! Hier wachsen so viele Pilze. Darf ich die essen?'),
        L('myra', 'encouraging', 'Hilf Fips! Überlege bei jeder Frage: Was ist sicher?')
      ],
      right: L('myra', 'happy', 'Das war eine sichere Entscheidung.'),
      wrong: L('myra', 'thinking', 'Hm, das ist nicht sicher. Überleg noch einmal.'),
      pairNext: L('myra', 'neutral', 'Darum gilt: Nur Fachleute können Pilze sicher bestimmen.'),
      toRule: [
        L('myra', 'happy', 'Der Nebel ist fast weg!'),
        L('myra', 'encouraging', 'Jetzt bauen wir zusammen die wichtigste Pilzregel.')
      ],
      ruleSlotWrong: L('myra', 'thinking', 'Das Stück gehört an eine andere Stelle. Lies den Satz von vorne.'),
      ruleDone: [L('myra', 'happy', 'Das ist unsere Pilzregel. Merk sie dir gut!')],
      end: [
        L('fips', 'happy', 'Ich esse nur noch Pilze, die Erwachsene gekauft oder von Fachleuten bestimmt haben.'),
        L('myra', 'encouraging', 'Genau so. Und im Wald schauen wir Pilze nur an.')
      ],
      outro: (lights, first) => first
        ? [L('myra', 'happy', `Der Wald ist wieder klar! Dafür bekommst du ${lights} Waldlichter.`)]
        : [L('myra', 'happy', 'Du kennst die Pilzregel jetzt richtig gut.')],
      task: {
        situation: { text: 'Lies oder hör die Frage. Tippe auf die sichere Antwort.', easy: 'Tippe auf die sichere Antwort.' },
        pair: { text: 'Schau dir die beiden Pilze an. Tippe dann auf „Weiter“.', easy: 'Schau die Pilze an.' },
        rule: { text: 'Bring die Wortkarten in die richtige Reihenfolge.', easy: 'Tippe auf die richtige Regel.' },
        done: { text: 'Geschafft! Geh zur Waldkarte oder in deinen Wald.', easy: 'Geschafft!' }
      }
    },

    m5: {
      intro: [
        L('myra', 'happy', 'Willkommen in meinem Forscherlabor!'),
        L('myra', 'neutral', 'Echte Forscherinnen und Forscher beobachten ganz genau. Und sie schreiben auf, was sie wirklich sehen.'),
        L('myra', 'encouraging', 'Bei euch in der Klasse wachsen Champignons. Hier lernst du, wie sie wachsen.')
      ],
      orderTask: L('myra', 'encouraging', 'Meine Wachstumsbilder sind durcheinander. Bring sie in die richtige Reihenfolge – vom Anfang bis zum Ende.'),
      orderWrong: L('myra', 'thinking', 'Hm, das passt noch nicht. Was kommt zuerst?'),
      orderDone: L('myra', 'happy', 'Genau so wachsen Champignons. Das dauert einige Tage bis Wochen.'),
      needsTask: L('myra', 'encouraging', 'Was brauchen Champignons zum Wachsen? Sortiere die Karten.'),
      needsDone: L('myra', 'happy', 'Gut sortiert. Darum steht eure Pilzkiste nicht in der Sonne und nicht an der Heizung – und sie bleibt feucht.'),
      noEntries: [
        L('myra', 'thinking', 'Im Forscherbuch steht noch keine Beobachtung.'),
        L('myra', 'encouraging', 'Schau dir eure Champignons an. Dann trag ein, was du wirklich siehst.')
      ],
      oneEntry: [
        L('myra', 'happy', 'Du hast schon eine echte Beobachtung im Forscherbuch!'),
        L('myra', 'encouraging', 'Wenn du an einem anderen Tag wieder beobachtest, können wir vergleichen.')
      ],
      compareIntro: L('myra', 'happy', 'Du hast schon mehrere echte Beobachtungen. Jetzt vergleichen wir!'),
      compareRight: L('myra', 'happy', 'Genau. Das hast du gut abgelesen.'),
      compareWrong: L('myra', 'thinking', 'Schau noch einmal: Welcher Balken ist am höchsten?'),
      end: [L('myra', 'happy', 'Das war echte Forscherarbeit! Beobachte weiter – jeden Tag ein bisschen.')],
      outro: (lights, first) => first
        ? [L('myra', 'happy', `Mein Labor leuchtet wieder. Dafür bekommst du ${lights} Waldlichter!`)]
        : [L('myra', 'happy', 'Schön, dass du wieder im Labor warst.')],
      task: {
        order: { text: 'Bring die Bilder in die richtige Reihenfolge: Was wächst zuerst? Tippe ein Bild an und dann den Platz. Oder ziehe es.', easy: 'Was kommt zuerst? Tippe ein Bild an, dann einen Platz.' },
        needs: { text: 'Was brauchen Champignons? Bring jede Karte zu „brauchen sie“ oder „brauchen sie nicht“.', easy: 'Sortiere die Karten.' },
        observe: { text: 'Trag im Forscherbuch ein, was du an euren Champignons wirklich siehst.', easy: 'Schau die Pilze an und trag sie ein.' },
        compare: { text: 'Schau dir die Balken an. Tippe auf den Tag mit den meisten Champignons.', easy: 'Tippe auf den höchsten Balken.' },
        done: { text: 'Geschafft! Geh zur Waldkarte oder ins Forscherbuch.', easy: 'Geschafft!' }
      }
    },

    m6: {
      intro: [
        L('myra', 'happy', 'Heute ist das große Pilzfest!'),
        L('fips', 'happy', 'Alle Bewohner sind da. Aber das Fest ist noch nicht ganz fertig.'),
        L('myra', 'encouraging', 'Hilf an jeder Station. Dann leuchtet der ganze Wald!')
      ],
      stationDone: L('myra', 'happy', 'Diese Station ist fertig geschmückt!'),
      wrong: L('myra', 'thinking', 'Hm, das passt noch nicht. Schau noch einmal genau.'),
      bruno: L('bruno', 'encouraging', 'Ich hänge meine Pilzbilder auf. Tippe auf den Teil, den ich suche.'),
      fips: L('fips', 'encouraging', 'Ich habe für das Fest ein Rätsel! Hör gut zu.'),
      safety: L('myra', 'encouraging', 'Am Buffet gibt es Pilzsuppe. Fips hat auch eine Frage dazu.'),
      lila: L('lila', 'happy', 'Ich bin Lila. Ich möchte wissen: Was hast du gelernt?'),
      lilaMood: L('lila', 'happy', 'Und wie hat dir das Pilzabenteuer gefallen?'),
      lilaThanks: L('lila', 'happy', 'Danke! Das merke ich mir für die Lehrkraft.'),
      end: [
        L('myra', 'happy', 'Schau! Der ganze Wald leuchtet. Das Pilznetz ist wieder stark.'),
        L('bruno', 'happy', 'Du bist jetzt ein richtiges Forscherkind.'),
        L('fips', 'happy', 'Und dafür bekommst du eine Urkunde!')
      ],
      task: {
        station: { text: 'Tippe auf eine Station mit Fragezeichen.', easy: 'Tippe auf eine Station.' },
        done: { text: 'Das Fest ist fertig! Hol dir deine Urkunde.', easy: 'Hol dir die Urkunde.' }
      }
    },

    vorwissen: {
      first: [
        L('myra', 'happy', 'Das ist unsere Wissenswand!'),
        L('myra', 'encouraging', 'Was wisst ihr schon über Pilze? Schreibt es auf einen Zettel und heftet ihn an.'),
        L('myra', 'neutral', 'Es gibt kein Richtig oder Falsch. Später schauen wir nach, was stimmt.')
      ],
      back: [L('myra', 'encouraging', 'Was wisst ihr noch über Pilze? Schreibt es auf einen Zettel.')],
      check: [L('myra', 'thinking', 'Ihr habt schon viel geforscht! Schaut euch die Zettel noch einmal an: Stimmt das, was ihr am Anfang wusstet?')],
      added: L('myra', 'happy', 'Der Zettel hängt an der Wand!'),
      empty: L('myra', 'thinking', 'Der Zettel ist noch leer. Schreib zuerst etwas darauf.'),
      task: { text: 'Schreib auf, was du schon über Pilze weißt. Tippe dann auf „Anheften“. Tippe auf einen Zettel, um ihn vorlesen zu lassen.', easy: 'Schreib auf, was du über Pilze weißt.' }
    },

    garden: {
      first: [
        L('myra', 'happy', 'Das ist dein eigener kleiner Zauberwald.'),
        L('myra', 'neutral', 'Mit Waldlichtern kannst du Pflanzen und Dinge freischalten. Dann stellst du sie in deinen Wald.'),
        L('myra', 'thinking', 'Das hier ist ausgedacht. Echte Pilze wachsen anders – das beobachten wir im Forscherbuch.')
      ],
      empty: [L('myra', 'encouraging', 'Noch hast du keine Waldlichter. Die bekommst du im Abenteuer.')],
      back: [L('myra', 'encouraging', 'Wähle unten etwas aus. Dann tippe auf eine Stelle im Wald.')],
      task: { text: 'Wähle unten ein Teil aus. Tippe dann auf eine Stelle in deinem Wald.', easy: 'Tippe unten auf ein Bild. Dann tippe in den Wald.' }
    },

    lexikon: {
      first: [
        L('bruno', 'happy', 'Hier stelle ich dir meine Pilzfreunde vor.'),
        L('bruno', 'neutral', 'Tippe auf einen Teil vom Pilz. Dann erzähle ich dir mehr.')
      ],
      back: [L('bruno', 'neutral', 'Welchen Pilz möchtest du dir ansehen?')],
      task: { text: 'Wähle einen Pilz. Tippe dann auf Hut, Unter dem Hut oder Stiel.', easy: 'Tippe auf einen Pilz.' }
    },

    journal: {
      first: [
        L('myra', 'neutral', 'Das ist unser Forscherbuch für die echten Champignons in der Klasse.'),
        L('myra', 'thinking', 'Schreib nur auf, was du wirklich siehst. Auch „nichts verändert“ ist eine wichtige Beobachtung.')
      ],
      saved: [L('myra', 'happy', 'Deine Beobachtung ist im Forscherbuch.')],
      task: { text: 'Schau dir die Champignons an. Zähle sie, wähle die Größe und zeichne, was du siehst.', easy: 'Zähle die Pilze. Tippe dann auf Speichern.' }
    },

    profiles: {
      hello: [L('myra', 'happy', 'Hallo! Wer forscht heute? Tippe auf dein Zeichen.')],
      task: { text: 'Tippe auf dein Forscherzeichen. Neu hier? Tippe auf „Neues Zeichen“.', easy: 'Tippe auf dein Zeichen.' }
    },

    lila: {
      intro: 'Ich lese dir die Aufgabe noch einmal vor.',
      none: 'Schau dich um und tippe auf etwas, das leuchtet.'
    }
  };
})();
