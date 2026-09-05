export type CareerLevel = {
  level: 1 | 2 | 3 | 4;
  title: 'Erkennen' | 'Wissen' | 'Experte' | 'Impossible';
  mode: string;
  description: string;
  example: string;
  timeLimitSeconds: number | null;
};

export type CareerCategory = {
  id: string;
  title: string;
  symbol: string;
  description: string;
  levels: CareerLevel[];
};

function level(
  levelNumber: CareerLevel['level'],
  mode: string,
  description: string,
  example: string,
): CareerLevel {
  const titles: Record<CareerLevel['level'], CareerLevel['title']> = {
    1: 'Erkennen',
    2: 'Wissen',
    3: 'Experte',
    4: 'Impossible',
  };

  return {
    level: levelNumber,
    title: titles[levelNumber],
    mode,
    description,
    example,
    timeLimitSeconds: levelNumber === 4 ? 10 : null,
  };
}

export const careerCategories: CareerCategory[] = [
  {
    id: 'champions',
    title: 'Meister',
    symbol: '★',
    description: 'Titelträger und Meisterjahre',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne frühere Meister aus vier Vereinen.', 'Welcher Verein wurde bereits Meister der {league}?'),
      level(2, 'Aufzählen', 'Nenne alle bisherigen Meister der Liga.', 'Nenne alle Vereine, die seit Ligagründung Meister wurden.'),
      level(3, 'Saisons zuordnen', 'Ordne jeder Saison den richtigen Meister zu.', 'Wer wurde in der Saison 2008/09 Meister?'),
      level(4, 'Saison-Sprint', 'Eine zufällige Saison, keine Auswahl und nur zehn Sekunden.', '1997/98 → Meisterverein eintippen'),
    ],
  },
  {
    id: 'participants',
    title: 'Teilnehmer',
    symbol: '⬡',
    description: 'Alle Vereine der Ligageschichte',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne einen ehemaligen oder aktuellen Ligaverein.', 'Welcher Verein spielte bereits in der {league}?'),
      level(2, 'Aufzählen', 'Nenne alle bisherigen Teilnehmer der Liga.', 'Nenne möglichst viele Vereine der Ligageschichte.'),
      level(3, 'Ewige Tabelle', 'Sortiere Vereine nach ihrer Platzierung in der Ewigen Tabelle.', 'Bringe vier Vereine in die richtige Reihenfolge.'),
      level(4, 'Tabellenplatz-Sprint', 'Ein Platz der Ewigen Tabelle, keine Hilfe und zehn Sekunden.', 'Platz 5 der Ewigen Tabelle → Verein eintippen'),
    ],
  },
  {
    id: 'top-scorers',
    title: 'Torschützen',
    symbol: '⚽',
    description: 'Torschützenkönige und Torrekorde',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne einen früheren Torschützenkönig.', 'Wer wurde bereits Torschützenkönig der {league}?'),
      level(2, 'Aufzählen', 'Nenne alle bisherigen Torschützenkönige.', 'Nenne möglichst viele Torschützenkönige.'),
      level(3, 'Saisons zuordnen', 'Ordne jeder Saison den richtigen Torschützenkönig zu.', 'Wer wurde 2010/11 Torschützenkönig?'),
      level(4, 'Saison-Sprint', 'Eine Saison, keine Auswahl und zehn Sekunden.', '2002/03 → Torschützenkönig eintippen'),
    ],
  },
  {
    id: 'players',
    title: 'Spieler',
    symbol: '●',
    description: 'Kader, Stars und Karrierewege',
    levels: [
      level(1, 'Multiple Choice', 'Ordne einen Spieler dem richtigen Verein zu.', 'Welcher Spieler spielte für diesen Verein?'),
      level(2, 'Kader aufzählen', 'Nenne möglichst viele Spieler eines vorgegebenen Kaders.', 'Nenne Spieler aus dem aktuellen Kader eines Ligavereins.'),
      level(3, 'Karriereweg', 'Erkenne einen Spieler an der Reihenfolge seiner Vereine.', 'Vier Karrierestationen → Spieler eintippen'),
      level(4, 'Spieler-Sprint', 'Nenne die Ligavereine eines Spielers in zehn Sekunden.', 'Spielername → alle seine Vereine in der {league}'),
    ],
  },
  {
    id: 'transfers',
    title: 'Transfers',
    symbol: '⇄',
    description: 'Wechsel und Karrierebewegungen',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne das Ziel eines bekannten Transfers.', 'Wohin wechselte dieser Spieler?'),
      level(2, 'Transfers aufzählen', 'Nenne die Zu- oder Abgänge eines Vereins in einer Saison.', 'Nenne die Neuzugänge eines Vereins in Saison X.'),
      level(3, 'Transferweg', 'Bestimme Herkunftsverein, Zwischenstation und Transferziel.', 'Von welchem Verein kam der Spieler und wohin ging er?'),
      level(4, 'Transfer-Sprint', 'Spieler und Jahr werden gezeigt – antworte in zehn Sekunden.', '2015 · Spielername → Transferweg eintippen'),
    ],
  },
  {
    id: 'coaches',
    title: 'Trainer',
    symbol: '◇',
    description: 'Trainer, Vereine und Spielzeiten',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne einen früheren Trainer des Vereins.', 'Wer trainierte diesen Verein bereits?'),
      level(2, 'Trainer aufzählen', 'Nenne die Trainer eines Vereins im vorgegebenen Zeitraum.', 'Nenne alle Trainer des Vereins seit 2010.'),
      level(3, 'Saison zuordnen', 'Ordne Trainer, Verein und Saison korrekt zu.', 'Wer trainierte den Meister dieser Saison?'),
      level(4, 'Trainer-Sprint', 'Verein und Saison werden gezeigt – zehn Sekunden Zeit.', 'Verein · 2003/04 → Trainer eintippen'),
    ],
  },
  {
    id: 'tables',
    title: 'Tabellen',
    symbol: '▥',
    description: 'Platzierungen und Abschlusstabellen',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne die Platzierung eines Vereins.', 'Wer wurde in der Saison 2022/23 Zweiter?'),
      level(2, 'Saison aufzählen', 'Nenne alle Teilnehmer einer vorgegebenen Saison.', 'Nenne alle Vereine der Saison 2015/16.'),
      level(3, 'Tabelle bauen', 'Sortiere Vereine wie in der Abschlusstabelle.', 'Bringe vier Vereine in die korrekte Reihenfolge.'),
      level(4, 'Tabellen-Sprint', 'Saison und Platz werden gezeigt – zehn Sekunden Zeit.', '2018/19 · Platz 7 → Verein eintippen'),
    ],
  },
  {
    id: 'stadiums',
    title: 'Stadien & Städte',
    symbol: '⌂',
    description: 'Spielorte, Vereine und Heimatstädte',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne den Verein anhand eines neutralen Stadionbildes.', 'Welcher Verein spielt in diesem Stadion?'),
      level(2, 'Stadien aufzählen', 'Nenne die Stadien der aktuellen Ligavereine.', 'Nenne möglichst viele Stadien der {league}.'),
      level(3, 'Dreifach zuordnen', 'Verbinde Verein, Stadion und Stadt korrekt.', 'Verein ↔ Stadion ↔ Stadt'),
      level(4, 'Stadion-Sprint', 'Ein Stadion wird gezeigt – Verein und Stadt in zehn Sekunden.', 'Stadionname → Verein und Stadt eintippen'),
    ],
  },
  {
    id: 'records',
    title: 'Rekorde & Statistiken',
    symbol: '↑',
    description: 'Bestmarken, Zahlen und Rekordhalter',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne den Halter eines Ligarekords.', 'Wer erzielte die meisten Tore in der {league}?'),
      level(2, 'Rekordliste', 'Nenne die gesuchten Top-Spieler oder Top-Vereine.', 'Nenne die fünf Spieler mit den meisten Einsätzen.'),
      level(3, 'Zahl zuordnen', 'Ordne Rekordhalter und Rekordwert einander zu.', 'Wie hoch ist der Saisonrekord dieses Spielers?'),
      level(4, 'Rekord-Sprint', 'Eine Bestmarke, keine Auswahl und zehn Sekunden.', 'Meiste Einsätze aller Zeiten → Namen eintippen'),
    ],
  },
  {
    id: 'club-history',
    title: 'Vereinsgeschichte',
    symbol: '▤',
    description: 'Historische Ereignisse und Meilensteine',
    levels: [
      level(1, 'Multiple Choice', 'Erkenne Vereine anhand historischer Fakten.', 'Welcher Verein wurde in diesem Jahr gegründet?'),
      level(2, 'Historie aufzählen', 'Nenne Vereine, die zu einem historischen Ereignis gehören.', 'Nenne die Gründungsmitglieder der Liga.'),
      level(3, 'Timeline', 'Sortiere Ereignisse eines Vereins chronologisch.', 'Aufstieg · Pokalsieg · Meistertitel richtig ordnen'),
      level(4, 'Geschichts-Sprint', 'Historische Hinweise führen zu einem Verein – zehn Sekunden.', 'Zwei Meilensteine → Verein eintippen'),
    ],
  },
];

export function formatLevelExample(example: string, leagueName: string) {
  return example.replaceAll('{league}', leagueName);
}
