import React, { useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { ForceUpdate } from 'features/forceUpdate/pages/ForceUpdate'
import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { eventMonitoring } from 'libs/monitoring'
import { ScreenError } from 'libs/monitoring/errors'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

type ButtonProps = {
  title: string
  screen?: RootScreenNames
  onPress?: () => void
}

export function CheatcodesMenu(): React.JSX.Element {
  const [filter, setFilter] = useState('')
  const resetSearch = () => setFilter('')

  const { showInfoSnackBar } = useSnackBarContext()
  const onPressSentry = () => {
    const message = `SENTRY_${env.ENV}_TEST_${uuidv4().slice(0, 5)}`.toUpperCase()
    eventMonitoring.captureException(new Error(message))
    showInfoSnackBar({
      message: `L’erreur ${message} a été envoyé sur Sentry`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const { logType } = useLogTypeFromRemoteConfig()
  const onPressForceUpdate = () => {
    setScreenError(new ScreenError('Test force update page', { Screen: ForceUpdate, logType }))
  }

  const featuresButtons: ButtonProps[] = [
    { title: 'Achievements 🏆', screen: 'CheatcodesNavigationAchievements' },
    { title: 'BookOffer 🎫', screen: 'CheatcodesNavigationBookOffer' },
    { title: 'Cultural Survey 🎨', screen: 'CheatcodesNavigationCulturalSurvey' },
    { title: 'ForceUpdate 🆙', onPress: onPressForceUpdate },
    { title: 'Home 🏠', screen: 'CheatcodesNavigationHome' },
    { title: 'IdentityCheck 🎨', screen: 'CheatcodesNavigationIdentityCheck' },
    { title: 'Internal (Marketing) 🎯', screen: 'CheatcodesNavigationInternal' },
    { title: 'Profile 👤', screen: 'CheatcodesNavigationProfile' },
    { title: 'Share 🔗', screen: 'CheatcodesNavigationShare' },
    { title: 'Subscription 🔔', screen: 'CheatcodesNavigationSubscription' },
    { title: 'Trusted device 📱', screen: 'CheatcodesNavigationTrustedDevice' },
    { title: 'Tutorial ❔', screen: 'CheatcodesNavigationTutorial' },
  ]

  const otherButtons: ButtonProps[] = [
    { title: 'Nouvelle-Calédonie 🇳🇨', screen: 'CheatcodesScreenNewCaledonia' },
    { title: 'Features flags 🏳️', screen: 'CheatcodesScreenFeatureFlags' },
    { title: 'Remote config 📊', screen: 'CheatcodesScreenRemoteConfig' },
    { title: 'Debug informations 🪲', screen: 'CheatcodesScreenDebugInformations' },
    { title: 'Errors 👾', screen: 'CheatcodesNavigationErrors' },
    { title: 'Pages non écrans ❌', screen: 'CheatcodesNavigationNotScreensPages' },
    { title: 'AccesLibre 🌈', screen: 'CheatcodesNavigationSignUp' },
    { title: 'SignUp 🎨', screen: 'CheatcodesScreenAccesLibre' },
    { title: 'Account Management ⚙️', screen: 'CheatcodesNavigationAccountManagement' },
    { title: 'Envoyer une erreur Sentry 📤', onPress: onPressSentry },
  ]

  if (screenError) throw screenError

  const filteredFeaturesButtons = featuresButtons.filter((button) =>
    button.title.toLowerCase().includes(filter.toLowerCase())
  )
  const filteredOtherButtons = otherButtons.filter((button) =>
    button.title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <CheatcodesTemplateScreen title="Cheatcodes">
      <StyledSearchInput
        placeholder="Rechercher..."
        value={filter}
        onChangeText={setFilter}
        onPressRightIcon={resetSearch}
      />

      <StyledView>
        <SeparatorWithText label="FEATURES" />
      </StyledView>

      {filteredFeaturesButtons.map((button, index) => (
        <LinkToScreen
          key={index}
          title={button.title}
          screen={button.screen}
          onPress={button.onPress}
        />
      ))}

      <StyledView>
        <SeparatorWithText label="AUTRES" />
      </StyledView>

      {filteredOtherButtons.map((button, index) => (
        <LinkToScreen
          key={index}
          title={button.title}
          screen={button.screen}
          onPress={button.onPress}
        />
      ))}
    </CheatcodesTemplateScreen>
  )
}

const StyledSearchInput = styled(SearchInput).attrs({
  inputContainerStyle: {
    flex: 1,
    marginBottom: getSpacing(4),
  },
})``

const StyledView = styled.View({
  width: '100%',
  marginVertical: getSpacing(2),
})
