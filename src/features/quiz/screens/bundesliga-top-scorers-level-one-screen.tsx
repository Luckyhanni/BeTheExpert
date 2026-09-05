import {
  bundesligaTopScorersLevelOneMeta,
  bundesligaTopScorersLevelOneQuestions,
} from '@/features/quiz/data/bundesliga-top-scorers-level-one';
import { MultipleChoiceLevelScreen } from '@/features/quiz/screens/multiple-choice-level-screen';

export function BundesligaTopScorersLevelOneScreen() {
  return (
    <MultipleChoiceLevelScreen
      eyebrow="BUNDESLIGA · TORSCHÜTZEN · LEVEL 1"
      questions={bundesligaTopScorersLevelOneQuestions}
      retryMessage="Gute Grundlage. Wiederhole das Level und erkenne noch mehr Torschützenkönige."
      sourceNote={`Stand: ${bundesligaTopScorersLevelOneMeta.verifiedAsOf} · abgeschlossene Saisons bis ${bundesligaTopScorersLevelOneMeta.endSeasonInclusive}`}
      successMessage="Starke Leistung – du erkennst die Torschützenkönige der Bundesliga."
      title="Torschützenkönige erkennen"
    />
  );
}
