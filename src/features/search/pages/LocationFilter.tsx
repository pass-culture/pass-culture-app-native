import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useRef } from 'react'
import { ScrollView, ViewStyle, Linking, TouchableOpacity, Text } from 'react-native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useAppStateChange } from 'features/offer/pages/useAppStateChange'
import { LocationType } from 'libs/algolia'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { _ } from 'libs/i18n'
import { Banner, BannerType } from 'ui/components/Banner'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { AppInformationModal } from 'ui/components/modals/AppInformationModal'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/theme'

import { LocationChoice } from '../components/LocationChoice'

import { useSearch } from './SearchWrapper'

const DEBOUNCED_CALLBACK = 500

export const LocationFilter: React.FC = () => {
  const { navigate, goBack } = useNavigation<UseNavigationType>()
  const {
    position,
    permissionState,
    requestGeolocPermission,
    checkGeolocPermission,
  } = useGeolocation()
  const { dispatch } = useSearch()
  const debouncedGoBack = useRef(debounce(goBack, DEBOUNCED_CALLBACK)).current
  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  const onAppBecomeActive = async () => {
    await checkGeolocPermission()
  }
  const onAppBecomeInactive = async () => {
    // nothing
  }

  useAppStateChange(onAppBecomeActive, onAppBecomeInactive)

  const onPressPickPlace = () => {
    if (debouncedGoBack) debouncedGoBack.cancel()
    navigate('LocationPicker')
  }

  const onPressAroundMe = async () => {
    if (position === null) {
      if (permissionState === GeolocPermissionState.NEVER_ASK_AGAIN) {
        showGeolocPermissionModal()
      } else {
        await requestGeolocPermission()
        debouncedGoBack()
      }
    } else {
      dispatch({
        type: 'LOCATION_AROUND_ME',
        payload: { latitude: position.latitude, longitude: position.longitude },
      })
      debouncedGoBack()
    }
  }

  const onPressEverywhere = () => {
    dispatch({ type: 'LOCATION_EVERYWHERE' })
    debouncedGoBack()
  }

  const onPressGeolocPermissionModalButton = () => {
    Linking.openSettings()
    hideGeolocPermissionModal()
    debouncedGoBack()
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <ScrollView contentContainerStyle={contentContainerStyle}>
        <Spacer.Column numberOfSpaces={14} />
        <Spacer.Column numberOfSpaces={6} />
        <Banner
          title={_(
            t`Seules les sorties et offres physiques seront affichées pour une recherche avec une localisation`
          )}
          type={BannerType.INFO}
        />
        <Spacer.Column numberOfSpaces={6} />
        <LocationChoice
          testID="pickPlace"
          locationType={LocationType.PLACE}
          arrowNext={true}
          onPress={onPressPickPlace}
        />
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="aroundMe"
          locationType={LocationType.AROUND_ME}
          onPress={onPressAroundMe}
        />
        <Spacer.Column numberOfSpaces={4} />
        <LocationChoice
          testID="everywhere"
          locationType={LocationType.EVERYWHERE}
          onPress={onPressEverywhere}
        />
      </ScrollView>

      <PageHeader title={_(t`Localisation`)} />
      <AppInformationModal
        title="Geoloc"
        visible={isGeolocPermissionModalVisible}
        onCloseIconPress={hideGeolocPermissionModal}
        testIdSuffix="geoloc-permission-modal">
        <React.Fragment>
          <Text>Je suis la modale</Text>
          <TouchableOpacity onPress={onPressGeolocPermissionModalButton}>
            <Text>Ouvrir settings</Text>
          </TouchableOpacity>
        </React.Fragment>
      </AppInformationModal>
    </React.Fragment>
  )
}

const contentContainerStyle: ViewStyle = { flexGrow: 1 }
