# Deutsche Karriere: Meister, Teilnehmer, Torschützen, Spieler

Stand der Erweiterung: 19.09.2026. Vier Themen × vier Level × zwei Ligen = 32 spielbare Themenstufen.
Die weiteren sechs Themen bleiben als noch nicht verfügbare Bereiche sichtbar.

Für den Freundestest ist `CAREER_PLAYTEST_UNLOCK_ALL` in `src/features/career/data/career-settings.ts` aktiviert: Alle 32 vorhandenen Themenstufen sind für alle Konten ohne Vorbedingungen spielbar, auch über direkte Quiz-Links. „Liga wechseln“ erlaubt jederzeit den Wechsel zwischen beiden Bundesligen. Bestwerte werden weiterhin normal gespeichert; der Testmodus markiert keine Level künstlich als bestanden. Zum Wiederherstellen der Level-Sperren den Schalter auf `false` setzen (keine automatische Abschaltung).

## Inhalt und Abgrenzung

| Bereich | Bundesliga | 2. Bundesliga |
| --- | --- | --- |
| Meister erkennen | 30 deutsche Meister seit 1903, bestehender Umfang | 29 verschiedene Meister/Staffelsieger seit 1974/75 |
| Meister aufzählen | dieselben 30; keine eigenständige DDR-Meisterschaft | alle 29 einschließlich Nord/Süd |
| Meister: Saisonzuordnung und Sprint | 63 Spielzeiten 1963/64–2025/26 | 60 Saison-/Staffelentscheidungen 1974/75–2025/26 |
| Teilnehmer erkennen | bestehende 59 Vierergruppen | 24 Vierergruppen mit jeweils vier nicht wiederholten Vereinen |
| Teilnehmer aufzählen | 59 bis 05.09.2026 einschließlich Elversberg | 128 historische Einträge des DFB-Archivs bis 2025/26 |
| Ewige Tabelle: Sortieren / Sprint | 58 Einträge im abgeschlossenen Archivstand | 128 Einträge im abgeschlossenen Archivstand |
| Torschützenkönige erkennen / aufzählen | 48 verschiedene Sieger | 61 verschiedene Sieger einschließlich Staffeln |
| Torjäger: Saisonzuordnung / Sprint | alle 63 Saisons bis 2025/26 | alle 60 Saison-/Staffelentscheidungen bis 2025/26 |
| Spieler erkennen | bestehende 40 Vierergruppen | 39 neue Vierergruppen; 156 verschiedene Spieler |
| Kader aufzählen | sechs historische Saisonkader 2023/24 | sechs historische Saisonkader 2023/24 |
| Ligastationen / Spieler-Sprint | 124 Spielerdossiers | 25 Spielerdossiers |

Die 1.385 Aufgabenvarianten sind **keine 1.385 voneinander unabhängigen Fakten**: Saisonaufgaben und Sprints greifen bewusst auf dieselben geprüften Daten zurück. Pro Versuch werden bis zu zehn verschiedene Aufgaben gezogen. Vollständige Aufzählrunden behalten ihre ganze Antwortmenge.

Meister-Level 1 und 2 der Bundesliga bewahren die bestehende, ausdrücklich weiter gefasste Aufgabe „deutscher Meister seit 1903“. Level 3 und 4 behandeln ausdrücklich die Bundesligasaisons seit 1963/64.

Die Ewigen Tabellen sind eingefrorene DFB-Archivtabellen bis Ende 2025/26, durchgehend mit drei Punkten pro Sieg. Sie werden nicht als Live-Ranglisten verkauft. Elversberg zählt in der Teilnehmerliste ab seinem belegten Debüt am 29.08.2026, aber noch nicht in der früher endenden Ewigen Tabelle.

Historische Einträge werden entsprechend dem DFB-Archiv geführt. Fusionsvorgänger werden nicht pauschal zu heutigen Vereinen zusammengezogen. Unterschiedliche Schreibweisen desselben Eintrags erhalten kontrollierte Aliase. Insbesondere Hessen Kassel/KSV Hessen Kassel, Arminia Hannover/SV Arminia Hannover, Wormatia Worms/VfR Wormatia Worms und Westfalia Herne/SC Westfalia Herne dürfen nicht als falsche Ablenkantworten durchrutschen.

Geteilte Torjägertitel verlangen **alle** gemeinsamen Sieger. Bei zwei Staffeln nennt die Frage ausdrücklich Nord oder Süd. Streitige historische Torzahlen (z. B. abweichende Angaben bei Volker Graul, Horst Neumann und Maurice Banach in RSSSF/Wikipedia) sind nicht Teil der neuen Fragen oder Lösungen.

Spieler-Level 2 verwendet ausdrücklich historische Saisonkader, keine vermeintlich aktuellen Kader. Alle beim DFB geführten Saisonspieler zählen, einschließlich unterjähriger Zu-/Abgänge und Spieler ohne Ligaeinsatz; Trainer nicht. Doppelte Einträge derselben Person werden zusammengeführt. Level 3 und 4 verlangen dagegen tatsächlich dokumentierte Einsätze in genau der jeweiligen Liga. Pokal und Relegation zählen dort nicht. Die Stationen in Level 3 sind nach dem ersten Ligaeinsatz sortiert; Rückkehrstationen werden nicht als neue Vereine ausgegeben.

## Quellen und Nachvollziehbarkeit

Die App enthält pro Aufgabe anklickbare Belege in der Auflösung. Das Spiel lädt keine Sportdaten zur Laufzeit nach.

- [DFB: Ewige Tabelle Bundesliga](https://datencenter.dfb.de/competitions/bundesliga/eternal_table) und [DFB: Ewige Tabelle 2. Bundesliga](https://datencenter.dfb.de/competitions/2-bundesliga/eternal_table): Teilnehmer und eingefrorene Rangfolgen.
- [RSSSF: Deutsche Meister](https://www.rsssf.org/tablesd/duitchamp.html), gepflegt von Karel Stokkermans; [RSSSF: Zweitligameister](https://rsssf.org/tablesd/duit2champ.html), Karel Stokkermans und Frank Ballesteros: vollständige Saisonchroniken. Bundesliga-Chronik abgeglichen mit der [DFL-Meisterübersicht](https://www.bundesliga.com/de/bundesliga/news/liste-deutscher-meister-bundesliga-koln-bayern-nurnberg-dortmund-bremen-kaiserslautern-23908), Zweitliga-Chronik zusätzlich mit der Saisonbilanz auf Wikipedia.
- [RSSSF: Zweitliga-Torschützenkönige](https://www.rsssf.org/tablesd/duit2tops.html), Matthias Arnhold, Frank Ballesteros und Manuel Schmidt: vollständige Siegerchronik, abgeglichen mit der [historischen Übersicht auf Wikipedia](https://de.wikipedia.org/wiki/Liste_der_Torsch%C3%BCtzenk%C3%B6nige_der_2._Fu%C3%9Fball-Bundesliga). Aktueller Abschluss: [DFB 2025/26](https://datencenter.dfb.de/competitions/2-bundesliga/seasons/2025-2026/top_scorer).
- Bundesliga-Torjägerchronik aus dem bestehenden quellenbelegten Paket, mit DFL-/DSFS-Belegen je Saison. [DFL: historische Torjäger](https://www.bundesliga.com/en/bundesliga/news/a-history-of-top-scorers-by-season-lewandowski-muller-aubameyang-19353).
- 159 DFB-Spielerhistorien wurden für die neue Erweiterung abgerufen und als Vereins-/Wettbewerbsstatistiken ausgewertet. Beispiele: [Marco Reus](https://datencenter.dfb.de/datencenter/personen/marco-reus/spieler), [Miroslav Klose](https://datencenter.dfb.de/datencenter/personen/miroslav-klose/spieler). Ein nicht abrufbares alternatives Profil wurde nicht für neue Aufgaben benutzt.
- Zwölf DFB-Kaderseiten 2023/24; z. B. [Dortmund](https://datencenter.dfb.de/competitions/bundesliga/seasons/2023-24/teams/borussia-dortmund) und [St. Pauli](https://datencenter.dfb.de/competitions/2-bundesliga/seasons/2023-24/teams/fc-st-pauli).
- [DFL-Spielbericht zu Elversbergs Bundesliga-Debüt](https://www.bundesliga.com/de/bundesliga/news/sv-elversberg-bayer-04-leverkusen-spieltag-1-spielbericht-highlights-38864).

Faktensnapshots liegen in `docs/research/`, generierte App-Aufgaben in `src/features/quiz/data/german-career-packs.json`. Die fünf bisherigen Originalpakete bleiben erhalten. Ihre redaktionellen Stichtage und die vorhandenen Quellen werden übernommen; der Erweiterungsabruf ist kein behaupteter neuer Einzelabruf aller alten Quellen.

## Reproduktion und Pflege

`python scripts/build-career-content.py` erzeugt die App-Daten offline aus den gespeicherten Fakten und bisherigen Paketen. Das Skript braucht nur die Python-Standardbibliothek.

`research-career.py` und `research-players.py` sind separate Recherchewerkzeuge, nicht Teil der App oder des npm-Installationsvorgangs. Sie verwenden Python `requests` und `beautifulsoup4`. In dieser Arbeitsumgebung liegt BeautifulSoup unter `%TEMP%/bte-research-libs`; alternativ kann es in einer eigenen Python-Umgebung installiert werden. Die Einzelprofil-Caches in `docs/research/profiles/` werden nicht versioniert; die zusammengefassten Fakten schon.

**Neue Abrufe erfordern eine erneute redaktionelle Prüfung.** Insbesondere die Ewigen Tabellen und Spielerhistorien sind veränderlich. Die Saison-/Stichtagsangaben dürfen nicht unverändert mit späteren Live-Daten kombiniert werden. Vor Erweiterung der Titelträger- oder Teilnehmermenge sämtliche Ablenkantworten erneut gegen die vollständigen Listen prüfen. Strukturtests allein beweisen keine sportliche Richtigkeit.

## Spielregeln und Prüfung

Freitext akzeptiert volle Namen und kontrollierte Aliase; Umlaute, Akzente, Groß-/Kleinschreibung und Satzzeichen werden normalisiert. Mehrdeutige Aliase zählen nicht. Bei Listen werden Doppelnennungen nur einmal gewertet. Listen geben anteilige Punkte; Sortieraufgaben nur bei vollständig richtiger Reihenfolge. Freischaltung ab 80 %, Fortschritt und Bestwerte getrennt je Liga/Thema/Level.

Sprints beginnen erst mit dem Startknopf und verwenden eine absolute Zehn-Sekunden-Frist. Hintergrundzeit zählt mit; verspätete Eingaben werden abgewiesen. Nach Auflösung ist die Runde abgeschlossen und Antworten können nicht nachgetragen werden.

Automatisierte Tests prüfen alle 32 Pakete, Saison-/Staffelabdeckung, gemeinsame Titel, stabile IDs, nicht wiederholte Multiple-Choice-Optionen, Alias-Eindeutigkeit, Ablenkantworten gegen die kompletten Mengen, Wertung, Bestehensgrenze und zufällige Sitzungen ohne doppelte Aufgaben. Die vorhandenen Pakettests bleiben bestehen.

Browserprüfung: kompletter Multiple-Choice-Versuch, freie Meisterliste inklusive Alias/Dopplung, Saisonzuordnung, gespeicherte Ergebnisse und Level-Freischaltung. Sprint-Zeitablauf und Darstellung bei 390 px Browserbreite wurden ebenfalls geprüft. Ein echter iOS-/Android-Gerätetest steht noch aus.

`npm run check` ist erfolgreich (TypeScript, ESLint, 67 Tests in neun Testdateien). Der Export für Android, iOS und Web mit `npx expo export --platform all` ist ebenfalls erfolgreich.

`npm run doctor` meldete 20/21 erfolgreiche Prüfungen; der verbleibende Befund betrifft bereits vorhandene Expo-Patchversionsabweichungen (16 Pakete), nicht die Fragedaten. Abhängigkeiten wurden für diese Inhaltserweiterung nicht aktualisiert.
