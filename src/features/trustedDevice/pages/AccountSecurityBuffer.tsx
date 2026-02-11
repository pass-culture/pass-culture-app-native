import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import {
  AccountSecurityStatus,
  useAccountSuspendTokenValidationQuery,
} from 'features/trustedDevice/queries/useAccountSuspendTokenValidationQuery'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { LoadingPage } from 'ui/pages/LoadingPage'

export const AccountSecurityBuffer = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'AccountSecurityBuffer'>>()

  const { data: tokenStatus, isLoading } = useAccountSuspendTokenValidationQuery(params.token)

  useEffect(() => {
    if (tokenStatus === AccountSecurityStatus.EXPIRED_TOKEN) {
      replace('SuspensionChoiceExpiredLink')
    }

    if (tokenStatus === AccountSecurityStatus.INVALID_TOKEN) {
      navigateToHome()
      showErrorSnackBar('Une erreur est survenue pour cause de lien invalide.')
    }

    if (tokenStatus === AccountSecurityStatus.VALID_TOKEN) {
      replace('AccountSecurity', params)
    }
  }, [params, replace, tokenStatus])

  if (isLoading) {
    return <LoadingPage />
  }

  return null
}
