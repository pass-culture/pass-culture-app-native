import React from 'react'
import styled from 'styled-components/native'

import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { env } from 'libs/environment'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function LegalNotices() {
  return (
    <PageProfileSection title="Mentions légales">
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
