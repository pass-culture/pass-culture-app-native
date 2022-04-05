export interface CulturalSurveyState {
  currentStep: string | null
  answers: string[]
}

export type Action = { type: 'INIT' } | { type: 'SET_STEP'; payload: undefined }
