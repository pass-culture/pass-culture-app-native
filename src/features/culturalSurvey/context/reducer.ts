import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'

export const initialCulturalSurveyState = {
  currentStep: null,
  // TODO : populate with correct format
  answers: ['oui'],
}

export const culturalSurveyReducer = (state: CulturalSurveyState, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return initialCulturalSurveyState
    case 'SET_STEP':
      return { ...state }
    default:
      return { ...state }
  }
}
