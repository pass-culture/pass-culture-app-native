import React from 'react'
import styled from 'styled-components/native'

import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK, SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function LegalNotices() {
  return (
    <PageProfileSection title="Informations légales">
      <TitleText>Mentions légales</TitleText>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.Body>
        ÉDITEUR SAS pass Culture
        {LINE_BREAK}
        <Typo.ButtonText>éditeur du site&nbsp;:</Typo.ButtonText>
        {LINE_BREAK}
        <TouchableLink
          as={ButtonInsideText}
          wording="https://passculture.app/accueil"
          externalNav={{ url: 'https://passculture.app/accueil' }}
          icon={ExternalSiteFilled}
        />
        {LINE_BREAK}
        <Typo.ButtonText>Société par action simplifiée</Typo.ButtonText> au capital de 1 000
        000&nbsp;€
        {LINE_BREAK}
        <Typo.ButtonText>Siège social&nbsp;:</Typo.ButtonText> 12 rue Duhesme 75018 Paris
        {LINE_BREAK}
        Immatriculée au RCS de Paris sous le numéro&nbsp;: 853 318 459
        {LINE_BREAK}
        <Typo.ButtonText>Directeur de la publication&nbsp;:</Typo.ButtonText> Sébastien Cavalier
        {LINE_BREAK}
        <Typo.ButtonText>Hébergeur&nbsp;:</Typo.ButtonText> Google Cloud Platform
        {LINE_BREAK}8 Rue de Londres - 75009 Paris - France
        <Typo.ButtonText>Nous contacter&nbsp;:</Typo.ButtonText> support@passculture.fr
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

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})
