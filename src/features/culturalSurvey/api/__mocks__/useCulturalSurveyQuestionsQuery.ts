import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useCulturalSurveyQuestionsQuery as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/api/useCulturalSurveyQuestionsQuery'
import { culturalSurveyQuestionsFixture } from 'features/culturalSurvey/fixtures/culturalSurveyQuestions.fixture'

export const useCulturalSurveyQuestionsQuery: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: culturalSurveyQuestionsFixture, isLoading: false, isSuccess: true }) as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >
)
