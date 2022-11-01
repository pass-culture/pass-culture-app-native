import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK, SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function LegalNotices() {
  return (
    <PageProfileSection title="Informations légales" scrollable>
      <TitleText>Mentions légales</TitleText>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        ÉDITEUR SAS pass Culture
        {LINE_BREAK}
        éditeur du site&nbsp;:
        {LINE_BREAK}
        <ExternalTouchableLink
          as={ButtonInsideText}
          wording="https://passculture.app/accueil"
          externalNav={{ url: 'https://passculture.app/accueil' }}
          icon={ExternalSiteFilled}
        />
        {LINE_BREAK}
        Société par action simplifiée au capital de 1&nbsp;000&nbsp;000&nbsp;€
        {LINE_BREAK}
        Siège social&nbsp;: 12 rue Duhesme 75018 Paris
        {LINE_BREAK}
        Immatriculée au RCS de Paris sous le numéro&nbsp;: 853&nbsp;318&nbsp;459
        {LINE_BREAK}
        Directeur de la publication&nbsp;: Sébastien Cavalier
        {LINE_BREAK}
        Hébergeur&nbsp;: Google Cloud Platform
        {LINE_BREAK}8 Rue de Londres - 75009 Paris - France
        {LINE_BREAK}
        Nous contacter&nbsp;:&nbsp;
        <ExternalTouchableLink
          as={ButtonInsideTextBlack}
          wording="support@passculture.fr"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          externalNav={contactSupport.forGenericQuestion}
          icon={EmailFilled}
        />
      </Typo.Body>

      <StyledSeparator />

      <SectionRow
        title="Conditions Générales d’Utilisation"
        type="clickable"
        externalNav={{ url: env.CGU_LINK }}
        icon={ExternalSite}
        iconSize={SECTION_ROW_ICON_SIZE}
      />

      <StyledSeparator />

      <SectionRow
        title="Charte de protection des données personnelles"
        type="clickable"
        externalNav={{ url: env.DATA_PRIVACY_CHART_LINK }}
        icon={ExternalSite}
        iconSize={SECTION_ROW_ICON_SIZE}
      />
    </PageProfileSection>
  )
}

const TitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))``

const ButtonInsideTextBlack = styled(ButtonInsideText).attrs(({ theme }) => ({
  color: theme.colors.black,
}))``

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})
