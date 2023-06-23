import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

export type Props = {
  email: string
}

export const SignupConfirmationEmailSent: FunctionComponent<Props> = ({ email }) => {
  return (
    <React.Fragment>
      <IllustrationContainer>
        <BicolorEmailSent />
      </IllustrationContainer>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Title3>Confirme ton adresse e-mail</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>Tu as reçu un lien à l’adresse&nbsp;:</Typo.Body>
      <Typo.Body>{email}</Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>L’e-mail peut prendre quelques minutes pour arriver.</Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Separator />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>Tu n&apos;as pas reçu de lien&nbsp;? Tu peux&nbsp;:</Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ExternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Consulter notre centre d’aide"
        externalNav={contactSupport.forSignupConfirmationEmailNotReceived}
        onBeforeNavigate={analytics.logHelpCenterContactSignupConfirmationEmailSent}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
      <Spacer.Column numberOfSpaces={10} />
      <OpenInboxButton onAdditionalPress={analytics.logEmailConfirmationConsultEmailClicked} />
    </React.Fragment>
  )
}

const IllustrationContainer = styled.View(() => ({
  alignItems: 'center',
  width: '100%',
}))
