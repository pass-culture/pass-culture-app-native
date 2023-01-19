import { CulturalSurveyQuestionEnum } from 'api/gen/api'

const isCurrentQuestionLastQuestion = false
const nextQuestion = CulturalSurveyQuestionEnum.SORTIES

export const useGetNextQuestion = jest.fn(() => ({ isCurrentQuestionLastQuestion, nextQuestion }))
