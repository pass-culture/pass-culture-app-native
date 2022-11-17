import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useCulturalSurveyQuestions as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/api/useCulturalSurveyQuestions'
import { mockedCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/mockedCulturalSurveyQuestions'

export const useCulturalSurveyQuestions: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: mockedCulturalSurveyQuestions, isLoading: false, isSuccess: true } as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >)
)
