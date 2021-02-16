import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { Lock } from 'ui/svg/icons/Lock'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { SignOut } from 'ui/svg/icons/SignOut'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

import Package from '../../../../package.json'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileSection } from '../components/ProfileSection'
import { SectionRow } from '../components/SectionRow'

export const Profile: React.FC = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()
  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

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
        <Section title={_(t`Aides`)}>
          <Row
            title={_(t`Comment ça marche ?`)}
            type="navigable"
            onPress={() => navigate('TemporaryProfilePage')}
            icon={LifeBuoy}
            style={styles.row}
            testID="row-how-it-works"
          />
          <Row
            title={_(t`Questions fréquentes`)}
            type="clickable"
            onPress={() => openExternalUrl('https://aide.passculture.app/fr/')}
            icon={ExternalSite}
            style={styles.row}
            testID="row-faq"
          />
        </Section>
        <Section title={_(t`Autres`)}>
          <Row
            title={_(t`Accessibilité`)}
            type="clickable"
            onPress={() => openExternalUrl('https://pass.culture.fr/accessibilite-de-la-webapp/')}
            icon={ExternalSite}
            style={styles.row}
            testID="row-accessibility"
          />
          <Row
            title={_(t`Mentions légales`)}
            type="navigable"
            onPress={() => navigate('TemporaryProfilePage')}
            icon={LegalNotices}
            style={styles.row}
            testID="row-legal-notices"
          />
          <Row
            title={_(t`Confidentialité`)}
            type="navigable"
            onPress={() => navigate('TemporaryProfilePage')}
            icon={Confidentiality}
            style={styles.row}
            testID="row-confidentiality"
          />
        </Section>
        <Section title={_(t`Suivre Pass Culture`)}>
          <Typo.Body>{_(t`Temporary content`)}</Typo.Body>
        </Section>
        {isLoggedIn && (
          <Section>
            <Spacer.Column numberOfSpaces={4} />
            <SectionRow
              title={_(t`Déconnexion`)}
              onPress={signOut}
              type="clickable"
              icon={SignOut}
              testID="row-signout"
            />
            <Spacer.Column numberOfSpaces={1} />
          </Section>
        )}
        <Section>
          <Spacer.Column numberOfSpaces={4} />
          <Version>{_(t`Version ${Package.version}`)}</Version>
          <Spacer.Column numberOfSpaces={4} />
          <LogoMinistere />
          <Spacer.Column numberOfSpaces={4} />
        </Section>
      </Container>
      <BottomSpacing />
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

const BottomSpacing = styled.View({
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
})

const Version = styled.Text({
  fontFamily: 'Montserrat-Medium',
  fontSize: 12,
  lineHeight: 16,
  color: ColorsEnum.GREY_DARK,
})
