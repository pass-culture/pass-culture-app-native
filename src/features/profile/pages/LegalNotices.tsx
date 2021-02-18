import { t } from '@lingui/macro'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { _ } from 'libs/i18n'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing } from 'ui/theme'

import { ProfileHeaderWithNavigation } from '../components/ProfileHeaderWithNavigation'
import { SectionRow } from '../components/SectionRow'

export function LegalNotices() {
  return (
    <View>
      <ProfileHeaderWithNavigation title={_(t`Mentions légales`)} />
      <ProfilContainer>
        <Row
          title={_(t`Conditions Générales d’Utilisation`)}
          type="clickable"
          onPress={() => openExternalUrl('https://pass.culture.fr/cgu/')}
          icon={ExternalSite}
          style={styles.row}
          testID="row-faq"
        />
      </ProfilContainer>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: getSpacing(4),
  },
})

const ProfilContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(5),
})

const Row = styled(SectionRow).attrs({
  style: styles.row,
})``
