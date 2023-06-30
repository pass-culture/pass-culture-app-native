import React, { useState, useEffect } from 'react'
import { View, Linking, NativeModules, NativeEventEmitter, BackHandler, ActivityIndicator } from 'react-native'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'
import { GeolocPermissionState, useGeolocation } from 'libs/geolocation'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { ColorsEnum } from 'ui/theme/colors'
import HyperSdkReact from 'hyper-sdk-react'
HyperSdkReact.createHyperServices()
interface Location {
  latitude: number
  longitude: number
}

const { HyperSDKModule } = NativeModules;


export const SelectTravelOptions = () => {


  const mobileNumber = "8008210472";
  const mobileCountryCode = "+91";
  const merchantId = "MOBILITY_PASSCULTURE";
  const timestamp = "2023-04-13T07:28:40+00:00";
  const userName = "Rajesh";

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
        "name": "Horamavu agara"
      },
      "destination": {
        "lat": 13.0335,
        "lon": 77.6739,
        "name": "Kalkere"
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
    setModalVisible(false)
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
      try {
        const result = await HyperSDKModule.dynamicSign(userName, mobileNumber, mobileCountryCode);
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
            // BackHandler.exitApp();
          } else if (processPayload?.action === 'trip_completed') {
            //function call for wallet transaction
            console.log('process_call: wallet transaction ', processPayload);
            HyperSdkReact.terminate();
          }

          break;

        default:
          console.log('Unknown Event', data);
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
        onGoBack={handleClick}
        title=""
        backIconColor={ColorsEnum.BLACK}
        backgroundColor={ColorsEnum.WHITE}
      />
      {/* {currentLocation && <MapComponent currentLocation={currentLocation} />} */}
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
