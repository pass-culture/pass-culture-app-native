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
import { env } from 'libs/environment'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { AsyncError, eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { shareApp } from 'libs/share/shareApp/shareApp'
import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { padding, Spacer, Typo } from 'ui/theme'

const MAX_ASYNC_TEST_REQ_COUNT = 3
const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

export function Navigation(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
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

  const {
    visible: shareAppModalVisible,
    showModal: showShareAppModal,
    hideModal: hideShareAppModal,
  } = useModal(false)

  const pressShareApp = () => {
    shareApp()
    showShareAppModal()
  }

  if (screenError) {
    throw screenError
  }

  return (
    <React.Fragment>
      <PageHeader title="Navigation" withGoBackButton />
      <ScrollView>
        <StyledContainer>
          <Row half>
            <CheatCodesButton />
          </Row>
          <Row half>
            <ButtonPrimary wording="SignUp 🎨" onPress={() => navigate('NavigationSignUp')} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Cultural Survey 🎨"
              onPress={() => navigate('NavigationCulturalSurvey')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Account Management 🎨"
              onPress={() => navigate('NavigationAccountSuspension')}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="Profile 🎨" onPress={() => navigate('NavigationProfile')} />
          </Row>
          <Row half>
            <ButtonPrimary wording="Partage de l'app" onPress={pressShareApp} />
            <ShareAppModal visible={shareAppModalVisible} dismissModal={hideShareAppModal} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Sentry"
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
            <ButtonPrimary wording="POC A/B testing" onPress={() => navigate('ABTestingPOC')} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Reset mdp lien expiré"
              onPress={() =>
                navigate('ResetPasswordExpiredLink', {
                  email: 'john@wick.com',
                })
              }
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Reset mdp email envoyé"
              onPress={() =>
                navigate('ResetPasswordEmailSent', {
                  email: 'jean.dupont@gmail.com',
                })
              }
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="First Tutorial"
              onPress={() => navigate('FirstTutorial', { shouldCloseAppOnBackAction: false })}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="Cultural Survey" onPress={() => navigate('CulturalSurvey')} />
          </Row>
          <Row half>
            <ButtonPrimary wording="Venue" onPress={() => navigate('Venue', { id: venueId })} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Erreur rendering"
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
              wording="Eighteen Birthday"
              onPress={() => navigate('EighteenBirthday')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Distance to Eiffel Tower"
              onPress={() => {
                Alert.alert(distanceToEiffelTower || 'Authorize geolocation first')
              }}
            />
          </Row>
          <Row half>
            <LandscapePositionPage isVisible={isLandscapeVisible} />
            <ButtonPrimary
              wording="Tu es en paysage !"
              onPress={() => setIsLandscapeVisible(true)}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Maintenance Page"
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
              wording="ForceUpdate Page"
              onPress={() => setScreenError(new ScreenError('Test force update page', ForceUpdate))}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Beneficiary request sent"
              onPress={() => navigate('BeneficiaryRequestSent')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Pages non écrans"
              onPress={() => navigate('NavigationNotScreensPages')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Offre inexistante"
              onPress={() => navigate('Offer', { id: 0, from: 'search' })}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Booking Confirmation"
              onPress={() => navigate('BookingConfirmation', { offerId: 11224, bookingId: 1240 })}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Change e-mail lien expiré"
              onPress={() => navigate('ChangeEmailExpiredLink')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Générateur de deeplinks"
              onPress={() => navigate('DeeplinksGenerator')}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="UTM parameters" onPress={() => navigate('UTMParameters')} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Notification rechargement crédit"
              onPress={() => navigate('RecreditBirthdayNotification')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Underage account created"
              onPress={() => navigate('UnderageAccountCreated')}
            />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Contentful KO error"
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
    </React.Fragment>
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

const CenteredText = styled(Typo.Caption)({
  width: '100%',
  textAlign: 'center',
})
