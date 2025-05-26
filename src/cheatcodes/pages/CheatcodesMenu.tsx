import React, { useState } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesButtonList } from 'cheatcodes/components/CheatcodesButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { cheatcodesNavigationAchievementsButtons } from 'cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements'
import { cheatcodesNavigationBirthdayNotificationsButtons } from 'cheatcodes/pages/features/birthdayNotifications/CheatcodesNavigationBirthdayNotifications'
import { cheatcodesNavigationBookingsButtons } from 'cheatcodes/pages/features/bookings/CheatcodesNavigationBookings'
import { cheatcodesNavigationBookOfferButtons } from 'cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer'
import { cheatcodesNavigationCulturalSurveyButtons } from 'cheatcodes/pages/features/culturalSurvey/CheatcodesNavigationCulturalSurvey'
import { cheatcodesNavigationForceUpdateButtons } from 'cheatcodes/pages/features/forceUpdate/cheatcodesNavigationForceUpdate'
import { cheatcodesNavigationHomeButtons } from 'cheatcodes/pages/features/home/CheatcodesNavigationHome'
import { cheatcodesNavigationIdentityCheckButtons } from 'cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck'
import { cheatcodesNavigationInternalButtons } from 'cheatcodes/pages/features/internal/CheatcodesNavigationInternal'
import { cheatcodesNavigationOnboardingButtons } from 'cheatcodes/pages/features/onboarding/CheatcodesNavigationOnboarding'
import { cheatcodesNavigationProfileButtons } from 'cheatcodes/pages/features/profile/CheatcodesNavigationProfile'
import { cheatcodesNavigationSubscriptionButtons } from 'cheatcodes/pages/features/subscription/CheatcodesNavigationSubscription'
import { cheatcodesNavigationTrustedDeviceButtons } from 'cheatcodes/pages/features/trustedDevice/CheatcodesNavigationTrustedDevice'
import { cheatcodesNavigationAccountManagementButtons } from 'cheatcodes/pages/others/CheatcodesNavigationAccountManagement'
import { cheatcodesNavigationErrorsButtons } from 'cheatcodes/pages/others/CheatcodesNavigationErrors'
import { cheatcodesNavigationGenericPagesButtons } from 'cheatcodes/pages/others/CheatcodesNavigationGenericPages'
import { cheatcodesNavigationSignUpButtons } from 'cheatcodes/pages/others/CheatcodesNavigationSignUp'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { env } from 'libs/environment/env'
import { eventMonitoring } from 'libs/monitoring/services'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

const isMatching = (searchValue: string, str?: string): boolean =>
  (str ?? '').toLowerCase().includes(searchValue.toLowerCase())

const filterAndSortCheatcodesButtons = (
  searchValue: string,
  buttons: CheatcodesButtonsWithSubscreensProps[]
): CheatcodesButtonsWithSubscreensProps[] =>
  buttons
    .filter((button) => button.title || button.screen)
    .map((button): CheatcodesButtonsWithSubscreensProps | null => {
      const filteredSubscreens = button.subscreens?.filter(
        (subscreen) =>
          isMatching(searchValue, subscreen.title) || isMatching(searchValue, subscreen.screen)
      )
      const isButtonMatching =
        isMatching(searchValue, button.title) ||
        isMatching(searchValue, button.screen) ||
        (filteredSubscreens && filteredSubscreens.length > 0)
      return isButtonMatching
        ? { ...button, subscreens: searchValue ? filteredSubscreens : [] }
        : null
    })
    .filter((button): button is CheatcodesButtonsWithSubscreensProps => button !== null)
    .sort((a, b) =>
      (a.title || a.screen || 'sans titre').localeCompare(b.title || b.screen || 'sans titre')
    )

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
    ...cheatcodesNavigationBirthdayNotificationsButtons,
    ...cheatcodesNavigationBookOfferButtons,
    ...cheatcodesNavigationBookingsButtons,
    ...cheatcodesNavigationCulturalSurveyButtons,
    ...cheatcodesNavigationForceUpdateButtons,
    ...cheatcodesNavigationHomeButtons,
    ...cheatcodesNavigationIdentityCheckButtons,
    ...cheatcodesNavigationInternalButtons,
    ...cheatcodesNavigationProfileButtons,
    ...cheatcodesNavigationSubscriptionButtons,
    ...cheatcodesNavigationTrustedDeviceButtons,
    ...cheatcodesNavigationOnboardingButtons,
    { title: 'RemoteBanners 🆒', screen: 'CheatcodesScreenRemoteBanners', subscreens: [] },
    { title: 'Share 🔗', screen: 'CheatcodesNavigationShare', subscreens: [] },
    { title: 'Maintenance 🔗', screen: 'CheatcodesScreenMaintenance', subscreens: [] },
  ]

  const otherButtons: CheatcodesButtonsWithSubscreensProps[] = [
    ...cheatcodesNavigationAccountManagementButtons,
    ...cheatcodesNavigationErrorsButtons,
    ...cheatcodesNavigationGenericPagesButtons,
    ...cheatcodesNavigationSignUpButtons,
    { title: 'AccesLibre 🌈', screen: 'CheatcodesScreenAccesLibre', subscreens: [] },
    { title: 'Debug informations 🪲', screen: 'CheatcodesScreenDebugInformations', subscreens: [] },
    { title: 'Envoyer une erreur Sentry 📤', onPress: onPressSentry, subscreens: [] },
    { title: 'Features flags 🏳️', screen: 'CheatcodesScreenFeatureFlags', subscreens: [] },
    { title: 'Loading page ⌛', screen: 'CheatcodeScreenLoadingPage', subscreens: [] },
    { title: 'Nouvelle-Calédonie 🇳🇨', screen: 'CheatcodesScreenNewCaledonia', subscreens: [] },
    { title: 'Pages non écrans ❌', screen: 'CheatcodesNavigationNotScreensPages', subscreens: [] },
    { title: 'Remote config 📊', screen: 'CheatcodesScreenRemoteConfig', subscreens: [] },
    { title: 'LayoutExpiredLink 🔗', screen: 'CheatcodesScreenLayoutExpiredLink', subscreens: [] },
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
