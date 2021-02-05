import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Lock } from 'ui/svg/icons/Lock'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ProfileSection } from '../components/ProfileSection'
import { SectionRow } from '../components/SectionRow'

export const Profile: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <Container>
      <Section title={_(t`Paramètres du compte`)}>
        <Row
          title={_(t`Informations personnelles`)}
          type="navigable"
          onPress={() => navigate('TemporyProfilePage')}
          icon={ProfileIcon}
          style={styles.row}
          testID="row-personal-data"
        />
        <Row
          title={_(t`Mot de passe`)}
          type="navigable"
          onPress={() => navigate('TemporyProfilePage')}
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
  )
}

const Container = styled.View({
  flex: 1,
  flexDirection: 'column',
  padding: getSpacing(5),
})

const styles = StyleSheet.create({
  section: {
    marginBottom: getSpacing(2),
  },
  row: {
    paddingVertical: getSpacing(4),
    marginHorizontal: getSpacing(1),
  },
})

const Section = styled(ProfileSection).attrs({
  style: styles.section,
})``

const Row = styled(SectionRow).attrs({
  style: styles.row,
})``

const ProfileIcon = (props: IconInterface) => <BicolorProfile {...props} color={ColorsEnum.BLACK} />
