import { CulturalSurveyQuestionEnum, CulturalSurveyQuestionsResponse } from 'api/gen/api'
import { mockCulturalSurveyQuestions } from 'features/culturalSurvey/__mocks__/culturalSurveyQuestions'

export const createInitialQuestionsList = (
  culturalSurveyQuestions: CulturalSurveyQuestionsResponse
) => {
  const subQuestions = [] as CulturalSurveyQuestionEnum[]
  const initialQuestionsList = [] as CulturalSurveyQuestionEnum[]

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

export const useCulturalSurveySteps = () => {
  // TODO (yorickeando) PC-13347: replace mock by react-query response
  const culturalSurveyData = mockCulturalSurveyQuestions

  const culturalSurveySteps = createInitialQuestionsList(culturalSurveyData)
  return { culturalSurveySteps }
}
