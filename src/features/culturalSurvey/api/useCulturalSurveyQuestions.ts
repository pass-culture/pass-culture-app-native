import { useQuery } from 'react-query'

import { api } from 'api/api'
import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'
import { useShouldShowCulturalSurvey } from 'shared/culturalSurvey/useShouldShowCulturalSurvey'

const STALE_TIME_CULTURAL_SURVEY_QUESTIONS = 5 * 60 * 1000

export function useCulturalSurveyQuestions() {
  const { user } = useAuthContext()
  const netInfo = useNetInfoContext()
  const shouldShowCulturalSurvey = useShouldShowCulturalSurvey()
  const shouldRequestCulturalSurveyQuestions = shouldShowCulturalSurvey(user)

  return useQuery<CulturalSurveyQuestionsResponse>(
    [QueryKeys.CULTURAL_SURVEY_QUESTIONS],
    () => api.getNativeV1CulturalSurveyQuestions(),
    {
      staleTime: STALE_TIME_CULTURAL_SURVEY_QUESTIONS,
      enabled: !!netInfo.isConnected && shouldRequestCulturalSurveyQuestions,
    }
  )
}
