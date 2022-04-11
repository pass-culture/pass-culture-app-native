import { CulturalSurveyQuestionEnum } from 'api/gen/api'

const isCurrentStepLastStep = false
const nextStep = CulturalSurveyQuestionEnum.SORTIES

export const useGetNextStep = jest.fn(() => ({ isCurrentStepLastStep, nextStep }))
