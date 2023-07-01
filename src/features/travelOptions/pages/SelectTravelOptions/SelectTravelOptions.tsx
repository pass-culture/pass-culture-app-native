import React, { useState, useEffect } from 'react'
import { View, Linking, NativeModules, NativeEventEmitter, BackHandler, ActivityIndicator } from 'react-native'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import HyperSdkReact from 'hyper-sdk-react'
import { api } from 'api/api'
import { ColorsEnum } from 'ui/theme/colors'

import { env } from 'libs/environment'

HyperSdkReact.createHyperServices()

interface Location {
  latitude: number
  longitude: number
}

const { HyperSDKModule } = NativeModules;


export const SelectTravelOptions = ({ navigation }) => {

  const { domainsCredit } = api.getnativev1me()
  console.log("test username", api.getnativev1me())
  const mobileNumber = "8297921333";
  const mobileCountryCode = "+91";
  const merchantId = "MOBILITY_PASSCULTURE";
  const timestamp = "2023-04-13T07:28:40+00:00";
  const userName = "Rajesh";

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
  const processPayload2 = {

    "requestId": "6bdee986-f106-4884-ba9a-99c478d78c22",
    "service": 'in.yatri.consumer',
    "payload": {
      "clientId": 'passcultureconsumer',
      "merchantId": 'passcultureconsumer',
      "action": 'initiate',
      "service": 'in.yatri.consumer',
      "environment": 'master',
      "signatureAuthData": {
        "signature": '',
        "authData": '',
      },
      "search_type": "direct_search",
      "source": {
        "lat": currentLocation?.latitude,
        "lon": currentLocation?.longitude,
        "name": "Paris, France"
      },
      "destination": {
        "lat": 48.8606,
        "lon": 2.3376,
        "name": "louvre museum 75001 paris france"
      }
    }
  }


  // const handleClick = () => {
  //   setModalVisible(false)
  //   HyperSdkReact.initiate(initiatePayload)
  //   HyperSdkReact.isInitialised().then((init) => {
  //     console.log('isInitialised:', init)
  //   })
  // }
  const [loader, setLoader] = useState(false);
  const handleClick = () => {
    setLoader(true);
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
      const { firstName } = await api.getnativev1me() || 'user'
      const { phoneNumber } = (await api.getnativev1me()) || '+919493143166'
      let mobile = phoneNumber?.slice(3, phoneNumber.length)
      console.log("test username1", mobile, firstName)

      try {
        const result = await HyperSDKModule.dynamicSign(firstName, '8008210472', mobileCountryCode);
        setSignatureResponse(result);
        console.log("signauth check", result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSignatureResponse();
  }, []);


  useEffect(() => {

    const processPayload2Copy = { ...processPayload2 }; // Create a copy of the processPayload2 object

    if (signatureResponse) {
      processPayload2Copy.payload.signatureAuthData.signature = signatureResponse.signature;
      processPayload2Copy.payload.signatureAuthData.authData = signatureResponse.signatureAuthData;

    }
    console.log('Updated processPayload2:', processPayload2Copy);


    const eventEmitter = new NativeEventEmitter(NativeModules.HyperSdkReact);
    const eventListener = eventEmitter.addListener('HyperEvent', (resp) => {
      const data = JSON.parse(resp);
      const event = data.event || '';
      console.log('event_call: is called ', event);
      console.log('data_call: is called ', data);
      switch (event) {
        case 'show_loader':
          // show some loader here
          setLoader(true);
          <ActivityIndicator />
          break;

        case 'hide_loader':
          // hide the loader
          setLoader(false);
          break;

        case 'initiate_result':
          const payload = data.payload || {};
          const res = payload ? payload.status : payload;
          console.log('initiate_result: ', processPayload2);
          if (res === 'SUCCESS') {
            setModalVisible(false)
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
          break;

        case 'process_result':
          const processPayload = data.payload || {};
          console.log('process_result: ', processPayload);
          // Handle process result
          if (processPayload?.action === 'terminate') {
            HyperSdkReact.terminate();
            console.log('process_call: is called ', processPayload);
            setModalVisible(true)
            // BackHandler.exitApp();
          } else if (processPayload?.action === 'feedback_submitted' || processPayload?.action === 'feedback_skipped') {

            console.log('process_call: wallet transaction ', processPayload);
            HyperSdkReact.terminate();
            setModalVisible(true)
          }

          break;

        default:
          console.log('Unknown Event', data);

      }
      const screen = data.screen || '';
      switch (screen) {
        case 'home_screen':
          // Handle home screen
          break;

        case 'estimate_screen':
          // Handle estimate screen
          break;

        case 'finding_driver_loader':
          // Handle finding driver loader screen
          break;

        case 'confirm_ride_loader':
          // Handle confirm ride loader screen
          break;

        // Handle other screens...

        default:
          console.log('Unknown Screen', screen);
      }
    });

    BackHandler.addEventListener('hardwareBackPress', () => {
      return !HyperSdkReact.isNull() && HyperSdkReact.onBackPressed();
    });

    return () => {

      eventListener.remove();
      BackHandler.removeEventListener('hardwareBackPress', () => null);
    };
  }, [signatureResponse]);

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
          toggleModal={(value: boolean) => setModalVisible(value)}
        />
      )}
    </View>
  )
}
