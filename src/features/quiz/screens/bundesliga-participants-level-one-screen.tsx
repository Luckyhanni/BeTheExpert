import {
  bundesligaParticipantsLevelOneMeta,
  bundesligaParticipantsLevelOneQuestions,
} from '@/features/quiz/data/bundesliga-participants-level-one';
import { MultipleChoiceLevelScreen } from '@/features/quiz/screens/multiple-choice-level-screen';

export function BundesligaParticipantsLevelOneScreen() {
  return (
    <MultipleChoiceLevelScreen
      eyebrow="BUNDESLIGA · TEILNEHMER · LEVEL 1"
      questions={bundesligaParticipantsLevelOneQuestions}
      retryMessage="Gute Grundlage. Wiederhole das Level und erkenne noch mehr Bundesligisten."
      sourceNote={`Stand: ${bundesligaParticipantsLevelOneMeta.verifiedAsOf} · Saison ${bundesligaParticipantsLevelOneMeta.seasonInProgress}`}
      successMessage="Starke Leistung – du erkennst die Vereine der Bundesliga-Geschichte."
      title="Bundesligisten erkennen"
    />
  );
}
