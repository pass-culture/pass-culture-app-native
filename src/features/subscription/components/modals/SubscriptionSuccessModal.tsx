import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToDescription } from 'features/subscription/helpers/mapSubscriptionThemeToDescription'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorRingingBell } from 'ui/svg/BicolorRingingBell'
import { Parameters } from 'ui/svg/icons/Parameters'
import { Spacer, Typo, TypoDS } from 'ui/theme'

interface Props {
  visible: boolean
  theme: SubscriptionTheme
  dismissModal: () => void
}

export const SubscriptionSuccessModal: FunctionComponent<Props> = ({
  visible,
  theme,
  dismissModal,
}) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title={`Tu suis le thème "${mapSubscriptionThemeToName[theme]}"`}
      Illustration={StyledIcon}
      hideModal={dismissModal}>
      <StyledBody>{mapSubscriptionThemeToDescription[theme]}</StyledBody>
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaption>Tu pourras gérer tes alertes depuis ton profil.</StyledCaption>
      <Spacer.Column numberOfSpaces={6} />
      <StyledButtonContainer>
        <ButtonPrimary wording="Continuer sur l’app" onPress={dismissModal} />
        <Spacer.Column numberOfSpaces={2} />
        <InternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Voir mes préférences"
          icon={Parameters}
          navigateTo={{ screen: 'NotificationsSettings' }}
          onBeforeNavigate={dismissModal}
        />
      </StyledButtonContainer>
      <Spacer.Column numberOfSpaces={4} />
    </AppModalWithIllustration>
  )
}

const StyledButtonContainer = styled.View({
  width: '100%',
})

const StyledBody = styled(TypoDS.Body)({
  textAlign: 'center',
})
const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))

const StyledIcon = styled(BicolorRingingBell).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``
