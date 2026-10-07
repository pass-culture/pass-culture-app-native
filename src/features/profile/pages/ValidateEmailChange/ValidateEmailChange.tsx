import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { saveLastLoginInfo } from 'features/auth/helpers/saveLastLoginInfo'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { Provider } from 'features/auth/types'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { resetFromRef } from 'features/navigation/navigationRef'
import { ProfileStackParamList } from 'features/navigation/navigators/ProfileStackNavigator/types'
import {
  RootStackParamList,
  StepperOrigin,
} from 'features/navigation/navigators/RootNavigator/types'
import { useEmailUpdateStatusQuery } from 'features/profile/queries/useEmailUpdateStatusQuery'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring/services'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { Separator } from 'ui/components/Separator'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { PhonePending } from 'ui/svg/icons/PhonePending'
import { Typo } from 'ui/theme'

type ValidateEmailChangeProps = NativeStackScreenProps<
  RootStackParamList & ProfileStackParamList,
  'ValidateEmailChange'
>

export function ValidateEmailChange({ route: { params }, navigation }: ValidateEmailChangeProps) {
  const { data: emailUpdateStatus, isFetched: isFetchedEmailUpdateStatus } =
    useEmailUpdateStatusQuery()

  const [isLoading, setIsLoading] = useState(false)

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

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

      if (emailUpdateStatus?.newEmail) {
        await saveLastLoginInfo({ email: emailUpdateStatus.newEmail, provider: Provider.EMAIL })
      }

      // A technical constraint requires disconnection for the moment. Possible improvement later
      if (isLoggedIn) {
        await signOut()
      }

      showSuccessSnackBar(
        'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.'
      )

      // We use resetFromRef instead of reset because signOut() may unmount the current screen
      // (RootNavigator rebuild). resetFromRef ensures navigation still works after logout.
      resetFromRef('LoginMethods', { from: StepperOrigin.VALIDATE_EMAIL_CHANGE })
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
        return
      }
      showErrorSnackBar(
        'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.'
      )
      eventMonitoring.captureException(error)
      navigation.reset({
        routes: [{ name: 'TabNavigator', params: { screen: 'Home', params: undefined } }],
      })
    } finally {
      setIsLoading(false)
    }
  }, [emailUpdateStatus?.newEmail, isLoggedIn, mutate, navigation, signOut])

  useEffect(
    function redirectFromEmailUpdateStatus() {
      if (!isFetchedEmailUpdateStatus) return

      if (!emailUpdateStatus) {
        navigation.reset({
          routes: [{ name: 'TabNavigator', params: { screen: 'Home', params: undefined } }],
        })
        return
      }

      if (emailUpdateStatus.expired) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
      }
    },
    [emailUpdateStatus, isFetchedEmailUpdateStatus, navigation]
  )

  return (
    <GenericInfoPage
      illustration={PhonePending}
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
      }}
      remoteIllustration={
        enableNewVisionUi
          ? {
              url: remoteIllustrationUrls.phoneHourglass,
              backgroundColor: 'pending01',
            }
          : undefined
      }>
      <Wrapper>
        <Typo.Body>Nouvelle adresse e-mail&nbsp;:</Typo.Body>
        <Typo.BodyAccent>{emailUpdateStatus?.newEmail}</Typo.BodyAccent>
        <Separator.HorizontalWithMargin />
        <StyledCaption>
          En cliquant sur valider, tu seras déconnecté.e. Tu devras te reconnecter avec ta nouvelle
          adresse e-mail.
        </StyledCaption>
      </Wrapper>
    </GenericInfoPage>
  )
}

const Wrapper = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  alignItems: 'center',
}))

const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.subtle,
}))
