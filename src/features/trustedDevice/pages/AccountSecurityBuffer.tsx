import { useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import {
  AccountSecurityStatus,
  useAccountSuspendTokenValidation,
} from 'features/trustedDevice/api/useAccountSuspendTokenValidation'
import { AccountSecurity } from 'features/trustedDevice/pages/AccountSecurity'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const AccountSecurityBuffer = () => {
  const { params } = useRoute<UseRouteType<'AccountSecurityBuffer'>>()

  const { data: tokenStatus, isLoading } = useAccountSuspendTokenValidation(params.token)

  const { showErrorSnackBar } = useSnackBarContext()

  useEffect(() => {
    if (tokenStatus === AccountSecurityStatus.INVALID_TOKEN) {
      const navigateToHomeWithErrorSnackBar = () => {
        navigateToHome()
        showErrorSnackBar({
          message: 'Une erreur est survenue pour cause de lien invalide.',
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
      navigateToHomeWithErrorSnackBar()
    }
  }, [showErrorSnackBar, tokenStatus])

  if (isLoading) {
    return <LoadingPage />
  }

  switch (tokenStatus) {
    case AccountSecurityStatus.EXPIRED_TOKEN:
      return <SuspensionChoiceExpiredLink />

    case AccountSecurityStatus.INVALID_TOKEN:
      return <React.Fragment />

    case AccountSecurityStatus.VALID_TOKEN:
      return <AccountSecurity />
  }

  return <React.Fragment />
}
