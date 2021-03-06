import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SectionRow } from 'ui/components/SectionRow'
import { Separator } from 'ui/components/Separator'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { getSpacing, Spacer } from 'ui/theme'

export function LegalNotices() {
  const { data: user } = useUserProfileInfo()
  const { navigate } = useNavigation<UseNavigationType>()
  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={14} />
      <Container>
        <Row
          title={t`Conditions Générales d’Utilisation`}
          type="clickable"
          onPress={() => openExternalUrl(env.CGU_LINK)}
          icon={ExternalSite}
          style={styles.row}
          testID="row-cgu"
        />
        <Separator />
        <Row
          title={t`Charte de protection des données personnelles`}
          type="clickable"
          onPress={() => openExternalUrl(env.DATA_PRIVACY_CHART_LINK)}
          icon={ExternalSite}
          style={styles.row}
          testID="row-data-privacy-chart"
        />
        {!!user && (
          <React.Fragment>
            <Separator />
            <Row
              title={t`Suppression du compte`}
              type="clickable"
              onPress={() => navigate('ConfirmDeleteProfile')}
              icon={ProfileDeletion}
              style={styles.row}
              testID="row-account-deletion"
            />
          </React.Fragment>
        )}
      </Container>

      <PageHeader title={t`Mentions légales`} />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: getSpacing(4),
  },
})

const Container = styled.View({
  flexDirection: 'column',
  paddingHorizontal: getSpacing(4),
})

const Row = styled(SectionRow).attrs({
  style: styles.row,
})``
