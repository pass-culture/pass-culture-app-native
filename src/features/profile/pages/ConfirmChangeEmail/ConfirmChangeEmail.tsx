import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { api } from 'api/api'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

type ConfirmChangeEmailProps = NativeStackScreenProps<RootStackParamList, 'ConfirmChangeEmail'>

export function ConfirmChangeEmail({ route: { params }, navigation }: ConfirmChangeEmailProps) {
  const emailUpdateStatus = useEmailUpdateStatus()
  const { showErrorSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (emailUpdateStatus?.data?.expired) {
      navigateToHome()
    }
  }, [emailUpdateStatus.data?.expired])

  const mutate = useCallback(async () => {
    return api.postnativev1profileemailUpdateconfirm({
      token: params?.token,
    })
  }, [params?.token])

  const onConfirmEmail = useCallback(async () => {
    setIsLoading(true)
    try {
      await mutate()
      navigation.navigate('TrackEmailChange')
    } catch (err) {
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToHome()
    } finally {
      setIsLoading(false)
    }
  }, [mutate, navigation, showErrorSnackBar])

  return (
    <React.Fragment>
      <GenericInfoPageWhite
        icon={BicolorPhonePending}
        titleComponent={Typo.Title3}
        title="Confirmes-tu la demande de changement d’e-mail&nbsp;?"
        separateIconFromTitle={false}
        mobileBottomFlex={0.3}>
        <Spacer.Column numberOfSpaces={40} />
        <ButtonPrimary
          wording="Confirmer la demande"
          accessibilityLabel="Confirmer la demande"
          onPress={onConfirmEmail}
          disabled={isLoading}
        />
        <Spacer.Column numberOfSpaces={4} />
        <InternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Fermer"
          navigateTo={navigateToHomeConfig}
          icon={Invalidate}
          disabled={isLoading}
        />
      </GenericInfoPageWhite>
    </React.Fragment>
  )
}
