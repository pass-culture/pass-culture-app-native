import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { AccountState } from 'api/gen'
import { useAccountSuspensionStatus } from 'features/auth/api/useAccountSuspensionStatus'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { UserRequestedSuspendedAccount } from 'features/auth/pages/suspendedAccount/UserRequestedSuspendedAccount/UserRequestedSuspendedAccount'
import { navigateToHome, useCurrentRoute } from 'features/navigation/helpers'
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'
import { LoadingPage } from 'ui/components/LoadingPage'

export const SuspensionScreen = () => {
  const { data: accountSuspensionStatus, isLoading } = useAccountSuspensionStatus()
  const suspensionStatus = accountSuspensionStatus?.status
  const currentRoute = useCurrentRoute()
  const signOut = useLogoutRoutine()

  useFocusEffect(
    useCallback(() => {
      if (
        suspensionStatus &&
        ![
          AccountState.SUSPENDED_UPON_USER_REQUEST,
          AccountState.SUSPENDED,
          AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER,
        ].includes(suspensionStatus)
      ) {
        navigateToHome()
      }
    }, [suspensionStatus])
  )

  useEffect(() => {
    return () => {
      if (
        currentRoute?.name &&
        !['AccountReactivationSuccess', 'SuspensionScreen'].includes(currentRoute?.name)
      ) {
        signOut()
      }
    }
  }, [signOut, currentRoute?.name])

  if (isLoading) {
    return <LoadingPage />
  } else if (suspensionStatus === AccountState.SUSPENDED_UPON_USER_REQUEST) {
    return <UserRequestedSuspendedAccount />
  } else if (suspensionStatus === AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER) {
    return <SuspiciousLoginSuspendedAccount />
  } else {
    return <FraudulentSuspendedAccount />
  }
}
