import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { openUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { getSpacing, Spacer } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'
import { A } from 'ui/web/link/A'

export function LegalNotices() {
  const { data: user } = useUserProfileInfo()
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <React.Fragment>
      <PageHeader title={t`Mentions légales`} />
      <Container>
        <Spacer.TopScreen />
        <Spacer.Column numberOfSpaces={14} />
        <A href={env.CGU_LINK}>
          <Row
            title={t`Conditions Générales d’Utilisation`}
            type="clickable"
            onPress={() => openUrl(env.CGU_LINK)}
            icon={ExternalSite}
          />
        </A>
        <Separator />
        <A href={env.DATA_PRIVACY_CHART_LINK}>
          <Row
            title={t`Charte de protection des données personnelles`}
            type="clickable"
            onPress={() => openUrl(env.DATA_PRIVACY_CHART_LINK)}
            icon={ExternalSite}
          />
        </A>
        {!!user && (
          <React.Fragment>
            <Separator />
            <Row
              title={t`Suppression du compte`}
              type="clickable"
              onPress={() => navigate('ConfirmDeleteProfile')}
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
