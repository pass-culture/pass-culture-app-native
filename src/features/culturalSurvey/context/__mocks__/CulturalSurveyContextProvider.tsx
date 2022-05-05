import { CulturalSurveyQuestionEnum } from 'api/gen'

export const dispatch = jest.fn()

const questionsToDisplay = [
  CulturalSurveyQuestionEnum.SORTIES,
  CulturalSurveyQuestionEnum.ACTIVITES,
]

export const useCulturalSurveyContext = jest.fn().mockReturnValue({
  dispatch,
  questionsToDisplay,
  answers: [
    { questionId: CulturalSurveyQuestionEnum.SORTIES, answerIds: [] },
    { questionId: CulturalSurveyQuestionEnum.FESTIVALS, answerIds: [] },
    { questionId: CulturalSurveyQuestionEnum.SPECTACLES, answerIds: [] },
    { questionId: CulturalSurveyQuestionEnum.ACTIVITES, answerIds: [] },
  ],
})
