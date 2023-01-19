import { UseQueryResult } from 'react-query'

import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useCulturalSurveyQuestions as actualUseCulturalSurveyQuestions } from 'features/culturalSurvey/api/useCulturalSurveyQuestions'
import { culturalSurveyQuestionsFixture } from 'features/culturalSurvey/fixtures/culturalSurveyQuestions.fixture'

export const useCulturalSurveyQuestions: typeof actualUseCulturalSurveyQuestions = jest.fn(
  () =>
    ({ data: culturalSurveyQuestionsFixture, isLoading: false, isSuccess: true } as UseQueryResult<
      CulturalSurveyQuestionsResponse,
      unknown
    >)
)
