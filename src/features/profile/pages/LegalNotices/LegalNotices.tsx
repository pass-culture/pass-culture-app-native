import React from 'react'
import styled from 'styled-components/native'

import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { LINE_BREAK, SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function LegalNotices() {
  return (
    <PageProfileSection title="Informations légales">
      <Typo.Title2>Éditeur</Typo.Title2>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body>
        SAS pass Culture éditeur du site pass.culture.fr
        {LINE_BREAK}
        Société par action simplifiée au capital de 1 000 000&nbsp;€
        {LINE_BREAK}
        Siège social&nbsp;: 12 rue Duhesme 75018 Paris
        {LINE_BREAK}
        Immatriculée au RCS de Paris sous le numéro&nbsp;: 853 318 459
        {LINE_BREAK}
        Directeur de la publication&nbsp;: Sébastien Cavalier
      </Typo.Body>

      <StyledSeparator />

      <Typo.Title2>Hébergeur</Typo.Title2>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body>
        Google Cloud Platform
        {LINE_BREAK}8 Rue de Londres - 75009 Paris - France
        {LINE_BREAK}
        Nous contacter&nbsp;: support@passculture.fr
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

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(4),
})
