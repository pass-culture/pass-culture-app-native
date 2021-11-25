import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome, openUrl } from 'features/navigation/helpers'
import { accessibilityAndTestId } from 'tests/utils'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteDeprecated } from 'ui/svg/icons/ExternalSite_deprecated'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { SadFace } from 'ui/svg/icons/SadFace'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  onResendEmail?: () => void
  disabledResendEmailButton: boolean
  urlFAQ?: string
  contactSupport?: () => void
  customBodyText?: string
}

export function LayoutExpiredLink({
  disabledResendEmailButton,
  urlFAQ,
  onResendEmail,
  contactSupport,
  customBodyText,
}: Props) {
  return (
    <GenericInfoPage title={t`Oups !`} icon={SadFace}>
      <StyledBody>{t`Le lien est expiré !`}</StyledBody>
      <StyledBody>
        {customBodyText || t`Clique sur « Renvoyer l’e-mail » pour recevoir un nouveau lien.`}
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />

      {!!urlFAQ || !!contactSupport ? (
        <React.Fragment>
          <StyledBody>{t`Si tu as besoin d’aide n’hésite pas à :`}</StyledBody>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      ) : null}

      {!!urlFAQ && (
        <ButtonTertiaryWhite
          title={t`Consulter l'article d'aide`}
          onPress={() => openUrl(urlFAQ)}
          icon={ExternalSiteDeprecated}
        />
      )}

      {!!contactSupport && (
        <ButtonTertiaryWhite
          title={t`Contacter le support`}
          onPress={contactSupport}
          icon={EmailFilledIcon}
        />
      )}

      <Spacer.Column numberOfSpaces={8} />
      {onResendEmail ? (
        <ButtonPrimaryWhite
          title={t`Renvoyer l'email`}
          onPress={onResendEmail}
          disabled={disabledResendEmailButton}
        />
      ) : null}
      <Spacer.Column numberOfSpaces={2} />
      <ButtonTertiaryWhite
        title={t`Retourner à l'accueil`}
        onPress={navigateToHome}
        icon={PlainArrowPreviousIcon}
      />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})

const EmailFilledIcon: React.FC<IconInterface> = ({ color }) => (
  <EmailFilled {...accessibilityAndTestId('button-icon')} color={color} size={getSpacing(5)} />
)

const PlainArrowPreviousIcon: React.FC<IconInterface> = ({ color }) => (
  <PlainArrowPrevious
    {...accessibilityAndTestId('button-icon')}
    color={color}
    size={getSpacing(5)}
  />
)
