import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { AccountState } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { FraudulentAccount } from 'features/auth/suspendedAccount/FraudulentAccount/FraudulentAccount'
import { SuspendedAccount } from 'features/auth/suspendedAccount/SuspendedAccount/SuspendedAccount'
import { useAccountSuspensionStatus } from 'features/auth/suspendedAccount/SuspensionScreen/useAccountSuspensionStatus'
import { navigateToHome } from 'features/navigation/helpers'
import { LoadingPage } from 'ui/components/LoadingPage'

export const SuspensionScreen = () => {
  const { data: settings } = useAppSettings()
  const { data: accountSuspensionStatus, isLoading } = useAccountSuspensionStatus()
  const suspensionStatus = accountSuspensionStatus?.status

  useFocusEffect(
    useCallback(() => {
      if (
        !settings?.allowAccountReactivation ||
        (suspensionStatus &&
          ![AccountState.SUSPENDED_UPON_USER_REQUEST, AccountState.SUSPENDED].includes(
            suspensionStatus
          ))
      ) {
        navigateToHome()
      }
    }, [settings, suspensionStatus])
  )

  if (isLoading) {
    return <LoadingPage />
  } else if (suspensionStatus === AccountState.SUSPENDED_UPON_USER_REQUEST) {
    return <SuspendedAccount />
  } else {
    return <FraudulentAccount />
  }
}
