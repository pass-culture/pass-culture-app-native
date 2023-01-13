import { useNavigation } from '@react-navigation/native'
import React, { ComponentType, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useQueryClient } from 'react-query'
import { v1 as uuidv1 } from 'uuid'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { shouldShowCulturalSurvey } from 'features/culturalSurvey/helpers/utils'
import { navigateToHome, useCurrentRoute } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { env } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { LoadingPage } from 'ui/components/LoadingPage'

const FORM_ID = env.CULTURAL_SURVEY_TYPEFORM_ID
const source = Platform.select({ web: 'web', ios: 'ios', android: 'android' }) || ''

type CulturalSurveyConfig = {
  url: string
  formId: string
  userId: string
  userPk: string
  source: string
}
type CulturalSurveyProps = {
  culturalSurveyConfig: CulturalSurveyConfig
  onCulturalSurveyExit: (userId: string | null, userPk: string) => void
}

export function withCulturalSurveyProvider(
  WrappedCulturalSurvey: ComponentType<CulturalSurveyProps>
) {
  return function CulturalSurveyProvider() {
    const [culturalSurveyConfig, setCulturalSurveyConfig] = useState<
      CulturalSurveyConfig | undefined
    >()
    const onCulturalSurveyExit = useOnCulturalSurveyExit()
    const { user, isUserLoading } = useAuthContext()

    const currentRoute = useCurrentRoute()
    const { navigate } = useNavigation<UseNavigationType>()

    useEffect(() => {
      if (isUserLoading) return
      if (user && shouldShowCulturalSurvey(user)) {
        const userId = encodeURIComponent(uuidv1()) // legacy issue : the query param userId is not the actual `user.id`
        const userPk = user.id.toString()
        const url = `https://passculture.typeform.com/to/${FORM_ID}?userId=${userId}&userPk=${userPk}&source=${source}`
        setCulturalSurveyConfig({ url, formId: FORM_ID, userId, userPk, source })
        return
      }
      navigate(...homeNavConfig)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isUserLoading])

    if (currentRoute?.name !== 'CulturalSurvey') return null
    if (!culturalSurveyConfig) return <LoadingPage />
    return (
      <WrappedCulturalSurvey
        culturalSurveyConfig={culturalSurveyConfig}
        onCulturalSurveyExit={onCulturalSurveyExit}
      />
    )
  }
}

function useOnCulturalSurveyExit() {
  const queryClient = useQueryClient()
  return async function (userId: string | null, userPk: string) {
    try {
      await api.postnativev1meculturalSurvey({
        culturalSurveyId: userId,
        needsToFillCulturalSurvey: false,
      })
    } catch (error) {
      throw new MonitoringError(
        `User profile could not be updated: typeform with userId ${userId} and userPk ${userPk}. 
        Cause: ` + error,
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
