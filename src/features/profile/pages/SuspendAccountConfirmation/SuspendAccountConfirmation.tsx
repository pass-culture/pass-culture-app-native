import React, { useCallback } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { Clear } from 'ui/svg/icons/Clear'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export function SuspendAccountConfirmation() {
  const { data: emailUpdateStatus } = useEmailUpdateStatus()

  const onClose = useCallback(() => {
    navigateToHome()
  }, [])

  const handleSuspendAccount = useCallback(() => {
    // TODO(PC-22601): add suspend account API call
  }, [])

  if (!emailUpdateStatus || emailUpdateStatus?.expired) {
    navigateToHome()
  }

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
        <ButtonPrimary wording="Oui, suspendre mon compte" onPress={handleSuspendAccount} />
        <Spacer.Column numberOfSpaces={4} />
        <ButtonTertiaryBlack wording="Ne pas suspendre mon compte" icon={Clear} onPress={onClose} />
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
