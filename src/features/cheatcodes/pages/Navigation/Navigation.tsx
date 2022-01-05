import { useNavigation } from '@react-navigation/native'
import React, { useState, createElement } from 'react'
import { Alert, ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { useSomeVenueId } from 'features/cheatcodes/pages/Navigation/useSomeVenueId'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { NoContentError } from 'features/home/components/NoContentError'
import { Maintenance } from 'features/maintenance/Maintenance'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { AsyncError } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { ColorsEnum, padding, Spacer } from 'ui/theme'

const MAX_ASYNC_TEST_REQ_COUNT = 3
const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

const contentContainerStyle = {
  backgroundColor: ColorsEnum.WHITE,
}

export function Navigation(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('CheatMenu', undefined)
  const [renderedError, setRenderedError] = useState(undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const distanceToEiffelTower = useDistance(EIFFEL_TOWER_COORDINATES)
  const venueId = useSomeVenueId()
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

  if (screenError) {
    throw screenError
  }

  return (
    <ScrollView contentContainerStyle={contentContainerStyle}>
      <Spacer.TopScreen />
      <ModalHeader
        title="Navigation"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <Row half>
          <CheatCodesButton />
        </Row>
        <Row half>
          <NavigationButton
            title={'IdentityCheck 🎨'}
            onPress={() => navigate('NavigationIdentityCheck')}
          />
        </Row>
        <Row half>
          <NavigationButton title={'Login'} onPress={() => navigate('Login')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'Signup : email envoyé'}
            onPress={() =>
              navigate('SignupConfirmationEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Reset mdp lien expiré'}
            onPress={() =>
              navigate('ResetPasswordExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Account confirmation lien expiré'}
            onPress={() =>
              navigate('SignupConfirmationExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Signup : Validate Email'}
            onPress={() =>
              navigate('AfterSignupEmailValidationBuffer', {
                token: 'whichTokenDoYouWantReally',
                expiration_timestamp: 456789123,
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton title={'Account Created'} onPress={() => navigate('AccountCreated')} />
        </Row>
        <Row half>
          <NavigationButton
            title={'Reset mdp email envoyé'}
            onPress={() =>
              navigate('ResetPasswordEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Vérifier éligibilité'}
            onPress={() => navigate('VerifyEligibility')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={"C'est pour bientôt"}
            onPress={() =>
              navigate('NotYetUnderageEligibility', {
                eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString(),
              })
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'First Tutorial'}
            onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
          />
        </Row>
        <Row half>
          <NavigationButton title={'Cultural Survey'} onPress={() => navigate('CulturalSurvey')} />
        </Row>
        <Row half>
          <NavigationButton title="Venue" onPress={() => navigate('Venue', { id: venueId })} />
        </Row>
        <Row half>
          <NavigationButton
            title={'Confirm delete profile'}
            onPress={() => navigate('ConfirmDeleteProfile')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Erreur rendering'}
            onPress={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              setRenderedError(createElement(CenteredText, { children: CenteredText })) // eslint-disable-line react/no-children-prop
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
            title={'Eighteen Birthday'}
            onPress={() => navigate('EighteenBirthday')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Réglages notifications'}
            onPress={() => navigate('NotificationSettings')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Réglages cookies'}
            onPress={() => navigate('ConsentSettings', { onGoBack: () => null })}
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
            title={'Tu es en paysage !'}
            onPress={() => navigate('LandscapePositionPage')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Maintenance Page`}
            onPress={() =>
              setScreenError(
                new ScreenError('Test maintenance page', () => (
                  <Maintenance message="Some maintenance message that is set in Firestore" />
                ))
              )
            }
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`ForceUpdate Page`}
            onPress={() => setScreenError(new ScreenError('Test force update page', ForceUpdate))}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Beneficiary request sent`}
            onPress={() => navigate('BeneficiaryRequestSent')}
          />
        </Row>
        <Row half>
          <NavigationButton title={`PhoneValidation`} onPress={() => navigate('SetPhoneNumber')} />
        </Row>
        <Row half>
          <NavigationButton
            title={`Pages non écrans`}
            onPress={() => navigate('NavigationNotScreensPages')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Phone validation too many attempts`}
            onPress={() => navigate('PhoneValidationTooManyAttempts')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Phone validation too many SMS sent`}
            onPress={() => navigate('PhoneValidationTooManySMSSent')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Offre inexistante`}
            onPress={() => navigate('Offer', { id: 0, from: 'search' })}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Booking Confirmation`}
            onPress={() => navigate('BookingConfirmation', { offerId: 11224, bookingId: 1240 })}
          />
        </Row>
        <Row half>
          <NavigationButton title={`Modifier mon e-mail`} onPress={() => navigate('ChangeEmail')} />
        </Row>
        <Row half>
          <NavigationButton
            title={`Accueil sélection établissement`}
            onPress={() => navigate('SelectSchoolHome')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Sélection établissement`}
            onPress={() => navigate('SelectSchool')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Change e-mail lien expiré'}
            onPress={() => navigate('ChangeEmailExpiredLink')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Générateur de deeplinks'}
            onPress={() => navigate('DeeplinksGenerator')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={`Notification rechargement crédit`}
            onPress={() => navigate('RecreditBirthdayNotification')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Underage account created'}
            onPress={() => navigate('UnderageAccountCreated')}
          />
        </Row>
        <Row half>
          <NavigationButton
            title={'Contentful KO error'}
            onPress={() =>
              setScreenError(
                new ScreenError(
                  'Échec de la requête https://cdn.contentful.com/spaces/2bg01iqy0isv/environments/testing/entries?include=2&content_type=homepageNatif&access_token=<TOKEN>, code: 400',
                  NoContentError
                )
              )
            }
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
