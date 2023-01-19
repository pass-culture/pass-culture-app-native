import { CulturalSurveyQuestionEnum } from 'api/gen'
import { useGetNextQuestion } from 'features/culturalSurvey/helpers/useGetNextQuestion'

jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
describe('useGetNextQuestion', () => {
  it('should return isCurrentQuestionLastQuestion false and nextQuestion equal to following question if not given last step', () => {
    expect(useGetNextQuestion(CulturalSurveyQuestionEnum.SORTIES)).toEqual({
      isCurrentQuestionLastQuestion: false,
      nextQuestion: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
  it('should return isCurrentQuestionLastQuestion true and nextQuestion equal to currentStep if given last step', () => {
    expect(useGetNextQuestion(CulturalSurveyQuestionEnum.ACTIVITES)).toEqual({
      isCurrentQuestionLastQuestion: true,
      nextQuestion: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
})
