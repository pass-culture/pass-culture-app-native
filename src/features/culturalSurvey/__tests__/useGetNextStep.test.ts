import { CulturalSurveyQuestionEnum } from 'api/gen'
import { useGetNextStep } from 'features/culturalSurvey/useGetNextStep'

jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
describe('useGetNextStep', () => {
  it('should return isCurrentLastStep false and nextStep equal to following question if not given last step', () => {
    expect(useGetNextStep(CulturalSurveyQuestionEnum.SORTIES)).toEqual({
      isCurrentStepLastStep: false,
      nextStep: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
  it('should return isCurrentStepLastStep true and nextStep equal to currentStep if given last step', () => {
    expect(useGetNextStep(CulturalSurveyQuestionEnum.ACTIVITES)).toEqual({
      isCurrentStepLastStep: true,
      nextStep: CulturalSurveyQuestionEnum.ACTIVITES,
    })
  })
})
