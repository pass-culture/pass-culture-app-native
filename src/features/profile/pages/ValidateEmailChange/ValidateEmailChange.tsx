import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { RootStackParamList, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidateEmailChangeSubtitleComponent } from 'features/profile/pages/ValidateEmailChange/SubtitleComponent'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhiteLegacy } from 'ui/pages/GenericInfoPageWhiteLegacy'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, TypoDS } from 'ui/theme'

type ValidateEmailChangeProps = NativeStackScreenProps<RootStackParamList, 'ValidateEmailChange'>

export function ValidateEmailChange({ route: { params }, navigation }: ValidateEmailChangeProps) {
  const { data: emailUpdateStatus, isLoading: isLoadingEmailUpdateStatus } = useEmailUpdateStatus()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  const mutate = useCallback(async () => {
    return api.putNativeV1ProfileEmailUpdateValidate({
      token: params?.token,
    })
  }, [params?.token])

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    try {
      await mutate()
      // A technical constraint requires disconnection for the moment. Possible improvement later
      if (isLoggedIn) {
        await signOut()
      }
      showSuccessSnackBar({
        message:
          'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigation.reset({
        routes: [{ name: 'Login', params: { from: StepperOrigin.VALIDATE_EMAIL_CHANGE } }],
      })
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
        return
      }
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigation.replace(...homeNavConfig)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn, mutate, navigation, showErrorSnackBar, showSuccessSnackBar, signOut])

  useEffect(() => {
    if (!isLoadingEmailUpdateStatus) {
      if (!emailUpdateStatus) {
        navigation.replace(...homeNavConfig)
      }
      if (emailUpdateStatus?.expired) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
      }
    }
  }, [emailUpdateStatus, isLoadingEmailUpdateStatus, navigation])

  return (
    <GenericInfoPageWhiteLegacy
      icon={BicolorPhonePending}
      titleComponent={TypoDS.Title3}
      title="Valides-tu la nouvelle adresse e-mail&nbsp;?"
      subtitle={emailUpdateStatus?.newEmail || undefined}
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
        wording="Annuler"
        navigateTo={navigateToHomeConfig}
        icon={Invalidate}
        disabled={isLoading}
      />
    </GenericInfoPageWhiteLegacy>
  )
}
