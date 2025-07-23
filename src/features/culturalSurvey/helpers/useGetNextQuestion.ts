import { CulturalSurveyQuestionEnum } from 'api/gen/api'
import { useCulturalSurveyContext } from 'features/culturalSurvey/context/CulturalSurveyContextProvider'

export const useGetNextQuestion = (currentQuestion: CulturalSurveyQuestionEnum | undefined) => {
  const { questionsToDisplay } = useCulturalSurveyContext()
  if (!currentQuestion) return {}

  const nextQuestionIndex = questionsToDisplay.indexOf(currentQuestion) + 1

  const isCurrentQuestionLastQuestion = nextQuestionIndex === questionsToDisplay.length
  const nextQuestion = isCurrentQuestionLastQuestion
    ? currentQuestion
    : questionsToDisplay[nextQuestionIndex]

  return { isCurrentQuestionLastQuestion, nextQuestion }
}
