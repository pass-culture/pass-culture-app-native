import { CulturalSurveyQuestionEnum, CulturalSurveyQuestionsResponse } from 'api/gen/api'

export const mapQuestionIdToPageTitle = (id: CulturalSurveyQuestionEnum | undefined) => {
  switch (id) {
    case CulturalSurveyQuestionEnum.SORTIES:
    case CulturalSurveyQuestionEnum.FESTIVALS:
    case CulturalSurveyQuestionEnum.SPECTACLES:
      return 'Tes sorties'
    case CulturalSurveyQuestionEnum.ACTIVITES:
      return 'Tes activités'
    default:
      return ''
  }
}

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
