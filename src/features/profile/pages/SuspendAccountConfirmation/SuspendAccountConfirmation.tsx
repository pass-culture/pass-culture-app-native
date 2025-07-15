import React, { useCallback, useEffect, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { ProfileStackParamList } from 'features/navigation/ProfileStackNavigator/ProfileStackTypes'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { UserError } from 'ui/svg/UserError'
import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

type SuspendAccountConfirmationProps = NativeStackScreenProps<
  RootStackParamList & ProfileStackParamList,
  'SuspendAccountConfirmation'
>

export function SuspendAccountConfirmation({
  route: { params },
  navigation,
}: SuspendAccountConfirmationProps) {
  const { data: emailUpdateStatus, isInitialLoading: isLoadingEmailUpdateStatus } =
    useEmailUpdateStatus()
  const { showErrorSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async () => {
    if (!params?.token) return
    return api.postNativeV1ProfileEmailUpdateCancel({
      token: params?.token,
    })
  }, [params?.token])

  const onClose = useCallback(() => {
    navigateToHome()
  }, [])

  const handleSuspendAccount = useCallback(async () => {
    setIsLoading(true)
    try {
      await mutate()
      navigation.navigate(...getProfileStackConfig('TrackEmailChange'))
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
        return
      }
      showErrorSnackBar({
        message: 'Désolé, une erreur technique s’est produite. Veuillez réessayer plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToHome()
    } finally {
      setIsLoading(false)
    }
  }, [mutate, navigation, showErrorSnackBar])

  useEffect(() => {
    if (!isLoadingEmailUpdateStatus) {
      if (!emailUpdateStatus) {
        navigateToHome()
      }
      if (emailUpdateStatus?.expired) {
        navigation.reset({ routes: [{ name: 'ChangeEmailExpiredLink' }] })
      }
    }
  }, [emailUpdateStatus, isLoadingEmailUpdateStatus, navigation])

  return (
    <GenericInfoPage
      illustration={StyledUserError}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      buttonPrimary={{
        wording: 'Oui, suspendre mon compte',
        onPress: handleSuspendAccount,
        disabled: isLoading,
      }}
      buttonTertiary={{
        icon: Clear,
        wording: 'Ne pas suspendre mon compte',
        onPress: onClose,
        disabled: isLoading,
      }}>
      <StyledBody>
        Tu as indiqué <BoldText>ne pas être à l’origine</BoldText> de la demande de changement
        d’email.{DOUBLE_LINE_BREAK}Pour des raisons de <BoldText>sécurité</BoldText>, nous te
        conseillons de suspendre de ton compte&nbsp;:
        <BoldText> toutes les offres seront annulées et l’accès au compte sera bloqué.</BoldText>
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledUserError = styled(UserError).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const BoldText = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
