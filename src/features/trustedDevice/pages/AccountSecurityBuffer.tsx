import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import {
  AccountSecurityStatus,
  useAccountSuspendTokenValidation,
} from 'features/trustedDevice/api/useAccountSuspendTokenValidation'
import { LoadingPage } from 'ui/components/LoadingPage'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const AccountSecurityBuffer = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'AccountSecurityBuffer'>>()

  const { data: tokenStatus, isLoading } = useAccountSuspendTokenValidation(params.token)

  const { showErrorSnackBar } = useSnackBarContext()

  useEffect(() => {
    if (tokenStatus === AccountSecurityStatus.EXPIRED_TOKEN) {
      replace('SuspensionChoiceExpiredLink')
    }

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

    if (tokenStatus === AccountSecurityStatus.VALID_TOKEN) {
      replace('AccountSecurity', { token: params.token })
    }
  }, [params.token, replace, showErrorSnackBar, tokenStatus])

  if (isLoading) {
    return <LoadingPage />
  }

  return <React.Fragment />
}
