export type CareerCategory = {
  id: string;
  title: string;
  symbol: string;
  description: string;
};

export type CareerLevel = {
  level: 1 | 2 | 3 | 4;
  title: string;
  mode: string;
  description: string;
  timeLimitSeconds: number | null;
};

export const careerCategories: CareerCategory[] = [
  { id: 'champions', title: 'Meister', symbol: '★', description: 'Titelträger und Meisterjahre' },
  { id: 'clubs', title: 'Vereine', symbol: '⬡', description: 'Clubs der Liga erkennen' },
  { id: 'players', title: 'Spieler', symbol: '●', description: 'Stars und Legenden' },
  { id: 'coaches', title: 'Trainer', symbol: '◇', description: 'Trainer und ihre Stationen' },
  { id: 'seasons', title: 'Saisons', symbol: '▤', description: 'Spielzeiten im Rückblick' },
  { id: 'tables', title: 'Tabellen', symbol: '▥', description: 'Platzierungen und Punkte' },
  { id: 'records', title: 'Rekorde', symbol: '↑', description: 'Bestmarken der Liga' },
  { id: 'promotion', title: 'Auf- & Abstieg', symbol: '⇅', description: 'Ligawechsel der Vereine' },
  { id: 'stadiums', title: 'Stadien', symbol: '⌂', description: 'Spielorte und Kapazitäten' },
  { id: 'transfers', title: 'Transfers', symbol: '⇄', description: 'Wechsel und Karrierewege' },
];

export const careerLevels: CareerLevel[] = [
  {
    level: 1,
    title: 'Leicht',
    mode: 'Multiple Choice',
    description: 'Wähle die richtige Antwort aus vier Möglichkeiten.',
    timeLimitSeconds: null,
  },
  {
    level: 2,
    title: 'Aufzählen',
    mode: 'Mehrere Antworten',
    description: 'Nenne alle gesuchten Meister, Vereine oder Spieler.',
    timeLimitSeconds: null,
  },
  {
    level: 3,
    title: 'Zuordnen',
    mode: 'Jahre verbinden',
    description: 'Ordne Ereignisse und Titel den richtigen Jahren zu.',
    timeLimitSeconds: null,
  },
  {
    level: 4,
    title: 'Impossible',
    mode: 'Eine Jahreszahl',
    description: 'Nur eine Jahreszahl als Hinweis. Antworte in zehn Sekunden.',
    timeLimitSeconds: 10,
  },
];
