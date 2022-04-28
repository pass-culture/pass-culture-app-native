import { CulturalSurveyQuestionEnum } from 'api/gen'

export const dispatch = jest.fn()

const questionsToDisplay = [
  CulturalSurveyQuestionEnum.SORTIES,
  CulturalSurveyQuestionEnum.ACTIVITES,
]

export const useCulturalSurveyContext = jest.fn().mockReturnValue({
  dispatch,
  questionsToDisplay,
  answers: {
    [CulturalSurveyQuestionEnum.SORTIES]: [],
    [CulturalSurveyQuestionEnum.FESTIVALS]: [],
    [CulturalSurveyQuestionEnum.SPECTACLES]: [],
    [CulturalSurveyQuestionEnum.ACTIVITES]: [],
  },
})
