import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'
import React, { useState, createElement } from 'react'
import { Alert, ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { useSignIn } from 'features/auth/api'
import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useDistance } from 'features/offer/components/useDistance'
import { AsyncError } from 'libs/errorMonitoring'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'

const BadDeeplink = DEEPLINK_DOMAIN + 'unknown'
const LoginDeeplink = DEEPLINK_DOMAIN + 'login'
const MAX_ASYNC_TEST_REQ_COUNT = 3
const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

export function Navigation(): JSX.Element {
  const navigation = useNavigation<UseNavigationType>()
  const [renderedError, setRenderedError] = useState(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const distanceToEiffelTower = useDistance(EIFFEL_TOWER_COORDINATES)
  const { showErrorSnackBar } = useSnackBarContext()
  const signIn = useSignIn()

  const { refetch: errorAsyncQuery, isFetching } = useQuery(
    QueryKeys.ERROR_ASYNC,
    () => errorAsync(),
    {
      cacheTime: 0,
      enabled: false,
    }
  )

  async function errorAsync() {
    setAsyncTestReqCount((v) => ++v)
    if (asyncTestReqCount <= MAX_ASYNC_TEST_REQ_COUNT) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', errorAsyncQuery)
    }
  }

  async function onIdCheckV2() {
    const email = 'dka@dka.com' || 'pctest.jeune93.has-booked-some.v2@example.com'
    const password = 'user@AZERTY123'
    try {
      const signInResponse = await signIn({ identifier: email, password })
      if (signInResponse.isSuccess) {
        navigation.navigate(idCheckInitialRouteName, {
          email,
          licence_token: undefined,
          expiration_timestamp: null,
        })
      } else {
        showErrorSnackBar({
          message: `Échec du quick sign in pour l'utilisateur "${email}"`,
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
    } catch (error) {
      showErrorSnackBar({ message: error.message, timeout: SNACK_BAR_TIME_OUT })
    }
  }

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="Navigation"
        leftIcon={ArrowPrevious}
        onLeftIconPress={navigation.goBack}
      />
      <StyledContainer>
        <Row half>
          <CheatCodesButton />
        </Row>
        <Row half>
          <NavigationButton title={'Login'} onPress={() => navigation.navigate('Login')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'Set Birthday'}
            onPress={() =>
              navigation.navigate('SetBirthday', {
                email: 'jonh.doe@exmaple.com',
                isNewsletterChecked: false,
                password: 'user@AZERTY123',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Signup choix mdp'}
            onPress={() =>
              navigation.navigate('SetPassword', {
                email: 'jonh.doe@exmaple.com',
                isNewsletterChecked: false,
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Signup : email envoyé'}
            onPress={() =>
              navigation.navigate('SignupConfirmationEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Reset mdp lien expiré'}
            onPress={() =>
              navigation.navigate('ResetPasswordExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Account confirmation lien expiré'}
            onPress={() =>
              navigation.navigate('SignupConfirmationExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Signup : Validate Email'}
            onPress={() =>
              navigation.navigate('AfterSignupEmailValidationBuffer', {
                token: 'whichTokenDoYouWantReally',
                expirationTimestamp: 456789123,
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Account Created'}
            onPress={() => navigation.navigate('AccountCreated')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Reset mdp email envoyé'}
            onPress={() =>
              navigation.navigate('ResetPasswordEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Vérifier éligibilité'}
            onPress={() =>
              navigation.navigate('VerifyEligibility', {
                email: 'jean.dupont@gmail.com',
                licence_token: 'xXLicenceTokenXx',
                expiration_timestamp: new Date().getTime(),
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Eligibility confirmed'}
            onPress={() => navigation.navigate('EligibilityConfirmed')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'First Tutorial'}
            onPress={() =>
              navigation.navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Cultural Survey'}
            onPress={() => navigation.navigate('CulturalSurvey')}
          />
        </Row>
        <Row>
          <NavigationButton
            title={'Mauvais deeplink unknown'}
            onPress={() => openExternalUrl(BadDeeplink)}
          />
        </Row>
        <Row>
          <CenteredText>{BadDeeplink}</CenteredText>
        </Row>
        <Row half>
          <NavigationButton
            title={'Erreur rendering'}
            onPress={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              setRenderedError(createElement(CenteredText, { children: CenteredText }))
            }}
          />
          {renderedError}
        </Row>
        <Row half>
          <NavigationButton
            title={
              asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT
                ? `${MAX_ASYNC_TEST_REQ_COUNT} erreurs asynchrones`
                : 'OK'
            }
            disabled={isFetching || asyncTestReqCount >= MAX_ASYNC_TEST_REQ_COUNT}
            onPress={() => errorAsyncQuery()}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Universal Link'}
            onPress={() => openExternalUrl(LoginDeeplink)}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Eighteen Birthday'}
            onPress={() => navigation.navigate('EighteenBirthday')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Réglages notifications'}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Réglages cookies'}
            onPress={() => navigation.navigate('ConsentSettings', { onGoBack: () => null })}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'A/B Testing POC'}
            onPress={() => navigation.navigate('ABTestingPOC')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Distance to Eiffel Tower`}
            onPress={() => {
              Alert.alert(distanceToEiffelTower || 'Authorize geolocation first')
            }}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Maintenance Page`}
            onPress={() => navigation.navigate('Maintenance')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`ForceUpdate Page`}
            onPress={() => navigation.navigate('ForceUpdate')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Beneficiary request sent`}
            onPress={() => navigation.navigate('BeneficiaryRequestSent')}
          />
        </Row>
        <Row half>
          <NavigationButton title={`Id Check V2`} onPress={onIdCheckV2} />
        </Row>
        <Row half>
          <NavigationButton
            title={`Temporary IdCheck`}
            onPress={() => navigation.navigate('TemporaryIdCheck')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Id Check V2 errors`}
            onPress={() => navigation.navigate('NavigationIdCheckErrors')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Id Check Unavailable`}
            onPress={() => navigation.navigate('IdCheckUnavailable')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Trop de tentatives`}
            onPress={() => navigation.navigate('TooManyAttempts')}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const NavigationButton = styled(ButtonPrimary).attrs({
  textSize: 11.5,
})({})

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))

const CenteredText = styled.Text({
  width: '100%',
  textAlign: 'center',
  fontSize: 13,
})
