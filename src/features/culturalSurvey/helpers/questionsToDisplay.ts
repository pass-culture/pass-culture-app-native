import { CulturalSurveyQuestionEnum } from 'api/gen/api'

export const addSubQuestionToQuestionsToDisplay = (
  subQuestionId: CulturalSurveyQuestionEnum,
  questionsToDisplay: CulturalSurveyQuestionEnum[]
) => {
  let updatedQuestionsToDisplay = [...questionsToDisplay]
  updatedQuestionsToDisplay = updatedQuestionsToDisplay.filter(
    (questionId) => questionId != subQuestionId
  )
  return updatedQuestionsToDisplay
}

export const removeSubQuestionsToDisplay = (
  subQuestionId: CulturalSurveyQuestionEnum,
  questionsToDisplay: CulturalSurveyQuestionEnum[]
) => {
  const updatedQuestionsToDisplay = [...questionsToDisplay]
  updatedQuestionsToDisplay.splice(1, 0, subQuestionId)
  return updatedQuestionsToDisplay
}
