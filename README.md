# Myras geheimnisvoller Pilzwald

Eine kleine illustrierte Lernwelt rund um Pilze für die flexible Schuleingangsphase (Klasse 1/2).
Statische Web-App ohne Server, ohne Konten, ohne Tracking. Alle Daten bleiben im Browser des Geräts.

## Stand: Phase 1 + Mission 2

**Spielbar**
- **Forscherprofile**: anonym über Zeichen + Farbe („Gelbe Eichel“). Keine Namen.
- **Startbildschirm**: illustrierte Waldszene, Myra begrüßt, Navigation über vier Wegweiser.
- **Wissenswand (Vorwissen)**: erste Station ganz am Anfang des Waldwegs. Die Klasse schreibt frei auf Zettel, was sie schon über Pilze weiß (Impulsfragen zum Vorlesen, Zettelfarben, Zettel antippen = vorlesen). Ab dem ersten geschafften Kapitel lassen sich die Zettel prüfen: „Stimmt“, „Stimmt nicht“, „Wissen wir noch nicht“. Gilt für das ganze Gerät, nicht pro Profil; Export als Text im Lehrkraftbereich.
- **Waldkarte**: sechs Orte am Weg; Kapitel 1 offen, die anderen im Nebel. Geschaffte Orte leuchten, der Weg wird heller, Myra wandert zum nächsten Ort.
- **Mission 1 „Wer bin ich?“**: Hinweissteine am Waldtor antippen → Silhouette im Nebel wird klarer → ab dem 2. Hinweis Bildkarten → Vermutung abgeben. Falsche Wahl = kurze Erklärung + nächster Hinweis. Lösung öffnet das Tor; Bruno der Steinpilz erscheint, das Myzel leuchtet im Boden. Forscher/Pilzexperten bekommen eine Abschlussfrage zum Myzel.
- **Mission 2 „Die Pilzwerkstatt“** (mit Abschluss am echten Foto: Hut, Röhren, Stiel suchen, Lamellen beim Vergleichspilz finden, Pilzexperten zählen Fruchtkörper): Brunos zerpustete Zeichnung wieder zusammensetzen (Teile per Antippen oder Ziehen an ihren Platz), dann Wortschilder zuordnen (angetippte Wörter werden vorgelesen). Stufe 1 Entdecker: Hut und Stiel · Stufe 2 Forscher: + Röhren, Ablenker „Lamellen“ · Stufe 3 Pilzexperte: + Myzel und Einordnen von „Fruchtkörper“ und „Myzel“ (Ablenker „Wurzeln“). Am Ende zeigt Fips Baumpilze: nicht alle Pilze haben Hut und Stiel.
- **Mission 3 „Das Dorf der hundert Hüte“**: Namensschilder unter die Fotos der Bewohner bringen (Häuser bekommen dabei ihre Farbe zurück), dann nach der Unterseite sortieren (Entdecker: Lamellen/Röhren; Forscher & Pilzexperte: + Leisten), zum Schluss Rätsel „Wer bin ich?“. Pilzexperten bekommen schwierigere Rätsel (Stielnetz, Blaufärbung) und eine Transferfrage.
- **Mission 4 „Der Wald der Verwechslungen“**: Alltagssituationen (Spielplatz, „sieht aus wie aus dem Supermarkt“, Farbregel, Hände waschen, Oma/Pilzberatung, Schnecke, Notfall) – das Kind wählt die sichere Antwort, der Nebel lichtet sich. Fotopärchen zeigen, wie ähnlich sich Pilze sehen (Champignon/Knollenblätterpilz, Steinpilz/Gallenröhrling, Pfifferling/Falscher Pfifferling); nie wird anhand eines Fotos über Essbarkeit entschieden. Zum Schluss wird die Pilzregel aus Wortkarten gebaut (Entdecker: richtige Regel auswählen).
- **Mission 5 „Myras Forscherlabor“**: Wachstumsbilder ordnen (Myzel → Köpfchen → kleiner Pilz → großer Pilz), „Was brauchen Champignons?“ sortieren (ab Forscher), dann echte Beobachtungen: Ab zwei Forscherbuch-Einträgen erscheint ein Balkendiagramm mit Ablesefrage. Alle Werte stammen ausschließlich aus dem Forscherbuch.
- **Mission 6 „Das große Pilzfest“**: Vier Stationen zur Wiederholung (Pilzteil am Foto, Rätsel, sichere Entscheidung, Reflexion bei Lila mit Stimmungsabfrage – im Lehrkraftbereich sichtbar). Danach leuchtet der ganze Wald, und es gibt die **Pilzforscher-Urkunde** (Name nur zum Drucken, wird nicht gespeichert; Druck im Querformat A4).
- **Mein Wald**: Waldlichter aus Missionen schalten Elemente frei; platzieren per Antippen (Teil wählen → in den Wald tippen) oder Ziehen; Teile auswählen, verschieben, wegräumen. Pfeiltasten verschieben ausgewählte Teile.
- **Pilze entdecken**: fünf Steckbriefe (Fliegenpilz, Steinpilz, Pfifferling, Champignon, Maronenröhrling) mit antippbaren Pilzteilen; bei „Unter dem Hut“ hebt sich der Hut an.
- **Forscherbuch**: echte Beobachtungen der Champignonzucht – Datum, Anzahl, Größe, Veränderungen, eigene Zeichnung, freiwillige Notiz. Chronologische Liste („Tag 1, Tag 4 …“). Es wird nichts erfunden.
- **Lila (Glühwürmchen)**: liest jederzeit die aktuelle Aufgabe vor bzw. zeigt eine Kurzfassung.
- **Lehrkraftbereich** (Schlüssel unten rechts; Knopf gedrückt halten + Zahlwort eintippen): Differenzierungsstufe, Ton/Vorlesen, Animationen reduzieren, Kapitel freischalten, Profile zurücksetzen/löschen, Forscherbuch-Export (CSV, JSON mit Zeichnungen, Kopieren), alles löschen.
- **Fortschritt** wird lokal gespeichert (`localStorage`). Optional als App installierbar (PWA, offline).

**Noch nicht enthalten**
- Alle sechs Kapitel sind spielbar.
- Professionelle Illustrationen und Sprachaufnahmen (bisher programmatische SVGs und Browser-Sprachausgabe).

## Ordnerstruktur

```
index.html            Einstieg, gemeinsame SVG-Filter (Buntstift/Aquarell)
css/style.css         Gestaltung, responsive Regeln
js/art.js             alle Illustrationen als SVG (Figuren mit 4 Stimmungen, Szenen, Pilze)
js/assets.js          Austauschschicht für Grafiken (PNG/WebP/SVG später hier eintragen)
js/content.js         Lerninhalte nach Stufen (Entdecker / Forscher / Pilzexperte)
js/dialog.js          alle Figurentexte
js/store.js           lokale Speicherung, Profile, Fortschritt
js/voice.js           Vorlesen über die Browser-Sprachausgabe
js/ui.js              Sprechblasen, Werkzeugleiste, Lila-Hilfe, Fenster
js/dnd.js             Zuordnen per Antippen oder Ziehen (für alle Missionen)
js/screens/*.js       ein Modul pro Bildschirm
js/app.js             Navigation und Start
sw.js, manifest.webmanifest, assets/   PWA
```

### Fotos
Fotos liegen in `assets/fotos/` und sind in `js/content.js` unter `photos` eingetragen – mit Bildpunkten (`spots`, in Prozent), die die Kinder antippen. **Vor dem Veröffentlichen bei jedem Foto `credit`, `license` und `source` ausfüllen**; die Angaben erscheinen unter „Bildnachweise“ (Lexikon und Lehrkraftbereich).

Vorhanden (alle aus Canva for Education): `steinpilz`, `laengsschnitt` (als „Röhrenpilz“ beschriftet), `fliegenpilz`, `champignon` (jung, Lamellen noch verdeckt), `lamellenpilz` (vermutlich Wulstling, **nicht** als Champignon verwenden), `pilz-mit-myzel`, `myzel-holz`, `baumpilz`.

Außerdem `maronenroehrling` und `pfifferling` von Wikimedia Commons – Urheber und genaue Lizenz noch von der Dateiseite eintragen. Pärchen-Fotos `knollenblaetterpilz`, `gallenroehrling`, `falscher-pfifferling` (Pixabay, Seiten-Links noch eintragen). Fachlich vor dem Einsatz von Fachkundigen gegenprüfen lassen. Weitere Ideen für Pärchen (z. B. Steinpilz/Gallenröhrling, Champignon/Knollenblätterpilz). Bilder aus fremden Unterrichtsmaterialien (z. B. Miniposter) nicht herauslösen – deren Nutzungsbedingungen verbieten das; stattdessen die Originale direkt bei Pixabay oder Commons laden.

**Lizenz-Hinweis Canva:** Canva-Medien dürfen in eigenen Designs genutzt werden, aber nicht als einzelne Dateien weitergegeben werden. In einem öffentlichen GitHub-Repository liegen die Fotos als einzelne, herunterladbare Dateien. Vor einer öffentlichen Veröffentlichung bitte die Canva-Lizenzbedingungen prüfen – für den Einsatz im eigenen Unterricht ist das unkritischer.

### Grafiken austauschen
In `js/assets.js` eine Zeile ergänzen, z. B.

```js
OVERRIDES['myra:happy'] = 'assets/characters/myra-happy.webp';
OVERRIDES['pic:pilz']   = 'assets/pics/pilz.png';
```
Schlüssel: `myra|bruno|fips|lila:neutral|happy|thinking|encouraging`, `pic:<name>`, `shroom:<art>`, `garden:<element>`.

## Auf GitHub Pages veröffentlichen
1. Auf github.com ein neues öffentliches Repository anlegen (z. B. `pilzwald`).
2. „Add file → Upload files“: den **Inhalt** dieses Ordners hochladen (`index.html` muss oben liegen) und speichern.
3. Repository → **Settings → Pages** → „Deploy from a branch“, Branch `main`, Ordner `/ (root)` → **Save**.
4. Nach etwa einer Minute ist die App unter `https://<benutzername>.github.io/pilzwald/` erreichbar.
5. Auf Tablets: Seite öffnen → „Zum Home-Bildschirm“ → startet wie eine App und funktioniert danach auch offline.

Lokal testen: im Ordner `python3 -m http.server` ausführen und `http://localhost:8000` öffnen (Doppelklick auf `index.html` funktioniert auch, dann ohne Offline-Modus).

## Datenschutz
Keine Server, keine Konten, keine Cookies, keine Tracker. Schriften werden von Google Fonts geladen; wer das vermeiden möchte, legt die Schriftdateien (Andika, Grandstander) in `assets/fonts/` und bindet sie in `index.html` per `@font-face` ein. Profile sind anonym. Daten liegen nur im Browser des jeweiligen Geräts – „Alles löschen“ im Lehrkraftbereich entfernt sie vollständig.

## Fachliche Leitplanken (für alle weiteren Kapitel)
- Myzel = Pilzgeflecht; der sichtbare Hutpilz ist der Fruchtkörper; nicht alle Pilze haben Hut und Stiel.
- Pilze sind weder Tiere noch Pflanzen.
- Niemals Essbarkeit anhand von Bildern entscheiden lassen. Regel: „Unbekannte Pilze darfst du niemals essen. Wildpilze bestimmen nur Fachleute.“
- Der Fantasiegarten ist ausdrücklich keine Simulation der echten Champignonzucht.
