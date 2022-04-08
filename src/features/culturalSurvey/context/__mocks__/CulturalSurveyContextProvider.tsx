import { CulturalSurveyQuestionEnum } from 'api/gen'

const dispatch = jest.fn()

const questionsToDisplay = [
  CulturalSurveyQuestionEnum.SORTIES,
  CulturalSurveyQuestionEnum.ACTIVITES,
]

export const useCulturalSurveyContext = jest.fn().mockReturnValue({ dispatch, questionsToDisplay })
