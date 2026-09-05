import {
  bundesligaChampionsLevelOneMeta,
  bundesligaChampionsLevelOneQuestions,
} from '@/features/quiz/data/bundesliga-champions-level-one';
import { MultipleChoiceLevelScreen } from '@/features/quiz/screens/multiple-choice-level-screen';

export function BundesligaChampionsLevelOneScreen() {
  return (
    <MultipleChoiceLevelScreen
      eyebrow="BUNDESLIGA · MEISTER · LEVEL 1"
      questions={bundesligaChampionsLevelOneQuestions}
      retryMessage="Gute Grundlage. Wiederhole das Level und verbessere deinen Rekord."
      sourceNote={`Stand: ${bundesligaChampionsLevelOneMeta.verifiedAsOf} · Historische deutsche Meister seit 1903`}
      successMessage="Starke Leistung – du kennst die deutschen Meister."
      title="Meister erkennen"
    />
  );
}
