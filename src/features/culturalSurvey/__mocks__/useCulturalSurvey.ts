import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { mockedCulturalSurveyQuestions } from 'features/culturalSurvey/fixtures/mockedCulturalSurveyQuestions'
import { useCulturalSurveyQuestions as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/useCulturalSurvey'

export const useCulturalSurveyQuestions: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: mockedCulturalSurveyQuestions, isLoading: false, isSuccess: true } as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >)
)
