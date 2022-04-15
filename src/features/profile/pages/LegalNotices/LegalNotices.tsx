import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { env } from 'libs/environment'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { getSpacing, Spacer } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

export function LegalNotices() {
  const { data: user } = useUserProfileInfo()
  return (
    <React.Fragment>
      <PageHeader title={t`Mentions légales`} />
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={14} />
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
        {!!user && (
          <React.Fragment>
            <Separator />
            <Row
              title={t`Suppression du compte`}
              type="clickable"
              navigateTo={{ screen: 'ConfirmDeleteProfile' }}
              icon={ProfileDeletion}
            />
          </React.Fragment>
        )}
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
