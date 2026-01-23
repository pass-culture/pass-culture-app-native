import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { mapSubscriptionThemeToDescription } from 'features/subscription/helpers/mapSubscriptionThemeToDescription'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Parameters } from 'ui/svg/icons/Parameters'
import { RingingBell } from 'ui/svg/RingingBell'
import { getSpacing, Typo } from 'ui/theme'

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
      <StyledBodyAccentXs>Tu pourras gérer tes alertes depuis ton profil.</StyledBodyAccentXs>
      <StyledButtonContainer>
        <StyledButtonPrimary wording="Continuer sur l’app" onPress={dismissModal} />
        <InternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Voir mes préférences"
          icon={Parameters}
          navigateTo={getProfilePropConfig('NotificationsSettings')}
          onBeforeNavigate={dismissModal}
        />
      </StyledButtonContainer>
    </AppModalWithIllustration>
  )
}

const StyledButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledButtonPrimary = styledButton(ButtonPrimary)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: getSpacing(6),
}))

const StyledIcon = styled(RingingBell).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
