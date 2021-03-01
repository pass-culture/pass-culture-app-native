import { useNavigation } from '@react-navigation/native'
import React, { useState, createElement } from 'react'
import { ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { AsyncError } from 'features/errors/pages/AsyncErrorBoundary'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

import { CheatCodesButton } from '../components/CheatCodesButton'

const BadDeeplink = DEEPLINK_DOMAIN + 'unknown'
const LoginDeeplink = DEEPLINK_DOMAIN + 'login'
const MAX_ASYNC_TEST_REQ_COUNT = 3

export function Navigation(): JSX.Element {
  const navigation = useNavigation<UseNavigationType>()
  const [renderedError, setRenderedError] = useState(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const { refetch: errorAsyncQuery, isFetching } = useQuery('errorAsync', () => errorAsync(), {
    cacheTime: 0,
    enabled: false,
  })

  async function errorAsync() {
    setAsyncTestReqCount((v) => ++v)
    if (asyncTestReqCount <= MAX_ASYNC_TEST_REQ_COUNT) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', errorAsyncQuery)
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
                licenceToken: 'xXLicenceTokenXx',
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
            onPress={() => navigation.navigate('FirstTutorial')}
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
          <NavigationButton title={'Calendar'} onPress={() => navigation.navigate('Calendar')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'Réglages cookies'}
            onPress={() => navigation.navigate('ConsentSettings', { onGoBack: () => null })}
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
