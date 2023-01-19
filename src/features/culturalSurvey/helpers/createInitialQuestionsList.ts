import { CulturalSurveyQuestionEnum, CulturalSurveyQuestionsResponse } from 'api/gen/api'

export const createInitialQuestionsList = (
  culturalSurveyQuestions?: CulturalSurveyQuestionsResponse
) => {
  const subQuestions = [] as CulturalSurveyQuestionEnum[]
  const initialQuestionsList = [] as CulturalSurveyQuestionEnum[]

  if (!culturalSurveyQuestions?.questions) return initialQuestionsList

  culturalSurveyQuestions.questions.forEach((question) => {
    if (!subQuestions.includes(question.id)) {
      initialQuestionsList.push(question.id)
    }
    question.answers.forEach((answer) => {
      if (answer.sub_question && !subQuestions.includes(answer.sub_question)) {
        subQuestions.push(answer.sub_question)
      }
    })
  })
  return initialQuestionsList
}
