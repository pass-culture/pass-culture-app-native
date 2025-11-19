import React from 'react'
import { ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { useProfileViewModel } from 'features/profile/pages/useProfileViewModel'
import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { Bell } from 'ui/svg/icons/Bell'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { SignOut } from 'ui/svg/icons/SignOut'
import { Trophy } from 'ui/svg/icons/Trophy'
import { ArtMaterial } from 'ui/svg/icons/venueAndCategories/ArtMaterial'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

const OnlineProfile: React.FC = () => {
  const {
    disableActivation,
    enablePassForAll,
    enableDebugSection,
    isLoggedIn,
    user,
    signOut,
    displayInAppFeedback,
    isGeolocSwitchActive,
    geolocPositionError,
    toggleGeolocation,
    onConsultTutorial,
    shouldDisplayTutorial,
    hidePreferenceSection,
    shouldShowAchievementsSection,
    isWeb,
    scrollViewRef,
    onScroll,
    onShareBannerPress,
    version,
  } = useProfileViewModel()

  return (
    <Page>
      <ScrollView
        bounces
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        testID="profile-scrollview">
        <ScrollViewContentContainer>
          <View accessibilityRole={AccessibilityRole.MAIN}>
            <ProfileHeader featureFlags={{ disableActivation, enablePassForAll }} user={user} />
            <ProfileContainer>
              <Spacer.Column numberOfSpaces={4} />
              <Section title={isLoggedIn ? 'Paramètres du compte' : 'Paramètres de l’application'}>
                <VerticalUl>
                  {isLoggedIn ? (
                    <Li>
                      <Row
                        title="Informations personnelles"
                        type="navigable"
                        navigateTo={getProfilePropConfig('PersonalData')}
                        icon={ProfileIcon}
                      />
                    </Li>
                  ) : null}
                  <Li>
                    <Row
                      type="navigable"
                      title="Notifications"
                      icon={Bell}
                      navigateTo={getProfilePropConfig('NotificationsSettings')}
                    />
                  </Li>
                  <LiWithMarginVertical accessible={false}>
                    <SectionWithSwitch
                      icon={LocationPointer}
                      iconSize={SECTION_ROW_ICON_SIZE}
                      title="Activer ma géolocalisation"
                      active={isGeolocSwitchActive}
                      accessibilityHint={geolocPositionError?.message}
                      toggle={toggleGeolocation}
                      toggleLabel="Activer ma géolocalisation"
                    />
                    <InputError
                      visible={!!geolocPositionError}
                      errorMessage={geolocPositionError?.message}
                      numberOfSpacesTop={1}
                    />
                  </LiWithMarginVertical>
                </VerticalUl>
              </Section>
              <Section title="Aides">
                <VerticalUl>
                  {shouldDisplayTutorial ? (
                    <Li>
                      <Row
                        title="Comment ça marche&nbsp;?"
                        type="navigable"
                        navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
                        onPress={onConsultTutorial}
                        icon={LifeBuoy}
                      />
                    </Li>
                  ) : null}
                  <Li>
                    <Row
                      title="Centre d’aide"
                      type="clickable"
                      externalNav={{ url: env.FAQ_LINK }}
                      icon={ExternalSite}
                    />
                  </Li>
                </VerticalUl>
              </Section>
              <Section title="Autres">
                <VerticalUl>
                  {shouldShowAchievementsSection ? (
                    <Li>
                      <Row
                        title="Mes succès"
                        type="navigable"
                        navigateTo={{ screen: 'Achievements', params: { from: 'profile' } }}
                        icon={Trophy}
                      />
                    </Li>
                  ) : null}
                  {hidePreferenceSection ? null : (
                    <Li>
                      <Row
                        title="Préférences d’affichage"
                        type="navigable"
                        navigateTo={getProfilePropConfig('DisplayPreference')}
                        icon={ArtMaterial}
                      />
                    </Li>
                  )}
                  <Li>
                    <Row
                      title="Accessibilité"
                      type="navigable"
                      navigateTo={getProfilePropConfig('Accessibility')}
                      icon={HandicapMental}
                    />
                  </Li>
                  {displayInAppFeedback ? (
                    <Li>
                      <Row
                        title="Faire une suggestion"
                        type="navigable"
                        navigateTo={getProfilePropConfig('FeedbackInApp')}
                        icon={Bulb}
                      />
                    </Li>
                  ) : null}
                  <Li>
                    <Row
                      title="Informations légales"
                      type="navigable"
                      navigateTo={getProfilePropConfig('LegalNotices')}
                      icon={LegalNotices}
                    />
                  </Li>
                  <Li>
                    <Row
                      title="Confidentialité"
                      type="navigable"
                      navigateTo={getProfilePropConfig('ConsentSettings')}
                      icon={Confidentiality}
                    />
                  </Li>
                </VerticalUl>
              </Section>
              {isWeb ? null : (
                <Section title="Partager le pass Culture">
                  <Spacer.Column numberOfSpaces={4} />
                  <BannerWithBackground
                    backgroundSource={SHARE_APP_BANNER_IMAGE_SOURCE}
                    onPress={onShareBannerPress}>
                    <ShareAppContainer gap={1}>
                      <StyledButtonText>Partage le pass Culture</StyledButtonText>
                      <StyledBody>Recommande le bon plan à&nbsp;tes&nbsp;amis&nbsp;!</StyledBody>
                    </ShareAppContainer>
                  </BannerWithBackground>
                  <Spacer.Column numberOfSpaces={4} />
                </Section>
              )}
              <Section title="Suivre le pass Culture">
                <SocialNetwork />
              </Section>
              {isLoggedIn ? (
                <Section>
                  <Spacer.Column numberOfSpaces={4} />
                  <SectionRow
                    title="Déconnexion"
                    onPress={signOut}
                    type="clickable"
                    icon={SignOut}
                    iconSize={SECTION_ROW_ICON_SIZE}
                  />
                </Section>
              ) : null}
              <Section>
                <Version>
                  {version}
                  {isWeb ? `-${String(env.COMMIT_HASH)}` : ''}
                </Version>
                {enableDebugSection ? (
                  <DebugButtonContainer>
                    <InternalTouchableLink
                      as={ButtonQuaternaryBlack}
                      wording="Débuggage"
                      navigateTo={getProfilePropConfig('DebugScreen')}
                      justifyContent="flex-start"
                      inline
                    />
                  </DebugButtonContainer>
                ) : null}
                {isWeb ? null : (
                  <LogoFrenchRepublicContainer>
                    <LogoFrenchRepublic />
                  </LogoFrenchRepublicContainer>
                )}
              </Section>
              {isWeb ? null : <Spacer.TabBar />}
            </ProfileContainer>
          </View>
          {isWeb ? (
            <View accessibilityRole={AccessibilityRole.FOOTER}>
              <AccessibilityFooter />
            </View>
          ) : null}
        </ScrollViewContentContainer>
      </ScrollView>
      <StatusBarBlurredBackground />
    </Page>
  )
}

export function Profile() {
  const netInfo = useNetInfoContext()
  if (netInfo.isConnected) {
    return <OnlineProfile />
  }
  return <OfflinePage />
}

const ProfileContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.default,
  flexDirection: 'column',
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const ScrollViewContentContainer = styled.View({
  flex: 1,
  flexDirection: 'column',
})

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical: getSpacing(4),
})

const ShareAppContainer = styled(ViewGap)(({ theme }) => ({
  paddingRight: theme.isSmallScreen ? 0 : getSpacing(8),
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const Version = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginVertical: getSpacing(4),
}))

const DebugButtonContainer = styled.View({
  marginBottom: getSpacing(4),
})

const LogoFrenchRepublicContainer = styled.View({
  width: getSpacing(40),
  height: getSpacing(28),
  marginBottom: getSpacing(4),
})

const LiWithMarginVertical = styled(Li)({
  marginVertical: getSpacing(4),
})
