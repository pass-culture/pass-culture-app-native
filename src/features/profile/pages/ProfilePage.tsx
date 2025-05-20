import { useFocusEffect } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { SocialNetwork } from 'features/profile/components/SocialNetwork/SocialNetwork'
import { SHARE_APP_BANNER_IMAGE_SOURCE } from 'features/share/components/shareAppBannerImage'
import { shareApp } from 'features/share/helpers/shareApp'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { isCloseToBottom } from 'libs/analytics'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { GeolocationError, GeolocPermissionState, useLocation } from 'libs/location'
import { OfflineWrapper } from 'libs/network/OfflineWrapper'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { getAge } from 'shared/user/getAge'
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
import { useDebounce } from 'ui/hooks/useDebounce'
import { useVersion } from 'ui/hooks/useVersion'
import { Page } from 'ui/pages/Page'
import { Bell } from 'ui/svg/icons/Bell'
import { ArtMaterial } from 'ui/svg/icons/bicolor/ArtMaterial'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { HandicapMental } from 'ui/svg/icons/HandicapMental'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { SignOut } from 'ui/svg/icons/SignOut'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

const isWeb = Platform.OS === 'web'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

const ProfileContainer: FunctionComponent = () => {
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const enablePassForAll = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL)
  const enableDebugSection = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_DEBUG_SECTION)

  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { isLoggedIn, user } = useAuthContext()
  const signOut = useLogoutRoutine()
  const version = useVersion()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const locationActivationErrorId = uuidv4()
  const userAge = getAge(user?.birthDate)
  const { displayInAppFeedback } = useRemoteConfigQuery()
  const {
    geolocPositionError,
    permissionState,
    requestGeolocPermission,
    showGeolocPermissionModal,
  } = useLocation()
  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(
    permissionState === GeolocPermissionState.GRANTED
  )
  const isCreditEmpty = user?.domainsCredit?.all.remaining === 0

  const isDepositExpired = user?.depositExpirationDate
    ? new Date(user?.depositExpirationDate) < new Date()
    : false

  const isExpiredOrCreditEmptyWithNoUpcomingCredit =
    userAge && userAge >= 18 && (isDepositExpired || isCreditEmpty) // je préfèrerais que ce calcul soit fait coté backend, et qu'on réceptionne un status

  const shouldDisplayTutorial = !user?.isBeneficiary || isExpiredOrCreditEmptyWithNoUpcomingCredit

  useFocusEffect(
    useCallback(() => {
      if (permissionState === GeolocPermissionState.GRANTED) {
        setIsGeolocSwitchActive(true)
      } else {
        setIsGeolocSwitchActive(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [geolocPositionError, permissionState])
  )

  const switchGeolocation = useCallback(async () => {
    // en voyant le code actuel, ça me donne envie de gérer la géoloc dans son propre container
    if (permissionState === GeolocPermissionState.GRANTED) {
      favoritesDispatch({ type: 'SET_SORT_BY', payload: 'RECENTLY_ADDED' }) // WTF ? pourquoi les favoris sont liés à la géoloc ?
      showGeolocPermissionModal()
    } else if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
      showGeolocPermissionModal()
    } else {
      await requestGeolocPermission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  const debouncedLogLocationToggle = useDebounce(
    analytics.logLocationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  function scrollToTop() {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }
  const debouncedScrollToTop = useDebounce(scrollToTop, 400)

  useEffect(() => {
    if (!isLoggedIn) {
      debouncedScrollToTop() // devrait etre appelé par la déconnexion
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
    <ProfileDumb
      scrollViewRef={scrollViewRef}
      onScroll={onScroll}
      disableActivation={disableActivation}
      enablePassForAll={enablePassForAll}
      user={user}
      isLoggedIn={isLoggedIn}
      isGeolocSwitchActive={isGeolocSwitchActive}
      locationActivationErrorId={locationActivationErrorId}
      switchGeolocation={switchGeolocation}
      debouncedLogLocationToggle={debouncedLogLocationToggle}
      geolocPositionError={geolocPositionError}
      shouldDisplayTutorial={shouldDisplayTutorial}
      userAge={userAge}
      displayInAppFeedback={displayInAppFeedback}
      onShareBannerPress={onShareBannerPress}
      signOut={signOut}
      version={version}
      enableDebugSection={enableDebugSection}
    />
  )
}

type Props = {
  scrollViewRef: React.MutableRefObject<ScrollView | null>
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  disableActivation: boolean
  enablePassForAll: boolean
  user: UserProfileResponse | undefined
  isLoggedIn: boolean
  isGeolocSwitchActive: boolean
  locationActivationErrorId: string
  switchGeolocation: () => Promise<void>
  debouncedLogLocationToggle: (props: boolean) => Promise<void>
  geolocPositionError: GeolocationError | null
  shouldDisplayTutorial: number | boolean | undefined
  userAge: number | undefined
  displayInAppFeedback: boolean
  onShareBannerPress: () => void
  signOut: () => Promise<void>
  version: string
  enableDebugSection: boolean
}

const ProfileDumb: FunctionComponent<Props> = ({
  scrollViewRef,
  onScroll,
  disableActivation,
  enablePassForAll,
  user,
  isLoggedIn,
  isGeolocSwitchActive,
  locationActivationErrorId,
  switchGeolocation,
  debouncedLogLocationToggle,
  geolocPositionError,
  shouldDisplayTutorial,
  userAge,
  displayInAppFeedback,
  onShareBannerPress,
  signOut,
  version,
  enableDebugSection,
}) => (
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
          <Container>
            <Spacer.Column numberOfSpaces={4} />
            {/* IMHO, "Paramètres" serait plus court et suffisant */}
            <Section title={isLoggedIn ? 'Paramètres du compte' : 'Paramètres de l’application'}>
              <VerticalUl>
                {isLoggedIn ? (
                  <Li>
                    <Row
                      title="Informations personnelles"
                      type="navigable"
                      navigateTo={getProfileNavConfig('PersonalData')}
                      icon={BicolorProfile}
                    />
                  </Li>
                ) : null}
                <Li>
                  <Row
                    type="navigable"
                    title="Notifications"
                    icon={Bell}
                    navigateTo={getProfileNavConfig('NotificationsSettings')}
                  />
                </Li>
                <LiWithMarginVertical>
                  <SectionWithSwitch
                    icon={LocationPointer}
                    iconSize={SECTION_ROW_ICON_SIZE}
                    title="Activer ma géolocalisation"
                    active={isGeolocSwitchActive}
                    accessibilityDescribedBy={locationActivationErrorId}
                    toggle={() => {
                      switchGeolocation()
                      debouncedLogLocationToggle(!isGeolocSwitchActive)
                    }}
                    toggleLabel="Activer ma géolocalisation"
                  />
                  <InputError
                    visible={!!geolocPositionError}
                    messageId={geolocPositionError?.message}
                    numberOfSpacesTop={1}
                    relatedInputId={locationActivationErrorId}
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
                      navigateTo={getProfileNavConfig('ProfileTutorialAgeInformationCredit')}
                      onPress={
                        () => analytics.logConsultTutorial({ age: userAge, from: 'ProfileHelp' }) // pourquoi le log sur la page ne suffit pas ? ne devrait-on pas déclencher ce log à l'affichage de la page et non au clic redirigeant vers la page ?
                      }
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
                {/* TODO(PC-35459): Remove this condition when add dark theme button in DisplayPreference */}
                {isWeb ? null : (
                  <Li>
                    <Row
                      title="Préférences d’affichage"
                      type="navigable"
                      navigateTo={getProfileNavConfig('DisplayPreference')}
                      icon={ArtMaterial}
                    />
                  </Li>
                )}
                <Li>
                  <Row
                    title="Accessibilité"
                    type="navigable"
                    navigateTo={getProfileNavConfig('Accessibility')}
                    icon={HandicapMental}
                  />
                </Li>
                {displayInAppFeedback ? (
                  <Li>
                    <Row
                      title="Faire une suggestion"
                      type="navigable"
                      navigateTo={getProfileNavConfig('FeedbackInApp')}
                      icon={Bulb}
                    />
                  </Li>
                ) : null}
                <Li>
                  <Row
                    title="Informations légales"
                    type="navigable"
                    navigateTo={getProfileNavConfig('LegalNotices')}
                    icon={LegalNotices}
                  />
                </Li>
                <Li>
                  <Row
                    title="Confidentialité"
                    type="navigable"
                    navigateTo={getProfileNavConfig('ConsentSettings')}
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
              {enableDebugSection && isLoggedIn ? (
                <DebugButtonContainer>
                  <InternalTouchableLink
                    as={ButtonQuaternaryBlack}
                    wording="Débuggage"
                    navigateTo={getProfileNavConfig('DebugScreen')}
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
          </Container>
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

export const ProfilePage = () => (
  <OfflineWrapper>
    <ProfileContainer />
  </OfflineWrapper>
)

const Container = styled.View(({ theme }) => ({
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
  color: theme.colors.white,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.colors.white,
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
