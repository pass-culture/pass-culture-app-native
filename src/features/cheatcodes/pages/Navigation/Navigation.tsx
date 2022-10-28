import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatCodesButton } from 'features/cheatcodes/components/CheatCodesButton'
import { useSomeVenueId } from 'features/cheatcodes/pages/Navigation/useSomeVenueId'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { ForceUpdate } from 'features/forceUpdate/ForceUpdate'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AskNotificiationsModal } from 'features/notifications/askNotificationsModal/components/AskNotificationsModal'
import { env } from 'libs/environment'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { useModal } from 'ui/components/modals/useModal'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { padding, Spacer } from 'ui/theme'

const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

export function Navigation(): JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const distanceToEiffelTower = useDistance(EIFFEL_TOWER_COORDINATES)
  const venueId = useSomeVenueId()
  const { showInfoSnackBar } = useSnackBarContext()

  const {
    visible: cookiesConsentModalVisible,
    showModal: showCookiesConsentModal,
    hideModal: hideCookiesConsentModal,
  } = useModal(false)
  const {
    visible: notificationsConsentModalVisible,
    showModal: showNotificationsConsentModal,
    hideModal: hideNotificationsConsentModal,
  } = useModal(false)

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
            <ButtonPrimary
              wording="ThematicHomeHeader"
              onPress={() => navigate('ThematicHomeHeaderCheatcode')}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="Profile 🎨" onPress={() => navigate('NavigationProfile')} />
          </Row>
          <Row half>
            <ButtonPrimary wording="Errors 👾" onPress={() => navigate('NavigationErrors')} />
          </Row>
          <Row half>
            <ButtonPrimary
              wording="Partage de l'app 📱"
              onPress={() => navigate('ShareAppModal')}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="Cookies consent 🍪" onPress={() => showCookiesConsentModal()} />
            <CookiesConsent
              visible={cookiesConsentModalVisible}
              hideModal={hideCookiesConsentModal}
            />
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
            <ButtonPrimary
              wording="Notification consent 🔔"
              onPress={() => showNotificationsConsentModal()}
            />
            <AskNotificiationsModal
              visible={notificationsConsentModalVisible}
              onHideModal={hideNotificationsConsentModal}
            />
          </Row>
          <Row half>
            <ButtonPrimary wording="POC A/B testing" onPress={() => navigate('ABTestingPOC')} />
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
            <ButtonPrimary
              wording="ForceUpdate Page"
              onPress={() => setScreenError(new ScreenError('Test force update page', ForceUpdate))}
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
