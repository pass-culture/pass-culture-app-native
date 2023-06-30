import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import HyperSdkReact from 'hyper-sdk-react'
import { env } from 'libs/environment'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import React, { useEffect, useState } from 'react'
import { BackHandler, NativeEventEmitter, NativeModules, View } from 'react-native'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { ColorsEnum } from 'ui/theme/colors'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'

HyperSdkReact.createHyperServices()

interface Location {
  latitude: number
  longitude: number
}

export const SelectTravelOptions = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>({
    latitude: 48.8566,
    longitude: 2.3522,
  })
  const { userPosition: position, showGeolocPermissionModal, permissionState } = useGeolocation()
  const { goBack } = useNavigation<UseNavigationType>()
  const [modalVisible, setModalVisible] = useState(true)
  const [mapUrl, setMapUrl] = useState('')

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        if (permissionState === GeolocPermissionState.GRANTED) {
          setCurrentLocation(position)

          if (position) {
            const { latitude, longitude } = position
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${
              latitude || 48.8566
            },${longitude || 2.3522}&format=png&zoom=12&size=640x640&key=${env.GOOGLE_MAP_API_KEY}`
            setMapUrl(mapUrl)
          }
        } else {
          showGeolocPermissionModal()
        }
      } catch (error) {
        console.error('Error getting current location:', error)
      }
    }
    fetchCurrentLocation()
  }, [position, permissionState, showGeolocPermissionModal])

  const initiatePayload = JSON.stringify({
    // Replace with your initiate payload
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      environment: 'master',
      service: 'in.yatri.consumer',
    },
  })
  const processPayload2 = JSON.stringify({
    // Replace with your process payload
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      service: 'in.yatri.consumer',
      environment: 'master',
      signatureAuthData: {
        signature:
          'nXVl9/UH67bd4UTUJfkns54F7FDRTk0igFjRuJN5RCl8rEZNTnlwJwWaSWEnI4kVsizKqK03+hv7KowJduV2dJNToa4jEq+q+lWhVx4hW9zWllX7qVzu94WWXyrJV/zBod/XmrGqEaNgM2BxFsSHsqbKGcKkATbmf1hO9BHHkr0Fia+p1vPyf7rW7l2SDXQq0Ywcx5d9CtO6S74N+rAS0ntXLmjIsuHncQFG2JfRg0g/aBGxeDq02rtjcUVxe1nVj9nPi/xG6n5tvVQLnNyHEf58nPb2/aYIyl9xC8h7Nm/UnONLJwzBlTumMn+knG7r0wBm1iRP+QIL29ZOaceXgg==',
        authData:
          '{"mobileNumber":"9493143166","mobileCountryCode":"+91","merchantId":"MOBILITY_PASSCULTURE","timestamp":"2023-04-13T07:28:40+00:00"}',
      },
    },
  })

  const handleClick = () => {
    HyperSdkReact.initiate(initiatePayload)
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init)
    })
    // setTimeout(() => {
    // }, 5000)
  }

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact)
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp)
      const event = data.event || ''
      switch (event) {
        case 'show_loader':
          // show some loader here
          break
        case 'hide_loader':
          // hide the loader
          break
        case 'initiate_result':
          const payload = data.payload || {}
          const res = payload ? payload.status : payload
          console.log('initiate_result: ', payload)
          if (res === 'SUCCESS') {
            // Initiation is successful, call process method
            HyperSdkReact.process(processPayload2)
            setModalVisible(false)

            console.log('process_call: is called ', payload)
          } else {
            // Handle initiation failure
            setModalVisible(true)
            console.log('Initiation failed.')
          }
          break
        case 'process_result':
          const processPayload = data.payload || {}
          console.log('process_result: ', processPayload)
          // Handle process result
          if (processPayload?.action === 'terminate') {
            HyperSdkReact.terminate()
            console.log('process_call: is called ', processPayload)
            setModalVisible(true)
          }
          break
        default:
          console.log('Unknown Event', data)
      }
    })
    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed()
    })
    return () => {
      eventListener.remove()
      BackHandler.removeEventListener('hardwareBackPress', () => null)
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <PageHeaderSecondary
        onGoBack={goBack}
        title=""
        backIconColor={ColorsEnum.BLACK}
        backgroundColor={ColorsEnum.WHITE}
      />
      {currentLocation && <MapComponent mapUrl={mapUrl} />}
      {modalVisible && (
        <TravelListModal
          visible={modalVisible}
          onProceed={() => handleClick()}
          toggleModal={(value: boolean) => goBack()}
        />
      )}
    </View>
  )
}
