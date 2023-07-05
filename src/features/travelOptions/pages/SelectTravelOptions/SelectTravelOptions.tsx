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
  const [currentAddress, setCurrentAddress] = useState();
  const [destAddress, setdestAddress] = useState();

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        if (permissionState === GeolocPermissionState.GRANTED) {
          setCurrentLocation(position)
          console.error('current location:', position)
          if (position) {
            const { latitude, longitude } = position
            getAddressFromCoordinates(latitude, longitude);
            let lat = 48.896599;
            let lon = 2.401700;
            getDestAddressFromCoordinates(lat, lon);
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
  }, [permissionState, showGeolocPermissionModal])

  function getAddressFromCoordinates(latitude, longitude) {
    const apiKey = 'AIzaSyCFIR5ETG_Zfnx5dBpLke4ZD6WLvrZvEmk';
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    fetch(geocodeApiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setCurrentAddress(address);
          console.log('Current Address:', address);
        } else {
          console.log('No address found for the given coordinates.');
        }
      })
      .catch(error => {
        console.log('Error getting address:', error);
      });
  }


  function getDestAddressFromCoordinates(latitude, longitude) {
    const apiKey = 'AIzaSyCFIR5ETG_Zfnx5dBpLke4ZD6WLvrZvEmk';
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    fetch(geocodeApiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setdestAddress(address);
          console.log('Current Address:', address);
        } else {
          console.log('No address found for the given coordinates.');
        }
      })
      .catch(error => {
        console.log('Error getting address:', error);
      });
  }

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



  const processPayload2 = {
    requestId: '6bdee986-f106-4884-ba9a-99c478d78c22',
    service: 'in.yatri.consumer',
    payload: {
      clientId: 'passcultureconsumer',
      merchantId: 'passcultureconsumer',
      action: 'process',
      service: 'in.yatri.consumer',
      environment: 'master',
      signatureAuthData: {
        signature: '',
        authData: '',
      },
      search_type: 'direct_search',
      source: {
        lat: currentLocation?.latitude,
        lon: currentLocation?.longitude,
        name: currentAddress,
      },
      destination: {
        lat: 48.8606,
        lon: 2.3376,
        name: destAddress
      },
    }
  }


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

        case 'trip_status':
          const processPayload = data.payload || {}
          console.log('process_result: ', processPayload)
          // Handle process result
          if (processPayload?.action === 'terminate' && processPayload?.screen === 'home_screen') {
            HyperSdkReact.terminate()
            console.log('process_call: is called ', processPayload)
          } else if (processPayload?.status === 'TRIP_FINISHED') {
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