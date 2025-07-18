import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { ApiError } from 'api/ApiError'
import { AccountState } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useConfirmChangeEmailMutationV2 } from 'features/profile/helpers/useConfirmChangeEmailMutationV2'
import { isTimestampExpired } from 'libs/dates'
import { eventMonitoring } from 'libs/monitoring/services'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PhonePending } from 'ui/svg/icons/PhonePending'

export function ConfirmChangeEmail() {
  const { replace, reset } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ConfirmChangeEmail'>>()
  const loginRoutine = useLoginRoutine()
  const { showErrorSnackBar } = useSnackBarContext()
  const { mutate, isLoading } = useConfirmChangeEmailMutationV2({
    onSuccess: async ({
      accessToken,
      refreshToken,
      newEmailSelectionToken,
      resetPasswordToken,
    }) => {
      await loginRoutine(
        { accessToken, refreshToken, accountState: AccountState.ACTIVE },
        'fromConfirmChangeEmail'
      )

      if (resetPasswordToken) {
        replace(
          ...getProfileHookConfig('ChangeEmailSetPassword', {
            token: resetPasswordToken,
            emailSelectionToken: newEmailSelectionToken,
          })
        )
      } else {
        replace(...getProfileHookConfig('NewEmailSelection', { token: newEmailSelectionToken }))
      }
    },
    onError: (error) => {
      eventMonitoring.captureException(error)
      if (error instanceof ApiError && error.statusCode === 401) {
        reset({ index: 0, routes: [{ name: 'ChangeEmailExpiredLink' }] })
        return
      }
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const onConfirmEmail = useCallback(() => {
    if (!params?.token || typeof params?.token !== 'string') {
      eventMonitoring.captureException(
        new Error(`Expected a string, but received ${typeof params?.token}`)
      )
      return
    }
    mutate({ token: params?.token })
  }, [params?.token, mutate])

  if (params?.expiration_timestamp && isTimestampExpired(params.expiration_timestamp)) {
    reset({ index: 0, routes: [{ name: 'ChangeEmailExpiredLink' }] })
    return null
  }

  return (
    <GenericInfoPage
      illustration={PhonePending}
      title="Confirmes-tu la demande de changement d’e-mail&nbsp;?"
      buttonPrimary={{
        wording: 'Confirmer la demande',
        onPress: onConfirmEmail,
        disabled: isLoading,
      }}
      buttonTertiary={{
        wording: 'Annuler',
        navigateTo: navigateToHomeConfig,
        icon: Invalidate,
        disabled: isLoading,
      }}
    />
  )
}
