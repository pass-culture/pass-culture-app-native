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
    { questionId: CulturalSurveyQuestionEnum.SORTIES, answerIds: ['SORTIE'] },
    { questionId: CulturalSurveyQuestionEnum.FESTIVALS, answerIds: ['FESTIVAL'] },
    { questionId: CulturalSurveyQuestionEnum.SPECTACLES, answerIds: ['SPECTACLE'] },
    { questionId: CulturalSurveyQuestionEnum.ACTIVITES, answerIds: ['ACTIVITE'] },
  ],
})
