import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { ForceUpdate } from 'features/forceUpdate/pages/ForceUpdate'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
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
  const { navigate } = useNavigation<UseNavigationType>()
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

      <LinkToComponent
        title="Achievements 🏆"
        onPress={() => navigate('CheatcodesNavigationAchievements')}
      />
      <LinkToComponent
        title="BookOffer 🎫"
        onPress={() => navigate('CheatcodesNavigationBookOffer')}
      />
      <LinkToComponent
        title="Cultural Survey 🎨"
        onPress={() => navigate('CheatcodesNavigationCulturalSurvey')}
      />
      <LinkToComponent title="ForceUpdate 🆙" onPress={onPressForceUpdate} />
      <LinkToComponent title="Home 🏠" onPress={() => navigate('CheatcodesNavigationHome')} />
      <LinkToComponent
        title="IdentityCheck 🎨"
        onPress={() => navigate('CheatcodesNavigationIdentityCheck')}
      />
      <LinkToComponent
        title="Internal (Maketing) 🎯"
        onPress={() => navigate('CheatcodesNavigationInternal')}
      />
      <LinkToComponent title="Profile 👤" onPress={() => navigate('CheatcodesNavigationProfile')} />
      <LinkToComponent title="Share 🔗" onPress={() => navigate('CheatcodesNavigationShare')} />
      <LinkToComponent
        title="Subscription 🔔"
        onPress={() => navigate('CheatcodesNavigationSubscription')}
      />
      <LinkToComponent
        title="Trusted device 📱"
        onPress={() => navigate('CheatcodesNavigationTrustedDevice')}
      />
      <LinkToComponent
        title="Tutorial ❔"
        onPress={() => navigate('CheatcodesNavigationTutorial')}
      />

      <StyledView>
        <SeparatorWithText label="AUTRES" />
      </StyledView>

      <LinkToComponent
        title="Nouvelle-Calédonie 🇳🇨"
        onPress={() => navigate('CheatcodesScreenNewCaledonia')}
      />
      <LinkToComponent
        title="Debug informations 🪲"
        onPress={() => navigate('CheatcodesScreenDebugInformations')}
      />
      <LinkToComponent title="Errors 👾" onPress={() => navigate('CheatcodesNavigationErrors')} />
      <LinkToComponent
        title="Pages non écrans ❌"
        onPress={() => navigate('CheatcodesNavigationNotScreensPages')}
      />
      <LinkToComponent
        title="AccesLibre 🌈"
        onPress={() => navigate('CheatcodesScreenAccesLibre')}
      />
      <LinkToComponent title="SignUp 🎨" onPress={() => navigate('CheatcodesNavigationSignUp')} />
      <LinkToComponent
        title="Account Management ⚙️"
        onPress={() => navigate('CheatcodesNavigationAccountManagement')}
      />
      <LinkToComponent title="Distance to Eiffel Tower 🗼" onPress={onPressDistanceToEiffelTower} />
      <LinkToComponent title="Envoyer une erreur Sentry 📤" onPress={onPressSentry} />
    </CheatcodesTemplateScreen>
  )
}

const StyledView = styled.View({
  width: '100%',
  marginVertical: getSpacing(2),
})
