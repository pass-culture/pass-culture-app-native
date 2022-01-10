import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Platform, NativeScrollEvent, StyleSheet, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useUserProfileInfo } from 'features/home/api'
import { openUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { SmartBanner } from 'features/smartBanner/SmartBanner'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { accessibilityAndTestId } from 'tests/utils'
import FilterSwitch from 'ui/components/FilterSwitch'
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

import Package from '../../../../package.json'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileContainer } from '../components/reusables'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const Profile: React.FC = () => {
  const { isMobileViewport } = useTheme()
  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()
  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()
  const scrollViewRef = useRef<ScrollView | null>(null)

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
        <ProfileSection
          title={isLoggedIn ? t`Paramètres du compte` : t`Paramètres de l'application`}>
          {!!isLoggedIn && (
            <React.Fragment>
              <Row
                title={t`Informations personnelles`}
                type="navigable"
                onPress={() => navigate('PersonalData')}
                icon={ProfileIcon}
                style={styles.row}
              />
              <Row
                title={t`Mot de passe`}
                type="navigable"
                onPress={() => navigate('ChangePassword')}
                icon={Lock}
                style={styles.row}
              />
            </React.Fragment>
          )}
          <SectionRow
            type="navigable"
            title={t`Notifications`}
            icon={Bell}
            iconSize={SECTION_ROW_ICON_SIZE}
            onPress={() => navigate('NotificationSettings')}
            style={styles.row}
          />
          <SectionRow
            type="clickable"
            title={t`Géolocalisation`}
            icon={LocationPointerNotFilled}
            iconSize={SECTION_ROW_ICON_SIZE}
            style={styles.row}
            cta={
              <FilterSwitchLabelContainer>
                {!isMobileViewport && <StyledCaption>{t`Partager ma position`}</StyledCaption>}
                <FilterSwitch
                  active={isGeolocSwitchActive}
                  accessibilityLabel={t`Interrupteur géolocalisation`}
                  toggle={() => {
                    switchGeolocation()
                    debouncedLogLocationToggle(!isGeolocSwitchActive)
                  }}
                />
              </FilterSwitchLabelContainer>
            }
          />
          {!!positionError && (
            <InputError visible messageId={positionError.message} numberOfSpacesTop={1} />
          )}
        </ProfileSection>
        <ProfileSection title={t`Aides`}>
          <Row
            title={t`Comment ça marche\u00a0?`}
            type="navigable"
            onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
            icon={LifeBuoy}
            style={styles.row}
          />
          <Row
            title={t`Questions fréquentes`}
            type="clickable"
            onPress={() => openUrl(env.FAQ_LINK)}
            icon={ExternalSite}
            style={styles.row}
          />
          {Platform.OS !== 'web' && (
            <Row
              title={t`Problèmes pour ouvrir un lien\u00a0?`}
              type="navigable"
              onPress={() => navigate('DeeplinkImporter')}
              icon={LifeBuoy}
              style={styles.row}
            />
          )}
        </ProfileSection>
        <ProfileSection title={t`Autres`}>
          <Row
            title={t`Accessibilité`}
            type="clickable"
            onPress={() => openUrl(env.ACCESSIBILITY_LINK)}
            icon={ExternalSite}
            style={styles.row}
          />
          <Row
            title={t`Mentions légales`}
            type="navigable"
            onPress={() => navigate('LegalNotices')}
            icon={LegalNotices}
            style={styles.row}
          />
          <Row
            title={t`Confidentialité`}
            type="navigable"
            onPress={() => navigate('ConsentSettings')}
            icon={Confidentiality}
            style={styles.row}
          />
        </ProfileSection>
        <ProfileSection title={t`Suivre pass Culture`}>
          <NetworkRow>
            <NetworkRowContainer>
              <SocialNetworkCard network="instagram" />
              <SocialNetworkCard network="twitter" />
              <SocialNetworkCard network="snapchat" />
              <SocialNetworkCard network="facebook" />
            </NetworkRowContainer>
          </NetworkRow>
        </ProfileSection>
        {!!isLoggedIn && (
          <ProfileSection>
            <SignOutRow
              title={t`Déconnexion`}
              {...accessibilityAndTestId(t`Déconnexion`)}
              onPress={signOut}
              type="clickable"
              icon={SignOut}
            />
          </ProfileSection>
        )}
        <ProfileSection>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCaption>{t`Version` + `\u00a0${Package.version}`}</StyledCaption>
          <Spacer.Column numberOfSpaces={4} />
          <LogoMinistereContainer>
            <LogoMinistere />
          </LogoMinistereContainer>
          <Spacer.Column numberOfSpaces={4} />
        </ProfileSection>
        <Spacer.TabBar />
      </ProfileContainer>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: getSpacing(2),
  },
  row: {
    paddingVertical: getSpacing(4),
  },
})

const ProfileSection = styled(Section).attrs({
  style: styles.section,
})``

const Row = styled(SectionRow).attrs({
  style: styles.row,
  iconSize: SECTION_ROW_ICON_SIZE,
})``

const SignOutRow = styled(Row)({
  marginTop: getSpacing(2),
})

const LogoMinistereContainer = styled.View({
  width: getSpacing(40),
  height: getSpacing(28),
})

const NetworkRow = styled.View({
  width: '100%',
  margin: 'auto',
  maxWidth: getSpacing(125),
})

const NetworkRowContainer = styled.View({
  flexDirection: 'row',
  paddingVertical: getSpacing(4),
  justifyContent: 'space-between',
})

const FilterSwitchLabelContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledCaption = styled(Typo.Caption)(({ theme, color }) => ({
  color: color ?? theme.colors.greyDark,
}))
