import {
  bundesligaPlayersLevelOneMeta,
  bundesligaPlayersLevelOneQuestions,
} from '@/features/quiz/data/bundesliga-players-level-one';
import { MultipleChoiceLevelScreen } from '@/features/quiz/screens/multiple-choice-level-screen';

export function BundesligaPlayersLevelOneScreen() {
  return (
    <MultipleChoiceLevelScreen
      eyebrow="BUNDESLIGA · SPIELER · LEVEL 1"
      questions={bundesligaPlayersLevelOneQuestions}
      retryMessage="Gute Grundlage. Wiederhole das Level und ordne noch mehr Spieler richtig zu."
      sourceNote={`Stand: ${bundesligaPlayersLevelOneMeta.verifiedAsOf} · 40 Vereine`}
      successMessage="Starke Leistung – du kannst die Spieler ihren Vereinen zuordnen."
      title="Spieler zuordnen"
    />
  );
}
