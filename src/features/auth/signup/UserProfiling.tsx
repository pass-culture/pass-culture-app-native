import Profiling from '@pass-culture/react-native-profiling'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { api } from 'api/api'
import { UserProfilingFraudRequest } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'
import { LoadingPage } from 'ui/components/LoadingPage'

const AGENT_TYPE = Platform.select({
  default: 'agent_mobile',
  web: isDesktopDeviceDetectOnWeb ? 'browser_computer' : 'browser_mobile',
})

export function UserProfiling() {
  const [sessionId, setSessionId] = useState<string | undefined>()
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

  useFocusEffect(
    useCallback(() => {
      Profiling.profileDevice(
        env.TMX_ORGID,
        env.TMX_FPSERVER,
        setSessionId,
        () => api.getnativev1userProfilingsessionId(),
        eventMonitoring.captureException
      )
    }, [])
  )

  useEffect(() => {
    if (!sessionId) {
      eventMonitoring.captureException(new Error('TMX sessionId is null'))
    } else {
      api
        .postnativev1userProfiling({
          agentType: AGENT_TYPE,
          sessionId,
        } as UserProfilingFraudRequest)
        .then(navigateToNextBeneficiaryValidationStep)
        .catch(eventMonitoring.captureException)
    }
  }, [sessionId])

  return <LoadingPage />
}
