import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useMemo, useEffect, useState } from 'react'
import { Platform, Button, NativeModules, NativeEventEmitter, BackHandler } from 'react-native'
import styled from 'styled-components/native'
import { BannerName } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeBanner } from 'features/home/api/useHomeBanner'
import { ActivationBanner } from 'features/home/components/banners/ActivationBanner'
import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { env } from 'libs/environment'
import { useGeolocation, GeolocPermissionState } from 'libs/geolocation'
import { formatToFrenchDecimal } from 'libs/parsers'
import { useAvailableCredit } from 'shared/user/useAvailableCredit'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'
import { api } from 'api/api'
import HyperSdkReact from 'hyper-sdk-react';

const { HyperSDKModule } = NativeModules
// const pemContents = require('../../../../../android/app/src/main/res/raw/private_key.pem');


export const HomeHeader: FunctionComponent = function () {

  const navigation = useNavigation<UseNavigationType>()
  const availableCredit = useAvailableCredit()
  const { top } = useCustomSafeInsets()
  const { isLoggedIn, user } = useAuthContext()

  const { permissionState } = useGeolocation()
  const isGeolocated = permissionState === GeolocPermissionState.GRANTED
  const { data } = useHomeBanner(isGeolocated)
  const homeBanner = data?.banner

  const initiatePayload = JSON.stringify({
    // Replace with your initiate payload
    "requestId": "6bdee986-f106-4884-ba9a-99c478d78c22",
    "service": 'in.yatri.consumer',
    "payload": {
      "clientId": 'passcultureconsumer',
      "merchantId": 'passcultureconsumer',
      "action": 'initiate',
      "environment": 'master',
      "service": 'in.yatri.consumer'
    }
  });

  // const processPayload2 = JSON.stringify({
  //   // Replace with your process payload
  //   "requestId": "6bdee986-f106-4884-ba9a-99c478d78c22",
  //   "service": 'in.yatri.consumer',
  //   "payload": {
  //     "clientId": 'passcultureconsumer',
  //     "merchantId": 'passcultureconsumer',
  //     "action": 'initiate',
  //     "service": 'in.yatri.consumer',
  //     "environment": 'master',
  //     "signatureAuthData": {
  //       "signature": "nXVl9\/UH67bd4UTUJfkns54F7FDRTk0igFjRuJN5RCl8rEZNTnlwJwWaSWEnI4kVsizKqK03+hv7KowJduV2dJNToa4jEq+q+lWhVx4hW9zWllX7qVzu94WWXyrJV\/zBod\/XmrGqEaNgM2BxFsSHsqbKGcKkATbmf1hO9BHHkr0Fia+p1vPyf7rW7l2SDXQq0Ywcx5d9CtO6S74N+rAS0ntXLmjIsuHncQFG2JfRg0g\/aBGxeDq02rtjcUVxe1nVj9nPi\/xG6n5tvVQLnNyHEf58nPb2\/aYIyl9xC8h7Nm\/UnONLJwzBlTumMn+knG7r0wBm1iRP+QIL29ZOaceXgg==",
  //       "authData": "{ \"mobileNumber\":\"9493143166\",\"mobileCountryCode\":\"+91\",\"merchantId\":\"MOBILITY_PASSCULTURE\",\"timestamp\":\"2023-04-13T07:28:40+00:00\"}"
  //     }
  //   }
  // });

  const mobileNumber = "8297921333";
  const mobileCountryCode = "+91";
  const merchantId = "MOBILITY_PASSCULTURE";
  const timestamp = "2023-04-13T07:28:40+00:00";
  const userName = "Rajesh";


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
      "payment_method": "wallet",
      "search_type": "direct_search",
      "source": {
        "lat": 13.0411,
        "lon": 77.6622,
        "name": "Horamavu agara"
      },
      "destination": {
        "lat": 13.0335,
        "lon": 77.6739,
        "name": "Kalkere"
      }
    }
  }


  const [signatureResponse, setSignatureResponse] = useState(null); // State to store the signature response

  useEffect(() => {

    const fetchSignatureResponse = async () => {
      // const { phoneNumber, firstName } = await api.getnativev1me()
      const { firstName } = await api.getnativev1me()
      const { phoneNumber } = await api.getnativev1me()
      let mobile = phoneNumber?.slice(3, phoneNumber.length)
      console.log("test username1", mobile, firstName)
      try {
        const result = await HyperSDKModule.dynamicSign(userName, mobile, mobileCountryCode);
        setSignatureResponse(result);
        console.log("signauth check", result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSignatureResponse();
  }, []);

  const handleClick = () => {
    if (HyperSdkReact.isNull()) {
      HyperSdkReact.createHyperServices();
    }

    HyperSdkReact.initiate(initiatePayload);
    HyperSdkReact.isInitialised().then((init) => {
      console.log('isInitialised:', init);
    });
  }
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
      switch (event) {
        case 'show_loader':
          // show some loader here
          break;

        case 'hide_loader':
          // hide the loader
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

  const welcomeTitle =
    user?.firstName && isLoggedIn ? `Bonjour ${user.firstName}` : 'Bienvenue\u00a0!'

  // we distinguish three different cases:
  // - not connected OR eligible-to-credit users
  // - beneficiary users
  // - ex-beneficiary users
  const getSubtitle = () => {
    const shouldSeeDefaultSubtitle =
      !isLoggedIn || !user || !isUserBeneficiary(user) || user.isEligibleForBeneficiaryUpgrade
    if (shouldSeeDefaultSubtitle) return 'Toute la culture à portée de main'

    const shouldSeeBeneficiarySubtitle =
      isUserBeneficiary(user) && !!availableCredit && !availableCredit.isExpired
    if (shouldSeeBeneficiarySubtitle) {
      const credit = formatToFrenchDecimal(availableCredit.amount)
      return `Tu as ${credit} sur ton pass`
    }
    return 'Ton crédit est expiré'
  }
  // container layout
  const clDuiContainer = 'Layout123';
  const [isSDK, setIsSDK] = useState(false);

  // const handleClick = () => {

  //   HyperSDKModule.initiateSDK(true).then((result) => {
  //     console.log("res check", result) // Initiate successful
  //     setIsSDK(true)

  //   })
  //     .catch((error) => {
  //       console.error(error)
  //     }) // Pass `true` to indicate an empty activity
  // }

  // function handleBackButtonClick() {
  //   if (isSDK) {
  //     console.log("back check if", isSDK)
  //     HyperSDKModule.backPress(true)
  //     return true
  //   } else {
  //     // navigation.goBack()
  //     console.log("back check if", isSDK)
  //     return true
  //   }

  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
  //   };
  // }, []);





  const Banner = useMemo(() => {
    if (!isLoggedIn)
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.activation_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BicolorUnlock}
          />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.geolocation_banner)
      return (
        <BannerContainer>
          <GeolocationBanner title={homeBanner.title} subtitle={homeBanner.text} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.retry_identity_check_banner)
      return (
        <BannerContainer>
          <ActivationBanner title={homeBanner.title} subtitle={homeBanner.text} icon={ArrowAgain} />
        </BannerContainer>
      )

    if (homeBanner?.name === BannerName.transition_17_18_banner)
      return (
        <BannerContainer>
          <ActivationBanner
            title={homeBanner.title}
            subtitle={homeBanner.text}
            icon={BirthdayCake}
          />
        </BannerContainer>
      )

    return null
  }, [isLoggedIn, homeBanner])

  return (
    <React.Fragment>
      {!!env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING && (
        <CheatCodeButtonContainer
          onPress={() => navigation.navigate(Platform.OS === 'web' ? 'Navigation' : 'CheatMenu')}
          style={{ top: getSpacing(3) + top }}>
          <Typo.Body>CheatMenu</Typo.Body>
        </CheatCodeButtonContainer>
      )}
      <PageHeader title={welcomeTitle} numberOfLines={2} />
      <PageContent>
        {/* <Typo.Body>{getSubtitle()}</Typo.Body> */}

        <Button onPress={handleClick} title="Click here" />
        <Spacer.Column numberOfSpaces={6} />
      </PageContent>
      <PageContent>
        <Typo.Body>{getSubtitle()}</Typo.Body>
        <Spacer.Column numberOfSpaces={6} />
        {Banner}
      </PageContent>
    </React.Fragment>
  )
}

const PageContent = styled.View({
  marginHorizontal: getSpacing(6),
})

const CheatCodeButtonContainer = styled(TouchableOpacity)(({ theme }) => ({
  position: 'absolute',
  right: getSpacing(2),
  zIndex: theme.zIndex.cheatCodeButton,
  border: 1,
  padding: getSpacing(1),
}))

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})
