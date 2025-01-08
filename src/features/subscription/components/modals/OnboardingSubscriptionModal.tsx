import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { BicolorRingingBell } from 'ui/svg/BicolorRingingBell'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, TypoDS } from 'ui/theme'

type Props = {
  visible: boolean
  dismissModal: () => void
}

export const OnboardingSubscriptionModal = ({ visible, dismissModal }: Props) => {
  return (
    <AppModalWithIllustration
      visible={visible}
      title="Suis tes thèmes préférés"
      Illustration={StyledIcon}
      hideModal={dismissModal}>
      <StyledBody>
        Du mal à trouver ce qui te plaît&nbsp;? Reçois toutes les offres et actus en lien avec tes
        thèmes préférés&nbsp;!
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <InternalTouchableLink
        as={ButtonPrimary}
        wording="Choisir des thèmes à suivre"
        navigateTo={{ screen: 'OnboardingSubscription' }}
        onBeforeNavigate={dismissModal}
      />
      <Spacer.Column numberOfSpaces={4} />
      <ButtonTertiaryBlack
        wording="Non merci"
        icon={Invalidate}
        onPress={dismissModal}
        accessibilityLabel="Fermer la modale"
      />
    </AppModalWithIllustration>
  )
}

const StyledIcon = styled(BicolorRingingBell).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledBody = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
  textAlign: 'center',
}))
