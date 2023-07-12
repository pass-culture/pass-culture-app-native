import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidateEmailChangeSubtitleComponent } from 'features/profile/pages/ValidateEmailChange/SubtitleComponent'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

type ValidateEmailChangeProps = NativeStackScreenProps<RootStackParamList, 'ValidateEmailChange'>

export function ValidateEmailChange({ route: { params }, navigation }: ValidateEmailChangeProps) {
  const { data: emailUpdateStatus, isLoading: isLoadingEmailUpdateStatus } = useEmailUpdateStatus()
  const { showSuccessSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  const mutate = useCallback(async () => {
    return api.putnativev1profileemailUpdatevalidate({
      token: params?.token,
    })
  }, [params?.token])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    try {
      await mutate()
      if (isLoggedIn) {
        await signOut()
      }
      navigation.navigate('Login')
      showSuccessSnackBar({
        message:
          'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    } catch (error) {
      navigation.navigate('ChangeEmailExpiredLink')
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn, mutate, navigation, showSuccessSnackBar, signOut])

  useEffect(() => {
    if (!isLoadingEmailUpdateStatus && (!emailUpdateStatus || emailUpdateStatus?.expired)) {
      navigateToHome()
    }
  }, [emailUpdateStatus, isLoadingEmailUpdateStatus])

  return (
    <GenericInfoPageWhite
      icon={BicolorPhonePending}
      titleComponent={Typo.Title3}
      title="Valides-tu la nouvelle adresse e-mail&nbsp;?"
      subtitle={emailUpdateStatus?.newEmail}
      subtitleComponent={ValidateEmailChangeSubtitleComponent}
      separateIconFromTitle={false}
      mobileBottomFlex={0.3}>
      <Spacer.Column numberOfSpaces={40} />
      <ButtonPrimary
        wording="Valider l’adresse e-mail"
        accessibilityLabel="Valider l’adresse e-mail"
        onPress={handleSubmit}
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
  )
}
