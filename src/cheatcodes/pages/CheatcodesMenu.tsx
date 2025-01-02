import React, { useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { ForceUpdate } from 'features/forceUpdate/pages/ForceUpdate'
import { env } from 'libs/environment'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { useDistance } from 'libs/location/hooks/useDistance'
import { eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

const EIFFEL_TOWER_COORDINATES = { lat: 48.8584, lng: 2.2945 }

export function CheatcodesMenu(): React.JSX.Element {
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const distanceToEiffelTower = useDistance(EIFFEL_TOWER_COORDINATES)
  const { showInfoSnackBar } = useSnackBarContext()
  const { logType } = useLogTypeFromRemoteConfig()

  const onPressSentry = () => {
    const message = `SENTRY_${env.ENV}_TEST_${uuidv4().slice(0, 5)}`.toUpperCase()
    eventMonitoring.captureException(new Error(message))
    showInfoSnackBar({
      message: `L’erreur ${message} a été envoyé sur Sentry`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const onPressDistanceToEiffelTower = () => {
    Alert.alert(distanceToEiffelTower || 'Authorize geolocation first')
  }

  const onPressForceUpdate = () => {
    setScreenError(
      new ScreenError('Test force update page', {
        Screen: ForceUpdate,
        logType,
      })
    )
  }

  if (screenError) throw screenError

  return (
    <CheatcodesTemplateScreen title="Cheatcodes">
      <StyledView>
        <SeparatorWithText label="FEATURES" />
      </StyledView>

      <LinkToScreen title="Achievements 🏆" screen="CheatcodesNavigationAchievements" />
      <LinkToScreen title="BookOffer 🎫" screen="CheatcodesNavigationBookOffer" />
      <LinkToScreen title="Cultural Survey 🎨" screen="CheatcodesNavigationCulturalSurvey" />
      <LinkToScreen title="ForceUpdate 🆙" onPress={onPressForceUpdate} />
      <LinkToScreen title="Home 🏠" screen="CheatcodesNavigationHome" />
      <LinkToScreen title="IdentityCheck 🎨" screen="CheatcodesNavigationIdentityCheck" />
      <LinkToScreen title="Internal (Maketing) 🎯" screen="CheatcodesNavigationInternal" />
      <LinkToScreen title="Profile 👤" screen="CheatcodesNavigationProfile" />
      <LinkToScreen title="Share 🔗" screen="CheatcodesNavigationShare" />
      <LinkToScreen title="Subscription 🔔" screen="CheatcodesNavigationSubscription" />
      <LinkToScreen title="Trusted device 📱" screen="CheatcodesNavigationTrustedDevice" />
      <LinkToScreen title="Tutorial ❔" screen="CheatcodesNavigationTutorial" />

      <StyledView>
        <SeparatorWithText label="AUTRES" />
      </StyledView>

      <LinkToScreen title="Nouvelle-Calédonie 🇳🇨" screen="CheatcodesScreenNewCaledonia" />
      <LinkToScreen title="Debug informations 🪲" screen="CheatcodesScreenDebugInformations" />
      <LinkToScreen title="Errors 👾" screen="CheatcodesNavigationErrors" />
      <LinkToScreen title="Pages non écrans ❌" screen="CheatcodesNavigationNotScreensPages" />
      <LinkToScreen title="AccesLibre 🌈" screen="CheatcodesScreenAccesLibre" />
      <LinkToScreen title="SignUp 🎨" screen="CheatcodesNavigationSignUp" />
      <LinkToScreen title="Account Management ⚙️" screen="CheatcodesNavigationAccountManagement" />
      <LinkToScreen title="Distance to Eiffel Tower 🗼" onPress={onPressDistanceToEiffelTower} />
      <LinkToScreen title="Envoyer une erreur Sentry 📤" onPress={onPressSentry} />
    </CheatcodesTemplateScreen>
  )
}

const StyledView = styled.View({
  width: '100%',
  marginVertical: getSpacing(2),
})
