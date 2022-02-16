import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome, openUrl } from 'features/navigation/helpers'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Spacer, Typo } from 'ui/theme'
import { A } from 'ui/web/link/A'

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
      title={t`Oups\u00a0!`}
      icon={SadFace}
      buttons={[
        renderResendEmailButton && renderResendEmailButton(),
        <ButtonTertiaryWhite
          key={1}
          wording={t`Retourner à l'accueil`}
          onPress={navigateToHome}
          icon={PlainArrowPrevious}
        />,
      ].filter(Boolean)}>
      <StyledBody>{t`Le lien est expiré\u00a0!`}</StyledBody>
      <StyledBody>
        {customBodyText ||
          t`Clique sur «\u00a0Renvoyer l’e-mail\u00a0» pour recevoir un nouveau lien.`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />

      {!!urlFAQ || !!contactSupport ? (
        <React.Fragment>
          <StyledBody>{t`Si tu as besoin d’aide n’hésite pas à\u00a0:`}</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      ) : null}

      {!!urlFAQ && (
        <A href={urlFAQ}>
          <ButtonTertiaryWhite
            wording={t`Consulter l'article d'aide`}
            onPress={() => openUrl(urlFAQ)}
            icon={ExternalSite}
          />
        </A>
      )}

      {!!contactSupport && (
        <ButtonTertiaryWhite
          wording={t`Contacter le support`}
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
