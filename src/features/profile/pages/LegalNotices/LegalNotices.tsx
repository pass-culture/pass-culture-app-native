import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { env } from 'libs/environment'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function LegalNotices() {
  return (
    <React.Fragment>
      <PageHeader title={t`Mentions légales`} background="primary" withGoBackButton />
      <Container>
        <Spacer.Column numberOfSpaces={2} />
        <Row
          title={t`Conditions Générales d’Utilisation`}
          type="clickable"
          externalNav={{ url: env.CGU_LINK }}
          icon={ExternalSite}
        />
        <Separator />
        <Row
          title={t`Charte de protection des données personnelles`}
          type="clickable"
          externalNav={{ url: env.DATA_PRIVACY_CHART_LINK }}
          icon={ExternalSite}
        />
      </Container>
    </React.Fragment>
  )
}

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(4),
}))

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical: getSpacing(4),
})
