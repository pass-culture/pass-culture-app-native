import { CulturalSurveyQuestionEnum } from 'api/gen'

const dispatch = jest.fn()

const questionsToDisplay = [] as CulturalSurveyQuestionEnum[]

export const useCulturalSurveyContext = jest.fn().mockReturnValue({ dispatch, questionsToDisplay })
