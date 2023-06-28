import React, { useState, useEffect } from 'react'
import { View, Linking } from 'react-native'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ColorsEnum } from 'ui/theme/colors'

interface Location {
  latitude: number
  longitude: number
}

export const SelectTravelOptions = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>({
    latitude: 48.8566,
    longitude: 2.3522,
  })
  // const {
  //   userPosition: position,
  //   requestGeolocPermission,
  //   showGeolocPermissionModal,
  //   permissionState,
  // } = useGeolocation()
  const { goBack } = useNavigation<UseNavigationType>()
  const [modalVisible, setModalVisible] = useState(true)
  // setCurrentLocation(position || { latitude: 48.8566, longitude: 2.3522 })
  // useEffect(() => {
  //   const fetchCurrentLocation = async () => {
  //     try {
  //        if (permissionState === GeolocPermissionState.GRANTED) {
  //         // setCurrentLocation(position || { latitude: 48.8566, longitude: 2.3522 })
  //       }
  //       // else {
  //       //   showGeolocPermissionModal()
  //       // }
  //     } catch (error) {
  //       console.error('Error getting current location:', error)
  //     }
  //   }

  //   fetchCurrentLocation()
  // }, [position, requestGeolocPermission])

  return (
    <View style={{ flex: 1 }}>
      <PageHeaderSecondary
        onGoBack={goBack}
        title=""
        backIconColor={ColorsEnum.BLACK}
        backgroundColor={ColorsEnum.WHITE}
      />
      {currentLocation && <MapComponent currentLocation={currentLocation} />}
      {modalVisible && (
        <TravelListModal
          visible={modalVisible}
          toggleModal={(value: boolean) => setModalVisible(value)}
        />
      )}
    </View>
  )
}
