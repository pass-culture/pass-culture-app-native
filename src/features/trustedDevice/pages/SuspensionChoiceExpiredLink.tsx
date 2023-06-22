import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Spacer, Typo } from 'ui/theme'

export const SuspensionChoiceExpiredLink = () => (
  <GenericInfoPage
    title="Oups&nbsp;!"
    icon={SadFace}
    buttons={[
      <ExternalTouchableLink
        key={1}
        as={ButtonPrimaryWhite}
        wording="Contacter le support"
        accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
        externalNav={{ url: `mailto:${env.FRAUD_EMAIL_ADDRESS}` }}
        icon={EmailFilled}
      />,
      <InternalTouchableLink
        key={2}
        as={ButtonTertiaryWhite}
        wording="Retourner à l’accueil"
        navigateTo={navigateToHomeConfig}
        icon={PlainArrowPrevious}
      />,
    ]}>
    <StyledBody>Le lien est expiré&nbsp;!</StyledBody>
    <StyledBody>Le lien que tu reçois par e-mail expire 7 jours après sa réception.</StyledBody>
    <Spacer.Column numberOfSpaces={6} />
    <StyledBody>Tu peux toujours contacter le support pour sécuriser ton compte.</StyledBody>
  </GenericInfoPage>
)

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
