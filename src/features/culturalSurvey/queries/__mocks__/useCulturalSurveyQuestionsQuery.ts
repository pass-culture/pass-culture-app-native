import { UseQueryResult } from '@tanstack/react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { culturalSurveyQuestionsFixture } from 'features/culturalSurvey/fixtures/culturalSurveyQuestions.fixture'
import { useCulturalSurveyQuestionsQuery as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/queries/useCulturalSurveyQuestionsQuery'

export const useCulturalSurveyQuestionsQuery: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: culturalSurveyQuestionsFixture, isLoading: false, isSuccess: true }) as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >
)
