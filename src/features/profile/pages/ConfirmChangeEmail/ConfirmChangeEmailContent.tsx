import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { ApiError } from 'api/ApiError'
import { AccountState } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useConfirmChangeEmailMutationV2 } from 'features/profile/helpers/useConfirmChangeEmailMutationV2'
import { isTimestampExpired } from 'libs/dates'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'

export const ConfirmChangeEmailContent = () => {
  const { navigate } = useNavigation<UseNavigationType>()
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
        navigate('ChangeEmailSetPassword', { token: resetPasswordToken })
      } else {
        navigate('NewEmailSelection', { token: newEmailSelectionToken })
      }
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        navigate('ChangeEmailExpiredLink')
        return
      }
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const onConfirmEmail = useCallback(
    () => mutate({ token: params?.token }),
    [params?.token, mutate]
  )

  if (isTimestampExpired(params.expiration_timestamp)) {
    navigate('ChangeEmailExpiredLink')
    return null
  }

  return (
    <React.Fragment>
      <ButtonPrimary wording="Confirmer la demande" onPress={onConfirmEmail} disabled={isLoading} />
      <Spacer.Column numberOfSpaces={4} />
      <InternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Annuler"
        navigateTo={navigateToHomeConfig}
        icon={Invalidate}
        disabled={isLoading}
      />
    </React.Fragment>
  )
}
