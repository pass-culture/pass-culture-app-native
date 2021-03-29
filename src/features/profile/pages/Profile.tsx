import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Linking, NativeScrollEvent, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'

import { useAuthContext, useLogoutRoutine } from 'features/auth/AuthContext'
import { useFavoritesState } from 'features/favorites/pages/FavoritesWrapper'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useFunctionOnce } from 'features/offer/services/useFunctionOnce'
import { analytics } from 'libs/analytics'
import { isCloseToBottom } from 'libs/analytics.utils'
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import FilterSwitch from 'ui/components/FilterSwitch'
import { useModal } from 'ui/components/modals/useModal'
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
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'
import { TAB_BAR_COMP_HEIGHT } from 'ui/theme/constants'

import Package from '../../../../package.json'
import { ProfileHeader } from '../components/ProfileHeader'
import { ProfileContainer } from '../components/reusables'

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const Profile: React.FC = () => {
  const { dispatch: favoritesDispatch } = useFavoritesState()
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()
  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()
  const scrollViewRef = useRef<ScrollView | null>(null)

  const {
    position,
    permissionState,
    requestGeolocPermission,
    triggerPositionUpdate,
  } = useGeolocation()
  const [isGeolocSwitchActive, setIsGeolocSwitchActive] = useState<boolean>(false)

  useEffect(() => {
    setIsGeolocSwitchActive(position !== null)
  }, [position])

  function disableGeolocation() {
    storage.saveObject('has_allowed_geolocation', false).then(() => {
      favoritesDispatch({ type: 'SET_FILTER', payload: 'RECENTLY_ADDED' })
      triggerPositionUpdate()
    })
  }

  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  const switchGeolocation = useCallback(async () => {
    if (isGeolocSwitchActive) {
      disableGeolocation()
    } else {
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
      } else {
        await requestGeolocPermission()
      }
    }
  }, [isGeolocSwitchActive, permissionState])

  const debouncedLogLocationToggle = useCallback(
    debounce(analytics.logLocationToggle, DEBOUNCE_TOGGLE_DELAY_MS),
    []
  )

  function onPressGeolocPermissionModalButton() {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }

  useEffect(() => {
    if (!isLoggedIn) {
      if (scrollViewRef && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
      }
    }
  }, [isLoggedIn])
  const logProfilScrolledToBottom = useFunctionOnce(analytics.logProfilScrolledToBottom)

  function onScroll({ nativeEvent }: { nativeEvent: NativeScrollEvent }) {
    if (isCloseToBottom(nativeEvent)) {
      logProfilScrolledToBottom()
    }
  }

  return (
    <ScrollView bounces={false} ref={scrollViewRef} onScroll={onScroll} testID="profile-scrollview">
      <ProfileHeader user={user} />
      <ProfileContainer>
        <Spacer.Column numberOfSpaces={getSpacing(1)} />
        <ProfileSection
          title={isLoggedIn ? _(t`Paramètres du compte`) : _(t`Paramètres de l'application`)}>
          {isLoggedIn && (
            <React.Fragment>
              <Row
                title={_(t`Informations personnelles`)}
                type="navigable"
                onPress={() => navigate('PersonalData')}
                icon={ProfileIcon}
                style={styles.row}
                testID="row-personal-data"
              />
              <Row
                title={_(t`Mot de passe`)}
                type="navigable"
                onPress={() => navigate('ChangePassword')}
                icon={Lock}
                style={styles.row}
                testID="row-password"
              />
            </React.Fragment>
          )}
          <SectionRow
            type="navigable"
            title={_(t`Notifications`)}
            icon={Bell}
            onPress={() => navigate('NotificationSettings')}
            style={styles.row}
            testID="row-notifications"
          />
          <SectionRow
            type="clickable"
            title={_(t`Géolocalisation`)}
            icon={LocationPointerNotFilled}
            style={styles.row}
            cta={
              <FilterSwitch
                active={isGeolocSwitchActive}
                toggle={() => {
                  switchGeolocation()
                  debouncedLogLocationToggle(!isGeolocSwitchActive)
                }}
                testID="geolocation"
              />
            }
            testID="row-geolocation"
          />
        </ProfileSection>
        <ProfileSection title={_(t`Aides`)}>
          <Row
            title={_(t`Comment ça marche ?`)}
            type="navigable"
            onPress={() => navigate('FirstTutorial')}
            icon={LifeBuoy}
            style={styles.row}
            testID="row-how-it-works"
          />
          <Row
            title={_(t`Questions fréquentes`)}
            type="clickable"
            onPress={() => openExternalUrl(env.FAQ_LINK)}
            icon={ExternalSite}
            style={styles.row}
            testID="row-faq"
          />
        </ProfileSection>
        <ProfileSection title={_(t`Autres`)}>
          <Row
            title={_(t`Accessibilité`)}
            type="clickable"
            onPress={() => openExternalUrl(env.ACCESSIBILITY_LINK)}
            icon={ExternalSite}
            style={styles.row}
            testID="row-accessibility"
          />
          <Row
            title={_(t`Mentions légales`)}
            type="navigable"
            onPress={() => navigate('LegalNotices')}
            icon={LegalNotices}
            style={styles.row}
            testID="row-legal-notices"
          />
          <Row
            title={_(t`Confidentialité`)}
            type="navigable"
            onPress={() => navigate('ConsentSettings')}
            icon={Confidentiality}
            style={styles.row}
            testID="row-confidentiality"
          />
        </ProfileSection>
        <ProfileSection title={_(t`Suivre pass Culture`)}>
          <NetworkRow>
            <NetworkRowContainer>
              <SocialNetworkCard network="instagram" />
              <SocialNetworkCard network="twitter" />
              <SocialNetworkCard network="snapchat" />
              <SocialNetworkCard network="facebook" />
            </NetworkRowContainer>
          </NetworkRow>
        </ProfileSection>
        {isLoggedIn && (
          <ProfileSection>
            <SectionRow
              title={_(t`Déconnexion`)}
              onPress={() => {
                analytics.logLogout()
                signOut()
              }}
              type="clickable"
              icon={SignOut}
              testID="row-signout"
              style={styles.logoutRow}
            />
          </ProfileSection>
        )}
        <ProfileSection>
          <Spacer.Column numberOfSpaces={4} />
          <Version>{_(t`Version ${Package.version}`)}</Version>
          <Spacer.Column numberOfSpaces={4} />
          <LogoMinistere />
          <Spacer.Column numberOfSpaces={4} />
        </ProfileSection>
      </ProfileContainer>
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
      <BottomSpacing />
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
  logoutRow: {
    marginTop: getSpacing(2),
  },
})

const ProfileSection = styled(Section).attrs({
  style: styles.section,
})``

const Row = styled(SectionRow).attrs({
  style: styles.row,
})``

const BottomSpacing = styled.View({
  paddingBottom: TAB_BAR_COMP_HEIGHT + getSpacing(2),
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

const Version = styled.Text({
  fontFamily: 'Montserrat-Medium',
  fontSize: 12,
  lineHeight: '16px',
  color: ColorsEnum.GREY_DARK,
})
