import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'

export const useGetNextStep = (currentStep: CulturalSurveyQuestionEnum) => {
  const { questionsToDisplay } = useCulturalSurveyContext()

  const nextStepIndex = questionsToDisplay.indexOf(currentStep) + 1

  const isCurrentStepLastStep = nextStepIndex === questionsToDisplay.length
  let nextStep = currentStep

  if (!isCurrentStepLastStep) {
    nextStep = questionsToDisplay[nextStepIndex]
  }

  return { isCurrentStepLastStep, nextStep }
}
