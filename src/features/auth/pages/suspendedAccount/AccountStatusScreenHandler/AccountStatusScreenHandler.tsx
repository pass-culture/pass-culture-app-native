import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { AccountState } from 'api/gen'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { FraudulentSuspendedAccount } from 'features/auth/pages/suspendedAccount/FraudulentSuspendedAccount/FraudulentSuspendedAccount'
import { SuspendedAccountUponUserRequest } from 'features/auth/pages/suspendedAccount/SuspendedAccountUponUserRequest/SuspendedAccountUponUserRequest'
import { useAccountSuspensionStatusQuery } from 'features/auth/queries/useAccountSuspensionStatusQuery'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { useCurrentRoute } from 'features/navigation/helpers/useCurrentRoute'
import { DeleteProfileSuccess } from 'features/profile/pages/DeleteProfile/DeleteProfileSuccess'
import { SuspiciousLoginSuspendedAccount } from 'features/trustedDevice/pages/SuspiciousLoginSuspendedAccount'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const AccountStatusScreenHandler = () => {
  const { data: accountSuspensionStatus, isInitialLoading: isLoading } =
    useAccountSuspensionStatusQuery()
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
          AccountState.WAITING_FOR_ANONYMIZATION,
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
        !['AccountReactivationSuccess', 'AccountStatusScreenHandler'].includes(currentRoute?.name)
      ) {
        signOut()
      }
    }
  }, [signOut, currentRoute?.name])

  if (isLoading) {
    return <LoadingPage />
  }
  if (suspensionStatus === AccountState.SUSPENDED_UPON_USER_REQUEST) {
    return <SuspendedAccountUponUserRequest />
  }
  if (suspensionStatus === AccountState.SUSPICIOUS_LOGIN_REPORTED_BY_USER) {
    return <SuspiciousLoginSuspendedAccount />
  }
  if (suspensionStatus === AccountState.WAITING_FOR_ANONYMIZATION) {
    return <DeleteProfileSuccess />
  } else {
    return <FraudulentSuspendedAccount />
  }
}
