import React, { useState, useEffect } from 'react'
import {
  View,
  Linking,
  NativeModules,
  NativeEventEmitter,
  BackHandler,
  ActivityIndicator,
} from 'react-native'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import HyperSdkReact from 'hyper-sdk-react'
import { env } from 'libs/environment'
import { api } from 'api/api'
import { ColorsEnum } from 'ui/theme/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Location {
  latitude: number
  longitude: number
}

const { HyperSDKModule } = NativeModules

export const SelectTravelOptions = ({ navigation, route }: any) => {
  const { domainsCredit } = api.getnativev1me()
  console.log('test username', api.getnativev1me())
  const [mobileNumber, setMobileNumber] = useState()
  const mobileCountryCode = '+91'
  const merchantId = 'MOBILITY_PASSCULTURE'

  const { bookingId } = route.params
  console.log('bookingId ----> ', bookingId)
  // console.log("test booking id", route)

  const storeReservation = async (reservation) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations');
      let reservations = [];

      if (reservationsJSON !== null) {
        reservations = JSON.parse(reservationsJSON);
      }

      reservations.push(reservation);

      const updatedReservationsJSON = JSON.stringify(reservations);
      await AsyncStorage.setItem('reservations', updatedReservationsJSON);

      console.log('Reservation stored successfully.', updatedReservationsJSON);
    } catch (error) {
      console.log('Error storing reservation:', error);
    }
  };

  const updateReservation = async (reservationId, tripId, tripAmount) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations');
      let reservations = [];

      if (reservationsJSON !== null) {
        reservations = JSON.parse(reservationsJSON);

        // Find the reservation with the matching reservation ID
        const foundIndex = reservations.findIndex(
          (reservation) => reservation.reservationid === reservationId
        );

        if (foundIndex !== -1) {
          // Update the tripid and tripamount properties
          reservations[foundIndex].tripid = tripId;
          reservations[foundIndex].tripamount = tripAmount;

          const updatedReservationsJSON = JSON.stringify(reservations);
          await AsyncStorage.setItem('reservations', updatedReservationsJSON);

          console.log('Reservation updated successfully.');
        } else {
          console.log('Reservation not found.');
        }
      } else {
        console.log('No reservations found.');
      }
    } catch (error) {
      console.log('Error updating reservation:', error);
    }
  };

  const getReservationsByCommonKey = async (commonKey) => {
    try {
      const reservationsJSON = await AsyncStorage.getItem('reservations');

      if (reservationsJSON !== null) {
        const reservations = JSON.parse(reservationsJSON);
        const filteredReservations = reservations.filter(
          (reservation) => reservation.commonKey === commonKey
        );

        console.log('Retrieved reservations:', filteredReservations);
        return filteredReservations;
      } else {
        console.log('No reservations found.');
      }
    } catch (error) {
      console.log('Error updating reservation:', error);
    }
  };




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
          console.error('current location:', position)
          if (position) {
            const { latitude, longitude } = position
            console.error('current location:', position)
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude || 48.8566
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

  async function getLatLngFromAddress(address) {
    const apiKey = 'AIzaSyCFIR5ETG_Zfnx5dBpLke4ZD6WLvrZvEmk'
    const encodedAddress = encodeURIComponent(address)
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`

    try {
      const response = await fetch(geocodingUrl)
      const data = await response.json()

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        return { latitude: lat, longitude: lng }
      }
    } catch (error) {
      console.error('Error geocoding address:', error)
    }

    return null
  }

  // Example usage:
  // const address = '15 Rue de la Coquille, Béziers';
  // getLatLngFromAddress(address).then((coordinates) => {
  //   if (coordinates) {
  //     const { latitude, longitude } = coordinates;
  //     console.log('Latitude:', latitude);
  //     console.log('Longitude:', longitude);
  //   } else {
  //     console.log('Failed to get coordinates for the address.');
  //   }
  // });

  const processPayload2 = {
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'initiate',
      service: 'in.yatri.consumer',
      environment: 'master',
      signatureAuthData: {
        signature: '',
        authData: '',
      },
      destination: {
        lat: 48.8606,
        lon: 2.3376,
        name: 'Louvre Museum Paris ',
      },
      "destination": {
        "lat": 48.8398,
        "lon": 2.3188,
        "name": "jardin atlantique"
      }
    }
  }

  // getReservationsByCommonKey(mobileNumber);


  const [showLoader, setShowLoader] = useState(false)

  const handleClick = () => {
    setShowLoader(true);
    if (HyperSdkReact.isNull()) {
      HyperSdkReact.createHyperServices();
    }

    HyperSdkReact.initiate(initiatePayload);
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init);
    });

  }

  const [signatureResponse, setSignatureResponse] = useState(null); // State to store the signature response

  useEffect(() => {
    const fetchSignatureResponse = async () => {
      const { firstName } = (await api.getnativev1me()) || 'user'
      const { phoneNumber } = (await api.getnativev1me()) || '+918297921333'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)
      console.log("test username1", mobile, firstName)
      setMobileNumber(mobile);
      try {
        const result = await HyperSDKModule.dynamicSign(firstName, mobile, mobileCountryCode)
        setSignatureResponse(result)
        console.log('signauth check', result)
      } catch (error) {
        console.error(error);
      }
    };

    fetchSignatureResponse();
  }, []);


  useEffect(() => {
    const processPayload2Copy = { ...processPayload2 } // Create a copy of the processPayload2 object

    if (signatureResponse) {
      processPayload2Copy.payload.signatureAuthData.signature = signatureResponse.signature;
      processPayload2Copy.payload.signatureAuthData.authData = signatureResponse.signatureAuthData;

    }
    console.log('Updated processPayload2:', processPayload2Copy);
    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact)
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp);
      const event = data.event || '';
      console.log('event_call: is called ', event);
      switch (event) {
        case 'show_loader':
          // show some loader here
          break;

        case 'hide_loader':
          // hide the loader
          setTimeout(() => {
            setShowLoader(false)
            setModalVisible(false);
          }, 3000)
          break;

        case 'initiate_result':
          const payload = data.payload || {};
          const res = payload ? payload.status : payload;
          console.log('initiate_result: ', processPayload2);
          if (res === 'SUCCESS') {
            console.log('checkbookinfID', bookingId)
            const reservation1 = {
              reservationid: bookingId,
              tripid: '',
              tripamount: '',
              source: processPayload2.payload.source,
              destination: processPayload2.payload.destination,
              tripdate: new Date(),
              commonKey: mobileNumber,
            }
            storeReservation(reservation1)
            // Initiation is successful, call process method
            if (processPayload2.payload.signatureAuthData != undefined) {
              HyperSdkReact.process(JSON.stringify(processPayload2));
            } else {
              alert('Invalid signature');
            }
            // HyperSdkReact.process(JSON.stringify(processPayload2));
            console.log('process_call: is called ', payload);
          } else {
            // Handle initiation failure
            setModalVisible(true)
            console.log('Initiation failed.');
          }
          break
          break

        case 'process_result':
          const processPayload = data.payload || {}
          console.log('process_result: ', processPayload)
          // Handle process result
          if (processPayload?.action === 'terminate' && processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate()
            console.log('process_call: is called ', processPayload)
          } else if (processPayload?.action === 'trip_completed') {
            //function call for wallet transaction

            updateReservation(bookingId, processPayload?.trip_id, processPayload?.trip_amount);
            console.log('process_call: wallet transaction ', processPayload)
            // HyperSdkReact.terminate();
          } else if (processPayload?.action === 'feedback_submitted' || processPayload?.action === 'home_screen') {

            console.log('process_call: wallet transaction ', processPayload);
            HyperSdkReact.terminate();
            setModalVisible(true)
          }

          if (processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate()
            setModalVisible(true)
          } else if (processPayload?.screen === 'trip_started_screen') {
            BackHandler.exitApp();
          }
          console.log('process_call: process ', processPayload)

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
  }, [signatureResponse])

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
          showLoader={showLoader}
          onProceed={() => handleClick()}
          toggleModal={(value: boolean) => goBack()}
        />
      )}
    </View>
  )
}