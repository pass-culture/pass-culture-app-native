import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { ApiError } from 'api/ApiError'
import { AccountState } from 'api/gen'
import { useLoginRoutine } from 'features/auth/helpers/useLoginRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
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
          ...getProfileStackConfig('ChangeEmailSetPassword', {
            token: resetPasswordToken,
            emailSelectionToken: newEmailSelectionToken,
          })
        )
      } else {
        replace(...getProfileStackConfig('NewEmailSelection', { token: newEmailSelectionToken }))
      }
    },
    onError: (error) => {
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
    if (!params?.token) return
    mutate({ token: params?.token })
  }, [params?.token, mutate])

  if (params?.expiration_timestamp && isTimestampExpired(params.expiration_timestamp)) {
    reset({ index: 0, routes: [{ name: 'ChangeEmailExpiredLink' }] })
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
