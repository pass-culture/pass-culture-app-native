import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'

import { ApiError } from 'api/ApiError'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useConfirmChangeEmailMutationV1 } from 'features/profile/helpers/useConfirmChangeEmailMutationV1'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer } from 'ui/theme'

export const ConfirmChangeEmailContentDeprecated = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ConfirmChangeEmail'>>()
  const { data: emailUpdateStatus, isLoading: isLoadingEmailUpdateStatus } = useEmailUpdateStatus()
  const { showErrorSnackBar } = useSnackBarContext()
  const { mutate, isLoading } = useConfirmChangeEmailMutationV1({
    onSuccess: () => navigate('TrackEmailChange'),
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 401) {
        navigate('ChangeEmailExpiredLink')
        return
      }
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToHome()
    },
  })

  useEffect(() => {
    if (!isLoadingEmailUpdateStatus && emailUpdateStatus?.expired) {
      navigate('ChangeEmailExpiredLink')
    }
  }, [emailUpdateStatus, isLoadingEmailUpdateStatus, navigate])

  const onConfirmEmail = useCallback(
    () => mutate({ token: params?.token }),
    [params?.token, mutate]
  )

  return (
    <React.Fragment>
      <ButtonPrimary
        wording="Confirmer la demande"
        accessibilityLabel="Confirmer la demande"
        onPress={onConfirmEmail}
        disabled={isLoading}
      />
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
