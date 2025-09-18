import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CULTURAL_SURVEY_QUESTIONS = 5 * 60 * 1000

export const useCulturalSurveyQuestionsQuery = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.CULTURAL_SURVEY_QUESTIONS],
    queryFn: () => api.getNativeV1CulturalSurveyQuestions(),
    staleTime: STALE_TIME_CULTURAL_SURVEY_QUESTIONS,
    enabled: isLoggedIn,
  })
}
