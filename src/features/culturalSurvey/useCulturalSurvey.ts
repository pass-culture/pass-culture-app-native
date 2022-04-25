import { useQuery } from 'react-query'

import { api } from 'api/api'
import { CulturalSurveyQuestionsResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { shouldShowCulturalSurvey } from 'features/culturalSurvey/helpers/utils'
import { useUserProfileInfo } from 'features/home/api'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_CULTURAL_SURVEY_QUESTIONS = 5 * 60 * 1000

export function useCulturalSurveyQuestions() {
  const { data: user } = useUserProfileInfo()
  const { data: settings } = useAppSettings()

  const shouldRequestCulturalSurveyQuestions =
    shouldShowCulturalSurvey(user) && settings?.enableNativeCulturalSurvey

  return useQuery<CulturalSurveyQuestionsResponse>(
    QueryKeys.CULTURAL_SURVEY_QUESTIONS,
    () => api.getnativev1culturalSurveyquestions(),
    {
      staleTime: STALE_TIME_CULTURAL_SURVEY_QUESTIONS,
      enabled: shouldRequestCulturalSurveyQuestions,
    }
  )
}
