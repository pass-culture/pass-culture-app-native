import React from 'react'
import styled from 'styled-components/native'

import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { RingingBell } from 'ui/svg/RingingBell'
import { Typo } from 'ui/theme'

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
      <InternalTouchableLink
        as={Button}
        variant="primary"
        wording="Choisir des thèmes à suivre"
        navigateTo={{ screen: 'OnboardingSubscription' }}
        onBeforeNavigate={dismissModal}
        fullWidth
      />
      <StyledButton
        variant="tertiary"
        color="neutral"
        wording="Non merci"
        icon={Invalidate}
        onPress={dismissModal}
        accessibilityLabel="Fermer la modale"
      />
    </AppModalWithIllustration>
  )
}

const StyledIcon = styled(RingingBell).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  textAlign: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
