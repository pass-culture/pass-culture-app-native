import { t } from '@lingui/macro'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { _ } from 'libs/i18n'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ProfileDeletion } from 'ui/svg/icons/ProfileDeletion'
import { getSpacing } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { Separator } from '../components/reusables'
import { SectionRow } from '../components/SectionRow'

export function LegalNotices() {
  const { data: user } = useUserProfileInfo()
  return (
    <View>
      <ProfileHeaderWithNavigation title={_(t`Mentions légales`)} />
      <Container>
        <Row
          title={_(t`Conditions Générales d’Utilisation`)}
          type="clickable"
          onPress={() => openExternalUrl('https://pass.culture.fr/cgu/')}
          icon={ExternalSite}
          style={styles.row}
          testID="row-cgu"
        />
        <Separator />
        <Row
          title={_(t`Charte de protection des données personnelles`)}
          type="clickable"
          onPress={() => openExternalUrl('https://pass.culture.fr/donnees-personnelles/')}
          icon={ExternalSite}
          style={styles.row}
          testID="row-data-privacy-chart"
        />
        {user && (
          <React.Fragment>
            <Separator />
            <Row
              title={_(t`Suppression du compte`)}
              type="clickable"
              onPress={() => contactSupport.forAccountDeletion(user.email)}
              icon={ProfileDeletion}
              style={styles.row}
              testID="row-account-deletion"
            />
          </React.Fragment>
        )}
      </Container>
    </View>
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
