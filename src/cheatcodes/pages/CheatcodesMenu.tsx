import React, { useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesButtonList } from 'cheatcodes/components/CheatcodesButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { filterAndSortCheatcodesButtons } from 'cheatcodes/hooks/filterAndSortCheatcodesButtons'
import { cheatcodesNavigationAchievementsButtons } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { cheatcodesNavigationBookOfferButtons } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { cheatcodesNavigationCulturalSurveyButtons } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { cheatcodesNavigationForceUpdateButtons } from 'cheatcodes/pages/features/forceUpdate/cheatcodesNavigationForceUpdate'
import { cheatcodesNavigationHomeButtons } from 'cheatcodes/pages/features/home/CheatcodesNavigationHome'
import { cheatcodesNavigationIdentityCheckButtons } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck'
import { cheatcodesNavigationInternalButtons } from 'cheatcodes/pages/features/internal/CheatcodesNavigationInternal'
import { cheatcodesNavigationProfileButtons } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { cheatcodesNavigationSubscriptionButtons } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { cheatcodesNavigationTrustedDeviceButtons } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { cheatcodesNavigationTutorialButtons } from 'cheatcodes/pages/features/tutorial/CheatcodesNavigationTutorial'
import { cheatcodesNavigationAccountManagementButtons } from 'cheatcodes/pages/others/CheatcodesNavigationAccountManagement'
import { cheatcodesNavigationErrorsButtons } from 'cheatcodes/pages/others/CheatcodesNavigationErrors'
import { cheatcodesNavigationSignUpButtons } from 'cheatcodes/pages/others/CheatcodesNavigationSignUp'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { env } from 'libs/environment/env'
import { eventMonitoring } from 'libs/monitoring/services'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

export function CheatcodesMenu(): React.JSX.Element {
  const [searchValue, setSearchValue] = useState('')
  const resetSearch = () => setSearchValue('')

  const { showInfoSnackBar } = useSnackBarContext()
  const onPressSentry = () => {
    const message = `SENTRY_${env.ENV}_TEST_${uuidv4().slice(0, 5)}`.toUpperCase()
    eventMonitoring.captureException(new Error(message))
    showInfoSnackBar({
      message: `L’erreur ${message} a été envoyé sur Sentry`,
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const featuresButtons: CheatcodesButtonsWithSubscreensProps[] = [
    ...cheatcodesNavigationAchievementsButtons,
    ...cheatcodesNavigationBookOfferButtons,
    ...cheatcodesNavigationCulturalSurveyButtons,
    ...cheatcodesNavigationHomeButtons,
    ...cheatcodesNavigationIdentityCheckButtons,
    ...cheatcodesNavigationInternalButtons,
    ...cheatcodesNavigationProfileButtons,
    ...cheatcodesNavigationSubscriptionButtons,
    ...cheatcodesNavigationTrustedDeviceButtons,
    ...cheatcodesNavigationTutorialButtons,
    ...cheatcodesNavigationForceUpdateButtons,
    { title: 'Share 🔗', screen: 'CheatcodesNavigationShare' },
    { title: 'RemoteBanner 🆒', screen: 'CheatcodesScreenRemoteBanner' },
  ]

  const otherButtons: CheatcodesButtonsWithSubscreensProps[] = [
    ...cheatcodesNavigationAccountManagementButtons,
    ...cheatcodesNavigationErrorsButtons,
    ...cheatcodesNavigationSignUpButtons,
    { title: 'AccesLibre 🌈', screen: 'CheatcodesScreenAccesLibre' },
    { title: 'Debug informations 🪲', screen: 'CheatcodesScreenDebugInformations' },
    { title: 'Envoyer une erreur Sentry 📤', onPress: onPressSentry },
    { title: 'Features flags 🏳️', screen: 'CheatcodesScreenFeatureFlags' },
    { title: 'Nouvelle-Calédonie 🇳🇨', screen: 'CheatcodesScreenNewCaledonia' },
    { title: 'Pages non écrans ❌', screen: 'CheatcodesNavigationNotScreensPages' },
    { title: 'Remote config 📊', screen: 'CheatcodesScreenRemoteConfig' },
  ]

  const filteredFeaturesButtons = filterAndSortCheatcodesButtons(searchValue, featuresButtons)
  const filteredOtherButtons = filterAndSortCheatcodesButtons(searchValue, otherButtons)

  return (
    <CheatcodesTemplateScreen title="Cheatcodes">
      <StyledSearchInput
        placeholder="Rechercher..."
        value={searchValue}
        onChangeText={setSearchValue}
        onPressRightIcon={resetSearch}
      />
      <StyledView>
        <SeparatorWithText label="FEATURES" />
      </StyledView>
      <CheatcodesButtonList buttons={filteredFeaturesButtons} />
      <StyledView>
        <SeparatorWithText label="AUTRES" />
      </StyledView>
      <CheatcodesButtonList buttons={filteredOtherButtons} />
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
