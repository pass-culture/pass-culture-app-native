import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { AccountState } from 'api/gen'
import { useLogoutRoutine } from 'features/auth/logout/useLogoutRoutine'
import { FraudulentAccount } from 'features/auth/suspendedAccount/FraudulentAccount/FraudulentAccount'
import { SuspendedAccount } from 'features/auth/suspendedAccount/SuspendedAccount/SuspendedAccount'
import { useAccountSuspensionStatus } from 'features/auth/suspendedAccount/SuspensionScreen/useAccountSuspensionStatus'
import { navigateToHome, useCurrentRoute } from 'features/navigation/helpers'
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
        ![AccountState.SUSPENDED_UPON_USER_REQUEST, AccountState.SUSPENDED].includes(
          suspensionStatus
        )
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
    return <SuspendedAccount />
  } else {
    return <FraudulentAccount />
  }
}
