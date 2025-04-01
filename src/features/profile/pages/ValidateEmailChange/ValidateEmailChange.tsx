import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStack'
import { RootStackParamList, StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { eventMonitoring } from 'libs/monitoring/services'
import { Separator } from 'ui/components/Separator'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo, getSpacing } from 'ui/theme'

type ValidateEmailChangeProps = NativeStackScreenProps<
  RootStackParamList & ProfileStackParamList,
  'ValidateEmailChange'
>

export function ValidateEmailChange({ route: { params }, navigation }: ValidateEmailChangeProps) {
  const { data: emailUpdateStatus, isLoading: isLoadingEmailUpdateStatus } = useEmailUpdateStatus()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  const mutate = useCallback(async () => {
    if (!params?.token || typeof params?.token !== 'string') {
      throw new Error(`Expected a string, but received ${typeof params?.token}`)
    }
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
      eventMonitoring.captureException(error)
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
    <GenericInfoPage
      illustration={BicolorPhonePending}
      title="Valides-tu la nouvelle adresse e-mail&nbsp;?"
      buttonPrimary={{
        wording: 'Valider l’adresse e-mail',
        onPress: handleSubmit,
        disabled: isLoading,
      }}
      buttonTertiary={{
        wording: 'Annuler',
        navigateTo: navigateToHomeConfig,
        icon: Invalidate,
        disabled: isLoading,
      }}>
      <Wrapper>
        <Typo.Body>Nouvelle adresse e-mail&nbsp;:</Typo.Body>
        <Typo.BodyAccent>{emailUpdateStatus?.newEmail}</Typo.BodyAccent>
        <Spacer.Column numberOfSpaces={4} />
        <Separator.Horizontal />
        <Spacer.Column numberOfSpaces={4} />
        <StyledCaption>
          En cliquant sur valider, tu seras déconnecté.e. Tu devras te reconnecter avec ta nouvelle
          adresse e-mail.
        </StyledCaption>
      </Wrapper>
    </GenericInfoPage>
  )
}

const Wrapper = styled.View({
  marginTop: getSpacing(4),
  alignItems: 'center',
})

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
