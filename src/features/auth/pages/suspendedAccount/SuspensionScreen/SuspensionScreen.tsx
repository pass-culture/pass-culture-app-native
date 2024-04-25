import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { AccountState } from 'api/gen'
import { useAccountSuspensionStatus } from 'features/auth/api/useAccountSuspensionStatus'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { SuspendedAccountUponUserRequest } from 'features/auth/pages/suspendedAccount/SuspendedAccountUponUserRequest/SuspendedAccountUponUserRequest'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
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
    return <SuspendedAccountUponUserRequest />
  } else if (suspensionStatus === AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER) {
    return <SuspiciousLoginSuspendedAccount />
  } else {
    return <FraudulentSuspendedAccount />
  }
}
