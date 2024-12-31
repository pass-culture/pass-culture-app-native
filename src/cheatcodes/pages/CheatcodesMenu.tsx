import React, { useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
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

      <LinkToComponent title="Achievements 🏆" name="CheatcodesNavigationAchievements" />
      <LinkToComponent title="BookOffer 🎫" name="CheatcodesNavigationBookOffer" />
      <LinkToComponent title="Cultural Survey 🎨" name="CheatcodesNavigationCulturalSurvey" />
      <LinkToComponent title="ForceUpdate 🆙" onPress={onPressForceUpdate} />
      <LinkToComponent title="Home 🏠" name="CheatcodesNavigationHome" />
      <LinkToComponent title="IdentityCheck 🎨" name="CheatcodesNavigationIdentityCheck" />
      <LinkToComponent title="Internal (Maketing) 🎯" name="CheatcodesNavigationInternal" />
      <LinkToComponent title="Profile 👤" name="CheatcodesNavigationProfile" />
      <LinkToComponent title="Share 🔗" name="CheatcodesNavigationShare" />
      <LinkToComponent title="Subscription 🔔" name="CheatcodesNavigationSubscription" />
      <LinkToComponent title="Trusted device 📱" name="CheatcodesNavigationTrustedDevice" />
      <LinkToComponent title="Tutorial ❔" name="CheatcodesNavigationTutorial" />

      <StyledView>
        <SeparatorWithText label="AUTRES" />
      </StyledView>

      <LinkToComponent title="Nouvelle-Calédonie 🇳🇨" name="CheatcodesScreenNewCaledonia" />
      <LinkToComponent title="Debug informations 🪲" name="CheatcodesScreenDebugInformations" />
      <LinkToComponent title="Errors 👾" name="CheatcodesNavigationErrors" />
      <LinkToComponent title="Pages non écrans ❌" name="CheatcodesNavigationNotScreensPages" />
      <LinkToComponent title="AccesLibre 🌈" name="CheatcodesScreenAccesLibre" />
      <LinkToComponent title="SignUp 🎨" name="CheatcodesNavigationSignUp" />
      <LinkToComponent title="Account Management ⚙️" name="CheatcodesNavigationAccountManagement" />
      <LinkToComponent title="Distance to Eiffel Tower 🗼" onPress={onPressDistanceToEiffelTower} />
      <LinkToComponent title="Envoyer une erreur Sentry 📤" onPress={onPressSentry} />
    </CheatcodesTemplateScreen>
  )
}

const StyledView = styled.View({
  width: '100%',
  marginVertical: getSpacing(2),
})
