import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { Clear } from 'ui/svg/icons/Clear'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

type SuspendAccountConfirmationProps = NativeStackScreenProps<
  RootStackParamList,
  'SuspendAccountConfirmation'
>

export function SuspendAccountConfirmation({
  route: { params },
  navigation,
}: SuspendAccountConfirmationProps) {
  const { data: emailUpdateStatus, isLoading: isLoadingEmailUpdateStatus } = useEmailUpdateStatus()
  const { showErrorSnackBar } = useSnackBarContext()

  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async () => {
    return api.postnativev1profileemailUpdatecancel({
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

  useEffect(() => {
    if (!isLoadingEmailUpdateStatus && (!emailUpdateStatus || emailUpdateStatus?.expired)) {
      navigateToHome()
    }
  }, [emailUpdateStatus, isLoadingEmailUpdateStatus])

  return (
    <GenericInfoPageWhite
      icon={StyledBicolorUserError}
      titleComponent={Typo.Title3}
      title="Souhaites-tu suspendre ton compte pass Culture&nbsp;?"
      separateIconFromTitle={false}>
      <StyledBody>
        Tu as indiqué <BoldText>ne pas être à l’origine</BoldText> de la demande de changement
        d’email.{DOUBLE_LINE_BREAK} Pour des raisons de <BoldText>sécurité</BoldText>, nous te
        conseillons de suspendre de ton compte&nbsp;:
        <BoldText> toutes les offres seront annulées et l’accès au compte sera bloqué.</BoldText>
      </StyledBody>
      <Spacer.Column numberOfSpaces={19} />
      <View>
        <ButtonPrimary
          wording="Oui, suspendre mon compte"
          onPress={handleSuspendAccount}
          disabled={isLoading}
        />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack
          wording="Ne pas suspendre mon compte"
          icon={Clear}
          onPress={onClose}
          disabled={isLoading}
        />
      </View>
    </GenericInfoPageWhite>
  )
}

const StyledBicolorUserError = styled(BicolorUserError).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.primary,
  color2: theme.colors.secondary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const BoldText = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
