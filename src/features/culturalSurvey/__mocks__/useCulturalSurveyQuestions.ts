import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { mockCulturalSurveyQuestions } from 'features/culturalSurvey/__mocks__/culturalSurveyQuestions'
import { useCulturalSurveyQuestions as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/useCulturalSurveyQuestions'

export const useCulturalSurveyQuestions: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: mockCulturalSurveyQuestions, isLoading: false, isSuccess: true } as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >)
)
