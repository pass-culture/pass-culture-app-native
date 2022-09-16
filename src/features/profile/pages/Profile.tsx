import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useUserProfileInfo } from 'features/profile/api'
import { ProfileHeader } from 'features/profile/components/Header/ProfileHeader/ProfileHeader'
import { ProfileContainer } from 'features/profile/components/reusables'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { env } from 'libs/environment'
import { analytics, isCloseToBottom } from 'libs/firebase/analytics'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { OfflinePage } from 'libs/network/OfflinePage'
import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { InputError } from 'ui/components/inputs/InputError'
import { Li } from 'ui/components/Li'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { Ul, VerticalUl } from 'ui/components/Ul'
import { Bell } from 'ui/svg/icons/Bell'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { SignOut } from 'ui/svg/icons/SignOut'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

import Package from '../../../../package.json'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

const OnlineProfile: React.FC = () => {
  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { data: user } = useUserProfileInfo()
  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const locationActivationErrorId = uuidv4()

  const { positionError, permissionState, requestGeolocPermission, showGeolocPermissionModal } =
    useGeolocation()
  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(
    permissionState === GeolocPermissionState.GRANTED
  )

  useFocusEffect(
    useCallback(() => {
      if (permissionState === GeolocPermissionState.GRANTED) {
        setIsGeolocSwitchActive(true)
      } else {
        setIsGeolocSwitchActive(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positionError, permissionState])
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
    if (scrollViewRef && scrollViewRef.current) {
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

  return (
    <ScrollView
      bounces={false}
      ref={scrollViewRef}
      onScroll={onScroll}
      scrollEventThrottle={400}
      testID="profile-scrollview">
      <ProfileHeader user={user} />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={4} />
        <Section title={isLoggedIn ? t`Paramètres du compte` : t`Paramètres de l'application`}>
          <VerticalUl>
            {!!isLoggedIn && (
              <Li>
                <Row
                  title={t`Informations personnelles`}
                  type="navigable"
                  navigateTo={{ screen: 'PersonalData' }}
                  icon={BicolorProfile}
                />
              </Li>
            )}
            <Li>
              <Row
                type="navigable"
                title={t`Notifications`}
                icon={Bell}
                navigateTo={{ screen: 'NotificationSettings' }}
              />
            </Li>
            <Li>
              <SectionWithSwitch
                icon={LocationPointerNotFilled}
                iconSize={SECTION_ROW_ICON_SIZE}
                title={t`Partager ma position`}
                active={isGeolocSwitchActive}
                accessibilityDescribedBy={locationActivationErrorId}
                toggle={() => {
                  switchGeolocation()
                  debouncedLogLocationToggle(!isGeolocSwitchActive)
                }}
                toggleLabel={t`Partager ma position`}
              />
              <InputError
                visible={!!positionError}
                messageId={positionError?.message}
                numberOfSpacesTop={1}
                relatedInputId={locationActivationErrorId}
              />
            </Li>
          </VerticalUl>
        </Section>
        <Section title={t`Aides`}>
          <VerticalUl>
            <Li>
              <Row
                title={t`Comment ça marche\u00a0?`}
                type="navigable"
                navigateTo={{
                  screen: 'FirstTutorial',
                  params: { shouldCloseAppOnBackAction: false },
                }}
                onPress={() => analytics.logConsultTutorial('profile')}
                icon={LifeBuoy}
              />
            </Li>
            <Li>
              <Row
                title={t`Centre d'aide`}
                type="clickable"
                externalNav={{ url: env.FAQ_LINK }}
                icon={ExternalSite}
              />
            </Li>
          </VerticalUl>
        </Section>
        <Section title={t`Autres`}>
          <VerticalUl>
            <Li>
              <Row
                title={t`Accessibilité`}
                type="clickable"
                externalNav={{ url: env.ACCESSIBILITY_LINK }}
                icon={ExternalSite}
              />
            </Li>
            <Li>
              <Row
                title={t`Mentions légales`}
                type="navigable"
                navigateTo={{ screen: 'LegalNotices' }}
                icon={LegalNotices}
              />
            </Li>
            <Li>
              <Row
                title={t`Confidentialité`}
                type="navigable"
                navigateTo={{ screen: 'ConsentSettings' }}
                icon={Confidentiality}
              />
            </Li>
          </VerticalUl>
        </Section>
        <Section title={t`Suivre pass Culture`}>
          <NetworkRow>
            <NetworkRowContainer>
              <StyledUl>
                <Li>
                  <SocialNetworkCard network="instagram" />
                </Li>
                <Li>
                  <SocialNetworkCard network="twitter" />
                </Li>
                <Li>
                  <SocialNetworkCard network="tiktok" />
                </Li>
                <Li>
                  <SocialNetworkCard network="facebook" />
                </Li>
              </StyledUl>
            </NetworkRowContainer>
          </NetworkRow>
        </Section>
        {!!isLoggedIn && (
          <Section>
            <Spacer.Column numberOfSpaces={4} />
            <SectionRow
              title={t`Déconnexion`}
              onPress={signOut}
              type="clickable"
              icon={SignOut}
              iconSize={SECTION_ROW_ICON_SIZE}
            />
          </Section>
        )}
        <Section>
          <Spacer.Column numberOfSpaces={4} />
          <GreyDarkCaption>{t`Version` + `\u00a0${Package.version}`}</GreyDarkCaption>
          <Spacer.Column numberOfSpaces={4} />
          <LogoMinistereContainer>
            <LogoMinistere />
          </LogoMinistereContainer>
          <Spacer.Column numberOfSpaces={4} />
        </Section>
        <Spacer.TabBar />
      </ProfileContainer>
    </ScrollView>
  )
}

export const Profile: React.FC = () => {
  const netInfo = useNetInfoContext()
  if (netInfo.isConnected) {
    return <OnlineProfile />
  }
  return <OfflinePage />
}

const paddingVertical = getSpacing(4)

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical,
})

const LogoMinistereContainer = styled.View({
  width: getSpacing(40),
  height: getSpacing(28),
})

const NetworkRow = styled.View(({ theme }) => ({
  width: '100%',
  margin: 'auto',
  maxWidth: theme.contentPage.maxWidth,
}))

const NetworkRowContainer = styled.View({
  flexDirection: 'row',
  paddingVertical,
  justifyContent: 'space-between',
})

const StyledUl = styled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
})
