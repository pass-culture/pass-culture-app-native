import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CULTURAL_SURVEY_QUESTIONS = 5 * 60 * 1000

export function useCulturalSurveyQuestionsQuery() {
  const { isLoggedIn } = useAuthContext()

  return useQuery<CulturalSurveyQuestionsResponse>(
    [QueryKeys.CULTURAL_SURVEY_QUESTIONS],
    () => api.getNativeV1CulturalSurveyQuestions(),
    {
      staleTime: STALE_TIME_CULTURAL_SURVEY_QUESTIONS,
      enabled: isLoggedIn,
    }
  )
}
