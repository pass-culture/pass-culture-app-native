import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { BeneficiaryHeader } from 'features/profile/components/BeneficiaryHeader'
import { _ } from 'libs/i18n'
import { Lock } from 'ui/svg/icons/Lock'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { getSpacing, Typo } from 'ui/theme'

import { ProfileSection } from '../components/ProfileSection'
import { SectionRow } from '../components/SectionRow'

// TODO(PC-6169) remove this when UserProfileResponse is handled on this page
const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 200 },
  { current: 70, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 70, domain: ExpenseDomain.Physical, limit: 200 },
]

export const Profile: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <ScrollView>
      {/* TODO(PC-6169) display this header dynamically if user is logged in and beneficiary */}
      <BeneficiaryHeader
        depositVersion={1}
        expenses={expenses_v1}
        firstName={'Rosa'}
        lastName={'Bonheur'}
        remainingCredit={150}
      />
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
    </ScrollView>
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
