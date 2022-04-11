import { CulturalSurveyQuestionEnum } from 'api/gen'
import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'

export const initialCulturalSurveyState = {
  currentStep: null,
  questionsToDisplay: [] as CulturalSurveyQuestionEnum[],
  // TODO : populate with correct format
  answers: ['oui'],
}

export const culturalSurveyReducer = (state: CulturalSurveyState, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return initialCulturalSurveyState
    case 'SET_QUESTIONS':
      return { ...state, questionsToDisplay: action.payload }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    default:
      return { ...state }
  }
}
