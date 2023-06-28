export type EmojiOption = 'Aventure' | 'Festif' | 'In love' | 'Chill'

export type TermsOption = 'Maintenant' | 'Cette semaine' | 'Je suis dispo tout le temps'

export type MoodboardOption =
  | 'Summer vibe'
  | 'Dark mode'
  | 'Classique'
  | 'Fun'
  | 'Romantique'
  | 'Intello'
  | 'Mélancolique'
  | 'Créative'
  | 'Cocooning'
  | 'Insolite'
  | 'Mystérieuse'

export type PersonaOption = 'Krokmou' | 'Tony Stark' | 'Cheryl' | 'Itachi'

export type SurveyData = {
  emoji: EmojiOption | ''
  terms: string | ''
  moodboard: MoodboardOption | ''
  persona: PersonaOption | ''
}

export interface MoodSurveyStepProps {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
}

export interface MoodSurveyMoodboardStepProps {
  goToNextQuestion: (newSurveyData: Partial<SurveyData>) => void
  emoji: EmojiOption | ''
}
