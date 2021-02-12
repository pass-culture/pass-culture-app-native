import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { Lock } from 'ui/svg/icons/Lock'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { getSpacing, Typo } from 'ui/theme'

import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileSection } from '../components/ProfileSection'
import { SectionRow } from '../components/SectionRow'

export const Profile: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()

  return (
    <ScrollView>
      <ProfileHeader user={user} />
      <Container>
        <Section title={_(t`Paramètres du compte`)}>
          <Row
            title={_(t`Informations personnelles`)}
            type="navigable"
            onPress={() => navigate('TemporaryProfilePage')}
            icon={ProfileIcon}
            style={styles.row}
            testID="row-personal-data"
          />
          <Row
            title={_(t`Mot de passe`)}
            type="navigable"
            onPress={() => navigate('TemporaryProfilePage')}
            icon={Lock}
            style={styles.row}
            testID="row-password"
          />
        </Section>
        <ProfileSection title={_(t`Aides`)}>
          <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
        </ProfileSection>
        <ProfileSection title={_(t`Autres`)}>
          <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
        </ProfileSection>
        <ProfileSection title={_(t`Suivre Pass Culture`)}>
          <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
        </ProfileSection>
      </Container>
    </ScrollView>
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  paddingHorizontal: getSpacing(5),
})

const styles = StyleSheet.create({
  section: {
    marginBottom: getSpacing(2),
  },
  row: {
    paddingVertical: getSpacing(4),
  },
})

const Section = styled(ProfileSection).attrs({
  style: styles.section,
})``

const Row = styled(SectionRow).attrs({
  style: styles.row,
})``
