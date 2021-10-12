import { Platform } from 'react-native'
import { useQueryClient } from 'react-query'
import { v1 as uuidv1 } from 'uuid'

import { api } from 'api/api'
import { UserProfileResponse } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'

const FORM_ID = env.CULTURAL_SURVEY_TYPEFORM_ID
const source = Platform.select({ web: 'web', ios: 'ios', android: 'android' }) || ''

export function useCulturalSurveyConfig():
  | { url: string; formId: string; userId: string; userPk: string; source: string }
  | undefined {
  const { data: user } = useUserProfileInfo()
  if (!user) {
    return undefined
  }
  const userId = encodeURIComponent(uuidv1()) // legacy issue : the query param userId is not the actual `user.id`
  const userPk = user.id.toString()
  const url = `https://passculture.typeform.com/to/${FORM_ID}?userId=${userId}&userPk=${userPk}&source=${source}`
  return { url, formId: FORM_ID, userId, userPk, source }
}

export function useOnCulturalSurveyExit() {
  const queryClient = useQueryClient()
  return function (userId: string | null, userPk: string) {
    try {
      api.postnativev1meculturalSurvey({
        culturalSurveyId: userId,
        needsToFillCulturalSurvey: false,
      })
    } catch (error) {
      throw new MonitoringError(
        `User profile could not be updated : typeform with userId ${userId} and userPk ${userPk}. 
        Cause : ` + error,
        'UserProfileUpdateDuringCulturalSurvey'
      )
    } finally {
      // we need to invalidate user profile query in order to update home
      // and profile pages with the latest user information.
      queryClient.invalidateQueries(QueryKeys.USER_PROFILE)
      navigateToHome()
    }
  }
}

export function shouldShowCulturalSurvey(user?: UserProfileResponse) {
  if (!user) return false
  return user.isBeneficiary && user.needsToFillCulturalSurvey
}
