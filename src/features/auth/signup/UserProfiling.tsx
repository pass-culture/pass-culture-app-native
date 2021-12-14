import Profiling from '@pass-culture/react-native-profiling'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { api } from 'api/api'
import { UserProfilingFraudRequest } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { env } from 'libs/environment'
import { ScreenErrorProps } from 'libs/monitoring/errors'
// eslint-disable-next-line no-restricted-imports
import { isDesktopDeviceDetectOnWeb } from 'libs/react-device-detect'
import { LoadingPage } from 'ui/components/LoadingPage'

const AGENT_TYPE = Platform.select({
  default: 'agent_mobile',
  web: isDesktopDeviceDetectOnWeb ? 'browser_computer' : 'browser_mobile',
})

// Profiling.profileDevice will first get sessionId then call profiling,
// it must last minimum 5 secondes before submitting the sessionId to the API
const PROFILING_MIN_DELAY_MS = 5000

export function UserProfiling({ resetErrorBoundary }: ScreenErrorProps) {
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [genericError, setError] = useState<Error | undefined>()
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation(setError)
  const startProfiling = useCallback(() => {
    setSessionId(undefined)
    Profiling.profileDevice(
      env.TMX_ORGID,
      env.TMX_FPSERVER,
      setSessionId,
      () => api.getnativev1userProfilingsessionId(),
      (err) => setError(err as Error)
    )
  }, [])

  useFocusEffect(startProfiling)

  useEffect(() => {
    if (sessionId === undefined) {
      return
    }

    setTimeout(() => {
      api
        .postnativev1userProfiling({
          agentType: AGENT_TYPE,
          sessionId,
        } as UserProfilingFraudRequest)
        .then(navigateToNextBeneficiaryValidationStep)
        .then(resetErrorBoundary)
        .catch(setError)
    }, PROFILING_MIN_DELAY_MS)
  }, [sessionId])

  if (genericError) {
    throw genericError
  }

  return <LoadingPage />
}
