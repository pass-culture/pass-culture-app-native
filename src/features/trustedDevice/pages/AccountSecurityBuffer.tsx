import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import {
  AccountSecurityStatus,
  useAccountSuspendTokenValidationQuery,
} from 'features/trustedDevice/queries/useAccountSuspendTokenValidationQuery'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const AccountSecurityBuffer = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'AccountSecurityBuffer'>>()

  const { data: tokenStatus, isLoading } = useAccountSuspendTokenValidationQuery(params.token)

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
      replace('AccountSecurity', params)
    }
  }, [params, replace, showErrorSnackBar, tokenStatus])

  if (isLoading) {
    return <LoadingPage />
  }

  return null
}
