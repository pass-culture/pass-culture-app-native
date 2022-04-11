import { CulturalSurveyQuestionEnum } from 'api/gen'

export interface CulturalSurveyState {
  currentStep: string | null
  questionsToDisplay: CulturalSurveyQuestionEnum[]
  answers: string[]
}

export type Action =
  | { type: 'INIT' }
  | { type: 'SET_STEP'; payload: string | null }
  | { type: 'SET_QUESTIONS'; payload: CulturalSurveyQuestionEnum[] }
