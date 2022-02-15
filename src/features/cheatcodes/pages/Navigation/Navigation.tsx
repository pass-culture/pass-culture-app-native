import { useNavigation } from '@react-navigation/native'
import React, { useState, createElement } from 'react'
import { Alert } from 'react-native'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { useSomeVenueId } from 'features/cheatcodes/pages/Navigation/useSomeVenueId'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { NoContentError } from 'features/home/components/NoContentError'
import { LandscapePositionPage } from 'features/landscapePosition/LandscapePositionPage'
import { Maintenance } from 'features/maintenance/Maintenance'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

const MAX_ASYNC_TEST_REQ_COUNT = 3
const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

export function Navigation(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const { goBack } = useGoBack('CheatMenu', undefined)
  const [renderedError, setRenderedError] = useState(undefined)
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [isLandscapeVisible, setIsLandscapeVisible] = useState<boolean>(false)
  const [asyncTestReqCount, setAsyncTestReqCount] = useState(0)
  const distanceToEiffelTower = useDistance(EIFFEL_TOWER_COORDINATES)
  const venueId = useSomeVenueId()
  const { showInfoSnackBar } = useSnackBarContext()

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
    <ScrollView>
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
          <ButtonPrimary
            wording={'IdentityCheck 🎨'}
            onPress={() => navigate('NavigationIdentityCheck')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Sentry'}
            onPress={() => {
              const message = `SENTRY_${env.ENV}_TEST_${uuidv4().slice(0, 5)}`.toUpperCase()
              eventMonitoring.captureException(new Error(message))
              showInfoSnackBar({
                message: `L'erreur ${message} a été envoyé sur Sentry`,
                timeout: SNACK_BAR_TIME_OUT,
              })
            }}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={'Login'} onPress={() => navigate('Login')} />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Signup : email envoyé'}
            onPress={() =>
              navigate('SignupConfirmationEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Reset mdp lien expiré'}
            onPress={() =>
              navigate('ResetPasswordExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Account confirmation lien expiré'}
            onPress={() =>
              navigate('SignupConfirmationExpiredLink', {
                email: 'john@wick.com',
              })
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Signup : Validate Email'}
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
          <ButtonPrimary wording={'Account Created'} onPress={() => navigate('AccountCreated')} />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Reset mdp email envoyé'}
            onPress={() =>
              navigate('ResetPasswordEmailSent', {
                email: 'jean.dupont@gmail.com',
              })
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Vérifier éligibilité'}
            onPress={() => navigate('VerifyEligibility')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={"C'est pour bientôt"}
            onPress={() =>
              navigate('NotYetUnderageEligibility', {
                eligibilityStartDatetime: new Date('2019-12-01T00:00:00Z').toString(),
              })
            }
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'First Tutorial'}
            onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={'Cultural Survey'} onPress={() => navigate('CulturalSurvey')} />
        </Row>
        <Row half>
          <ButtonPrimary wording="Venue" onPress={() => navigate('Venue', { id: venueId })} />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Confirm delete profile'}
            onPress={() => navigate('ConfirmDeleteProfile')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Erreur rendering'}
            onPress={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              setRenderedError(createElement(CenteredText, { children: CenteredText })) // eslint-disable-line react/no-children-prop
            }}
          />
          {renderedError}
        </Row>
        <Row half>
          <ButtonPrimary
            wording={
              asyncTestReqCount < MAX_ASYNC_TEST_REQ_COUNT
                ? `${MAX_ASYNC_TEST_REQ_COUNT} erreurs asynchrones`
                : 'OK'
            }
            disabled={isFetching || asyncTestReqCount >= MAX_ASYNC_TEST_REQ_COUNT}
            onPress={() => errorAsyncQuery()}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Eighteen Birthday'}
            onPress={() => navigate('EighteenBirthday')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Réglages notifications'}
            onPress={() => navigate('NotificationSettings')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Réglages cookies'}
            onPress={() => navigate('ConsentSettings', { onGoBack: () => null })}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Distance to Eiffel Tower`}
            onPress={() => {
              Alert.alert(distanceToEiffelTower || 'Authorize geolocation first')
            }}
          />
        </Row>
        <Row half>
          <LandscapePositionPage isVisible={isLandscapeVisible} />
          <ButtonPrimary
            wording={'Tu es en paysage !'}
            onPress={() => setIsLandscapeVisible(true)}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Maintenance Page`}
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
          <ButtonPrimary
            wording={`ForceUpdate Page`}
            onPress={() => setScreenError(new ScreenError('Test force update page', ForceUpdate))}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Beneficiary request sent`}
            onPress={() => navigate('BeneficiaryRequestSent')}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={`PhoneValidation`} onPress={() => navigate('SetPhoneNumber')} />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Pages non écrans`}
            onPress={() => navigate('NavigationNotScreensPages')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Phone validation too many attempts`}
            onPress={() => navigate('PhoneValidationTooManyAttempts')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Phone validation too many SMS sent`}
            onPress={() => navigate('PhoneValidationTooManySMSSent')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Offre inexistante`}
            onPress={() => navigate('Offer', { id: 0, from: 'search' })}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Booking Confirmation`}
            onPress={() => navigate('BookingConfirmation', { offerId: 11224, bookingId: 1240 })}
          />
        </Row>
        <Row half>
          <ButtonPrimary wording={`Modifier mon e-mail`} onPress={() => navigate('ChangeEmail')} />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Change e-mail lien expiré'}
            onPress={() => navigate('ChangeEmailExpiredLink')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Générateur de deeplinks'}
            onPress={() => navigate('DeeplinksGenerator')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={`Notification rechargement crédit`}
            onPress={() => navigate('RecreditBirthdayNotification')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Underage account created'}
            onPress={() => navigate('UnderageAccountCreated')}
          />
        </Row>
        <Row half>
          <ButtonPrimary
            wording={'Contentful KO error'}
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
        <Row half>
          <ButtonPrimary
            wording={'Set Phone Validation Code'}
            onPress={() =>
              navigate('SetPhoneValidationCode', { phoneNumber: '+33612345678', countryCode: 'FR' })
            }
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const ScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    backgroundColor: theme.colors.white,
  },
}))``

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
