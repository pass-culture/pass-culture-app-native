import { useFocusEffect } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, Platform, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { ProfileContainer } from 'features/profile/components/PageProfileSection/ProfileContainer'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { shareApp } from 'features/share/helpers/shareApp'
import { TutorialTypes } from 'features/tutorial/enums'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { env } from 'libs/environment'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { GeolocPermissionState, useLocation } from 'libs/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { getAge } from 'shared/user/getAge'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { VerticalUl } from 'ui/components/Ul'
import { useVersion } from 'ui/hooks/useVersion'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { SignOut } from 'ui/svg/icons/SignOut'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

const OnlineProfile: React.FC = () => {
  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { isLoggedIn, user } = useAuthContext()
  const signOut = useLogoutRoutine()
  const version = useVersion()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const locationActivationErrorId = uuidv4()
  const userAge = getAge(user?.birthDate)

  const { userPositionError, permissionState, requestGeolocPermission, showGeolocPermissionModal } =
    useLocation()
  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(
    permissionState === GeolocPermissionState.GRANTED
  )

  const isCreditEmpty = user?.domainsCredit?.all.remaining === 0
  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false
  const isExpiredOrCreditEmptyWithNoUpcomingCredit =
    userAge && userAge >= 18 && (isDepositExpired || isCreditEmpty)

  const shouldDisplayTutorial = !user?.isBeneficiary || isExpiredOrCreditEmptyWithNoUpcomingCredit

  const tutorialNavigateTo: InternalNavigationProps['navigateTo'] =
    userAge && userAge < 19 && userAge > 14
      ? { screen: 'ProfileTutorialAgeInformation', params: { age: userAge } }
      : { screen: 'AgeSelection', params: { type: TutorialTypes.PROFILE_TUTORIAL } }

  useFocusEffect(
    useCallback(() => {
      if (permissionState === GeolocPermissionState.GRANTED) {
        setIsGeolocSwitchActive(true)
      } else {
        setIsGeolocSwitchActive(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPositionError, permissionState])
  )

  const switchGeolocation = useCallback(async () => {
    if (permissionState === GeolocPermissionState.GRANTED) {
      favoritesDispatch({ type: 'SET_SORT_BY', payload: 'RECENTLY_ADDED' })
      showGeolocPermissionModal()
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedLogLocationToggle = useCallback(
    debounce(analytics.logLocationToggle, DEBOUNCE_TOGGLE_DELAY_MS),
    []
  )

  function scrollToTop() {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }
  const debouncedScrollToTop = debounce(scrollToTop, 400)

  useEffect(() => {
    if (!isLoggedIn) {
      debouncedScrollToTop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const logProfilScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logProfilScrolledToBottom()
    }
  }

  const onShareBannerPress = useCallback(() => {
    analytics.logShareApp({ from: 'profile' })
    shareApp('profile_banner')
  }, [])

  return (
    <Container>
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        testID="profile-scrollview">
        <ProfileHeader user={user} />
        <ProfileContainer>
          <Spacer.Column numberOfSpaces={4} />
          <Section title={isLoggedIn ? 'Paramètres du compte' : 'Paramètres de l’application'}>
            <VerticalUl>
              {!!isLoggedIn && (
                <Li>
                  <Row
                    title="Informations personnelles"
                    type="navigable"
                    navigateTo={{ screen: 'PersonalData' }}
                    icon={BicolorProfile}
                  />
                </Li>
              )}
              <Li>
                <Row
                  type="navigable"
                  title="Notifications"
                  icon={Bell}
                  navigateTo={{ screen: 'NotificationSettings' }}
                />
              </Li>
              <Li>
                <SectionWithSwitch
                  icon={LocationPointer}
                  iconSize={SECTION_ROW_ICON_SIZE}
                  title="Partager ma position"
                  active={isGeolocSwitchActive}
                  accessibilityDescribedBy={locationActivationErrorId}
                  toggle={() => {
                    switchGeolocation()
                    debouncedLogLocationToggle(!isGeolocSwitchActive)
                  }}
                  toggleLabel="Partager ma position"
                />
                <InputError
                  visible={!!userPositionError}
                  messageId={userPositionError?.message}
                  numberOfSpacesTop={1}
                  relatedInputId={locationActivationErrorId}
                />
              </Li>
            </VerticalUl>
          </Section>
          <Section title="Aides">
            <VerticalUl>
              {!!shouldDisplayTutorial && (
                <Li>
                  <Row
                    title="Comment ça marche&nbsp;?"
                    type="navigable"
                    navigateTo={tutorialNavigateTo}
                    onPress={() =>
                      analytics.logConsultTutorial({ age: userAge, from: 'ProfileHelp' })
                    }
                    icon={LifeBuoy}
                  />
                </Li>
              )}
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
              <Li>
                <Row
                  title="Accessibilité"
                  type="navigable"
                  navigateTo={{ screen: 'Accessibility' }}
                  icon={HandicapMental}
                />
              </Li>
              <Li>
                <Row
                  title="Informations légales"
                  type="navigable"
                  navigateTo={{ screen: 'LegalNotices' }}
                  icon={LegalNotices}
                />
              </Li>
              <Li>
                <Row
                  title="Confidentialité"
                  type="navigable"
                  navigateTo={{ screen: 'ConsentSettings' }}
                  icon={Confidentiality}
                />
              </Li>
            </VerticalUl>
          </Section>
          {Platform.OS !== 'web' && (
            <Section title="Partager le pass Culture">
              <Spacer.Column numberOfSpaces={4} />
              <BannerWithBackground
                backgroundSource={SHARE_APP_BANNER_IMAGE_SOURCE}
                onPress={onShareBannerPress}>
                <ShareAppContainer>
                  <StyledButtonText>Partage le pass Culture</StyledButtonText>
                  <Spacer.Column numberOfSpaces={1} />
                  <StyledBody>Recommande le bon plan à&nbsp;tes&nbsp;amis&nbsp;!</StyledBody>
                </ShareAppContainer>
              </BannerWithBackground>
              <Spacer.Column numberOfSpaces={4} />
            </Section>
          )}
          <Section title="Suivre le pass Culture">
            <SocialNetwork />
          </Section>
          {!!isLoggedIn && (
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
          )}
          <Section>
            <Spacer.Column numberOfSpaces={4} />
            <Typo.CaptionNeutralInfo>{version}</Typo.CaptionNeutralInfo>
            <Spacer.Column numberOfSpaces={4} />
            <LogoMinistereContainer>
              <LogoMinistere />
            </LogoMinistereContainer>
            <Spacer.Column numberOfSpaces={4} />
          </Section>
          <Spacer.TabBar />
        </ProfileContainer>
      </ScrollView>
      <StatusBarBlurredBackground />
    </Container>
  )
}

export function Profile() {
  const netInfo = useNetInfoContext()
  if (netInfo.isConnected) {
    return <OnlineProfile />
  }
  return <OfflinePage />
}

const Container = styled.View({ flex: 1 })

const paddingVertical = getSpacing(4)

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical,
})

const ShareAppContainer = styled.View(({ theme }) => ({
  paddingRight: theme.isSmallScreen ? 0 : getSpacing(8),
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
}))

const LogoMinistereContainer = styled.View({
  width: getSpacing(40),
  height: getSpacing(28),
})
