import React from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  renderResendEmailButton?: () => React.ReactNode
  urlFAQ?: string
  contactSupport?: () => void
  customBodyText?: string
}

export function LayoutExpiredLink({
  renderResendEmailButton,
  urlFAQ,
  contactSupport,
  customBodyText,
}: Props) {
  return (
    <GenericInfoPage
      title="Oups&nbsp;!"
      icon={SadFace}
      buttons={[
        renderResendEmailButton && renderResendEmailButton(),
        <TouchableLink
          key={1}
          as={ButtonTertiaryWhite}
          wording="Retourner à l’accueil"
          navigateTo={navigateToHomeConfig}
          icon={PlainArrowPrevious}
        />,
      ].filter(Boolean)}>
      <StyledBody>Le lien est expiré&nbsp;!</StyledBody>
      <StyledBody>
        {customBodyText ||
          'Clique sur «\u00a0Renvoyer l’e-mail\u00a0» pour recevoir un nouveau lien.'}
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />

      {!!urlFAQ || !!contactSupport ? (
        <React.Fragment>
          <StyledBody>Si tu as besoin d’aide n’hésite pas à&nbsp;:</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      ) : null}

      {!!urlFAQ && (
        <TouchableLink
          as={ButtonTertiaryWhite}
          wording="Consulter l’article d'aide"
          externalNav={{ url: urlFAQ }}
          icon={ExternalSite}
        />
      )}

      {!!contactSupport && (
        <ButtonTertiaryWhite
          wording="Contacter le support"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          onPress={contactSupport}
          icon={EmailFilled}
        />
      )}
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
