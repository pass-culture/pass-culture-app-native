import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, Platform, ScrollView, View } from 'react-native'
import styled from 'styled-components/native'

import { YoungStatusType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { useFavoritesState } from 'features/favorites/context/FavoritesWrapper'
import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
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
import { GeolocPermissionState, useLocation } from 'libs/location/location'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { ScreenPerformance } from 'performance/ScreenPerformance'
import { useMeasureScreenPerformanceWhenVisible } from 'performance/useMeasureScreenPerformanceWhenVisible'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { getAge } from 'shared/user/getAge'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { BannerWithBackground } from 'ui/components/ModuleBanner/BannerWithBackground'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { StatusBarBlurredBackground } from 'ui/components/statusBar/statusBarBlurredBackground'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { useDebounce } from 'ui/hooks/useDebounce'
import { useVersion } from 'ui/hooks/useVersion'
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
import { Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

const isWeb = Platform.OS === 'web'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000
const DARK_MODE_GTM_APPEARANCE_TAG_KEY = 'darkModeGtmAppearanceTagSeen'

const CHATBOT_ELIGIBLE_STATUSES = new Set<YoungStatusType>([
  YoungStatusType.eligible,
  YoungStatusType.beneficiary,
  YoungStatusType.ex_beneficiary,
])

const OnlineProfile: React.FC = () => {
  useMeasureScreenPerformanceWhenVisible(ScreenPerformance.PROFILE)
  const enableDarkModeGtm = useFeatureFlag(RemoteStoreFeatureFlags.DARK_MODE_GTM)
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const enablePassForAll = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL)
  const enableProfileV2 = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_PROFILE_V2)
  const enableDebugSection = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_DEBUG_SECTION)
  const enableChatbot = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_CHATBOT)

  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { isLoggedIn, user } = useAuthContext()
  const signOut = useLogoutRoutine()
  const version = useVersion()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const userAge = getAge(user?.birthDate)
  const {
    data: { displayInAppFeedback },
  } = useRemoteConfigQuery()
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
    userAge && userAge >= 18 && (isDepositExpired || isCreditEmpty)

  const shouldDisplayTutorial = !user?.isBeneficiary || isExpiredOrCreditEmptyWithNoUpcomingCredit
  const [hasSeenAppearanceTag, setHasSeenAppearanceTag] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchAppearanceTagState = async () => {
      if (!enableDarkModeGtm) {
        setHasSeenAppearanceTag(null)
        return
      }
      const stored = await AsyncStorage.getItem(DARK_MODE_GTM_APPEARANCE_TAG_KEY)
      if (!mounted) return
      setHasSeenAppearanceTag(stored === 'true')
    }

    fetchAppearanceTagState()
    return () => {
      mounted = false
    }
  }, [enableDarkModeGtm])

  const markAppearanceTagSeen = useCallback(() => {
    setHasSeenAppearanceTag(true)
    AsyncStorage.setItem(DARK_MODE_GTM_APPEARANCE_TAG_KEY, 'true').catch(() => null)
  }, [])

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

  const shouldShowAchievementsSection = user?.isBeneficiary

  const userStatusType = user?.status?.statusType
  const isEligibleForChatbot = !!userStatusType && CHATBOT_ELIGIBLE_STATUSES.has(userStatusType)
  const shouldDisplayChatbot = enableChatbot && isEligibleForChatbot

  const shareBannerTitle = 'Partage le pass Culture'
  const shareBannerDescription = 'Recommande le bon plan à tes amis\u00a0!'

  const tabLabel = 'Nouveau'
  const accessibilityLabel = `Apparence - ${tabLabel}`

  return (
    <Page testID="profile-V1">
      <ScrollView
        bounces
        ref={scrollViewRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        testID="profile-scrollview">
        <ScrollViewContentContainer>
          <View accessibilityRole={AccessibilityRole.MAIN}>
            <ProfileHeader
              featureFlags={{ disableActivation, enablePassForAll, enableProfileV2 }}
              user={user}
            />
            <ProfileContainer>
              <Spacer.Column numberOfSpaces={4} />
              {isLoggedIn ? (
                <Section title="Profil">
                  <VerticalUl>
                    {shouldShowAchievementsSection ? (
                      <Li>
                        <Row
                          title="Mes succès"
                          type="navigable"
                          navigateTo={getProfilePropConfig('Achievements', { from: 'profile' })}
                          icon={Trophy}
                        />
                      </Li>
                    ) : null}
                    <Li>
                      <Row
                        title="Informations personnelles"
                        type="navigable"
                        navigateTo={getProfilePropConfig('PersonalData')}
                        icon={ProfileIcon}
                      />
                    </Li>
                  </VerticalUl>
                </Section>
              ) : null}
              <Section title="Paramètres">
                <VerticalUl>
                  <LiWithMarginVertical accessible={false}>
                    <SectionWithSwitch
                      icon={LocationPointer}
                      iconSize={SECTION_ROW_ICON_SIZE}
                      title="Géolocalisation"
                      active={isGeolocSwitchActive}
                      accessibilityHint={geolocPositionError?.message}
                      toggle={() => {
                        switchGeolocation()
                        debouncedLogLocationToggle(!isGeolocSwitchActive)
                      }}
                      toggleLabel="Géolocalisation"
                    />
                    <InputError
                      visible={!!geolocPositionError}
                      errorMessage={geolocPositionError?.message}
                      numberOfSpacesTop={1}
                    />
                  </LiWithMarginVertical>
                  <Li>
                    <Row
                      title="Apparence"
                      type="navigable"
                      navigateTo={getProfilePropConfig('Appearance')}
                      accessibilityLabel={
                        enableDarkModeGtm && !hasSeenAppearanceTag ? accessibilityLabel : undefined
                      }
                      renderTitle={(title) => (
                        <TitleWithTag>
                          <Typo.BodyAccent numberOfLines={2}>{title}</Typo.BodyAccent>
                          {enableDarkModeGtm && !hasSeenAppearanceTag ? (
                            <Tag label={tabLabel} variant={TagVariant.NEW} />
                          ) : null}
                        </TitleWithTag>
                      )}
                      onPress={markAppearanceTagSeen}
                      icon={ArtMaterial}
                    />
                  </Li>
                  <Li>
                    <Row
                      type="navigable"
                      title="Notifications et thèmes suivis"
                      icon={Bell}
                      navigateTo={getProfilePropConfig('NotificationsSettings')}
                    />
                  </Li>
                </VerticalUl>
              </Section>
              <Section title="Aide">
                <VerticalUl>
                  {shouldDisplayChatbot ? (
                    <Li>
                      <Row
                        title="Poser une question"
                        type="navigable"
                        navigateTo={getProfilePropConfig('Chatbot')}
                        icon={LifeBuoy}
                      />
                    </Li>
                  ) : null}
                  {shouldDisplayTutorial ? (
                    <Li>
                      <Row
                        title="Comment ça marche&nbsp;?"
                        type="navigable"
                        navigateTo={getProfilePropConfig('ProfileTutorialAgeInformationCredit')}
                        onPress={() =>
                          analytics.logConsultTutorial({ age: userAge, from: 'ProfileHelp' })
                        }
                        icon={LifeBuoy}
                      />
                    </Li>
                  ) : null}
                  <Li>
                    <Row
                      title="Chercher une info"
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
                      title="Confidentialité"
                      type="navigable"
                      navigateTo={getProfilePropConfig('ConsentSettings')}
                      icon={Confidentiality}
                    />
                  </Li>
                  <Li>
                    <Row
                      title="Accessibilité"
                      type="navigable"
                      navigateTo={getProfilePropConfig('Accessibility')}
                      icon={HandicapMental}
                    />
                  </Li>
                  <Li>
                    <Row
                      title="Informations légales"
                      type="navigable"
                      navigateTo={getProfilePropConfig('LegalNotices')}
                      icon={LegalNotices}
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
                </VerticalUl>
              </Section>
              {isWeb ? null : (
                <Section title="Partager le pass Culture">
                  <Spacer.Column numberOfSpaces={4} />
                  <BannerWithBackground
                    backgroundSource={SHARE_APP_BANNER_IMAGE_SOURCE}
                    onPress={onShareBannerPress}
                    accessibilityRole={AccessibilityRole.BUTTON}
                    accessibilityLabel={getComputedAccessibilityLabel(
                      shareBannerTitle,
                      shareBannerDescription
                    )}>
                    <ShareAppContainer gap={1}>
                      <StyledButtonText>{shareBannerTitle}</StyledButtonText>
                      <StyledBody>{shareBannerDescription}</StyledBody>
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
                    <ButtonContainerFlexStart>
                      <InternalTouchableLink
                        as={Button}
                        size="small"
                        variant="tertiary"
                        color="neutral"
                        wording="Débuggage"
                        navigateTo={getProfilePropConfig('DebugScreen')}
                      />
                    </ButtonContainerFlexStart>
                  </DebugButtonContainer>
                ) : null}
              </Section>
            </ProfileContainer>
          </View>
          <AccessibilityFooter withHorizontalMargin />
        </ScrollViewContentContainer>
      </ScrollView>
      <StatusBarBlurredBackground />
    </Page>
  )
}

export function ProfileV1() {
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

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.l,
}))

const TitleWithTag = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginRight: theme.designSystem.size.spacing.s,
}))

const ShareAppContainer = styled(ViewGap)(({ theme }) => ({
  paddingRight: theme.isSmallScreen ? 0 : theme.designSystem.size.spacing.xxl,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const Version = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
  marginVertical: theme.designSystem.size.spacing.l,
}))

const DebugButtonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const LiWithMarginVertical = styled(Li)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
