import { Action, CulturalSurveyState } from 'features/culturalSurvey/context/types'

export const initialCulturalSurveyState: CulturalSurveyState = {
  questionsToDisplay: [],
  answers: [],
}

export const culturalSurveyReducer: React.Reducer<CulturalSurveyState, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case 'INIT_QUESTION_KEYS':
      return {
        ...state,
        questionsToDisplay: action.payload.questions,
        answers: action.payload.answers,
      }
    case 'SET_QUESTIONS':
      return { ...state, questionsToDisplay: action.payload }
    case 'SET_ANSWERS': {
      const index = state.answers.findIndex(
        (answer) => answer.questionId === action.payload.questionId
      )
      const answers = [...state.answers]
      answers[index] = {
        questionId: action.payload.questionId,
        answerIds: action.payload.answers,
      }
      return {
        ...state,
        answers: answers,
      }
    }
    case 'FLUSH_ANSWERS':
      return {
        ...state,
        answers: [],
      }
    default:
      return { ...state }
  }
}
