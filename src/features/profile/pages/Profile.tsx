import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NativeScrollEvent, ScrollView, StyleSheet } from 'react-native'
import webStyled from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useUserProfileInfo } from 'features/home/api'
import { openUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ProfileHeader } from 'features/profile/components/ProfileHeader'
import { ProfileContainer } from 'features/profile/components/reusables'
import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch'
import { SmartBanner } from 'features/smartBanner/SmartBanner'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { InputError } from 'ui/components/inputs/InputError'
import { Section } from 'ui/components/Section'
import { SectionRow } from 'ui/components/SectionRow'
import { SocialNetworkCard } from 'ui/components/SocialNetworkCard'
import { Bell } from 'ui/svg/icons/Bell'
import { Confidentiality } from 'ui/svg/icons/Confidentiality'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { LegalNotices } from 'ui/svg/icons/LegalNotices'
import { LifeBuoy } from 'ui/svg/icons/LifeBuoy'
import { LocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { Lock } from 'ui/svg/icons/Lock'
import { Profile as ProfileIcon } from 'ui/svg/icons/Profile'
import { SignOut } from 'ui/svg/icons/SignOut'
import { LogoMinistere } from 'ui/svg/LogoMinistere'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'
import { A } from 'ui/web/link/A'
import { Link } from 'ui/web/link/Link'
import { Li } from 'ui/web/list/Li'
import { Ul, VerticalUl } from 'ui/web/list/Ul'

import Package from '../../../../package.json'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const Profile: React.FC = () => {
  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { navigate } = useNavigation<UseNavigationType>()
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
  }, [permissionState])

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
      <SmartBanner />
      <ProfileHeader user={user} />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={getSpacing(1)} />
        <Section title={isLoggedIn ? t`Paramètres du compte` : t`Paramètres de l'application`}>
          <VerticalUl>
            {!!isLoggedIn && (
              <React.Fragment>
                <Li>
                  <Link
                    to={{ screen: 'PersonalData', params: undefined }}
                    style={styles.link}
                    accessible={false}>
                    <Row
                      title={t`Informations personnelles`}
                      type="navigable"
                      onPress={() => navigate('PersonalData')}
                      icon={ProfileIcon}
                    />
                  </Link>
                </Li>
                <Li>
                  <Link
                    to={{ screen: 'ChangePassword', params: undefined }}
                    style={styles.link}
                    accessible={false}>
                    <Row
                      title={t`Mot de passe`}
                      type="navigable"
                      onPress={() => navigate('ChangePassword')}
                      icon={Lock}
                    />
                  </Link>
                </Li>
              </React.Fragment>
            )}
            <Li>
              <Link
                to={{ screen: 'NotificationSettings', params: undefined }}
                style={styles.link}
                accessible={false}>
                <Row
                  type="navigable"
                  title={t`Notifications`}
                  icon={Bell}
                  onPress={() => navigate('NotificationSettings')}
                />
              </Link>
            </Li>
            <Li>
              <SectionWithSwitch
                icon={LocationPointerNotFilled}
                iconSize={SECTION_ROW_ICON_SIZE}
                title={t`Partager ma position`}
                active={isGeolocSwitchActive}
                accessibilityLabel={t`Interrupteur géolocalisation`}
                accessibilityDescribedBy={locationActivationErrorId}
                toggle={() => {
                  switchGeolocation()
                  debouncedLogLocationToggle(!isGeolocSwitchActive)
                }}
                toggleLabel={t`Partager ma position`}
              />
              {!!positionError && (
                <InputError
                  visible
                  messageId={positionError.message}
                  numberOfSpacesTop={1}
                  relatedInputId={locationActivationErrorId}
                />
              )}
            </Li>
          </VerticalUl>
        </Section>
        <Section title={t`Aides`}>
          <VerticalUl>
            <Li>
              <Link
                to={{ screen: 'FirstTutorial', params: { shouldCloseAppOnBackAction: false } }}
                style={styles.link}
                accessible={false}>
                <Row
                  title={t`Comment ça marche\u00a0?`}
                  type="navigable"
                  onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
                  icon={LifeBuoy}
                />
              </Link>
            </Li>
            <Li>
              <A href={env.FAQ_LINK}>
                <Row
                  title={t`Centre d'aide`}
                  type="clickable"
                  onPress={() => openUrl(env.FAQ_LINK)}
                  icon={ExternalSite}
                />
              </A>
            </Li>
          </VerticalUl>
        </Section>
        <Section title={t`Autres`}>
          <VerticalUl>
            <Li>
              <A href={env.ACCESSIBILITY_LINK}>
                <Row
                  title={t`Accessibilité`}
                  type="clickable"
                  onPress={() => openUrl(env.ACCESSIBILITY_LINK)}
                  icon={ExternalSite}
                />
              </A>
            </Li>
            <Li>
              <Link
                to={{ screen: 'LegalNotices', params: undefined }}
                style={styles.link}
                accessible={false}>
                <Row
                  title={t`Mentions légales`}
                  type="navigable"
                  onPress={() => navigate('LegalNotices')}
                  icon={LegalNotices}
                />
              </Link>
            </Li>
            <Li>
              <Link
                to={{ screen: 'ConsentSettings', params: undefined }}
                style={styles.link}
                accessible={false}>
                <Row
                  title={t`Confidentialité`}
                  type="navigable"
                  onPress={() => navigate('ConsentSettings')}
                  icon={Confidentiality}
                />
              </Link>
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
            <SignOutRow
              title={t`Déconnexion`}
              {...accessibilityAndTestId(t`Déconnexion`)}
              onPress={signOut}
              type="clickable"
              icon={SignOut}
            />
          </Section>
        )}
        <Section>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCaption>{t`Version` + `\u00a0${Package.version}`}</StyledCaption>
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

const paddingVertical = getSpacing(4)

const Row = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  paddingVertical,
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

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

const StyledUl = webStyled(Ul)({
  flex: 1,
  justifyContent: 'space-between',
})

const SignOutRow = styled(SectionRow).attrs({ iconSize: SECTION_ROW_ICON_SIZE })({
  marginTop: getSpacing(4),
})

const styles = StyleSheet.create({
  link: {
    flexDirection: 'column',
    display: 'flex',
  },
})
