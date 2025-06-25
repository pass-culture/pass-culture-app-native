// CheatcodesMenu.tsx (Refactored)

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
import { cheatcodesNavigationForceUpdateButtons } from 'cheatcodes/pages/features/forceUpdate/CheatcodesNavigationForceUpdate'
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
import { CheatcodeCategory } from 'cheatcodes/types'
import { env } from 'libs/environment/env'
import { eventMonitoring } from 'libs/monitoring/services'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { getSpacing } from 'ui/theme'

// --- The filtering and sorting function becomes much simpler ---
const isMatching = (searchValue: string, str: string): boolean =>
  str.toLowerCase().includes(searchValue.toLowerCase())

const filterAndSortCheatcodes = (
  searchValue: string,
  categories: CheatcodeCategory[]
): CheatcodeCategory[] =>
  categories
    .map((category): CheatcodeCategory | null => {
      // Filter the subscreens first
      const filteredSubscreens = category.subscreens.filter(
        (subscreen) => !subscreen.showOnlyInSearch && isMatching(searchValue, subscreen.title)
      )

      // The category is a match if its title matches, OR if it has matching subscreens
      const isCategoryMatching =
        isMatching(searchValue, category.title) || filteredSubscreens.length > 0

      if (!isCategoryMatching) {
        return null
      }

      // If searching, show only the matching subscreens. If not searching, show none.
      // The parent button will handle navigation. Subscreens are for search discovery.
      return {
        ...category,
        subscreens: searchValue ? filteredSubscreens : [],
      }
    })
    .filter((category): category is CheatcodeCategory => category !== null)
    .sort((a, b) => a.title.localeCompare(b.title))

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

  // --- Button definitions are now strongly typed and clearer ---
  // NOTE: You'll need to refactor the imported button arrays to follow this new structure.
  const featuresButtons: CheatcodeCategory[] = [
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
    {
      id: uuidv4(),
      title: 'RemoteBanners 🆒',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenRemoteBanners' },
      },
      subscreens: [],
    },
    {
      id: uuidv4(),
      title: 'Share 🔗',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesNavigationShare' },
      },
      subscreens: [],
    },
    {
      id: uuidv4(),
      title: 'Maintenance 🔗',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenMaintenance' },
      },
      subscreens: [],
    },
  ]

  const otherButtons: CheatcodeCategory[] = [
    ...cheatcodesNavigationAccountManagementButtons,
    ...cheatcodesNavigationErrorsButtons,
    ...cheatcodesNavigationGenericPagesButtons,
    ...cheatcodesNavigationSignUpButtons,
    {
      id: uuidv4(),
      title: 'AccesLibre 🌈',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenAccesLibre' },
      },
      subscreens: [],
    },
    {
      id: uuidv4(),
      title: 'Debug informations 🪲',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenDebugInformations' },
      },
      subscreens: [],
    },
    {
      id: uuidv4(),
      title: 'Envoyer une erreur Sentry 📤',
      onPress: onPressSentry,
      subscreens: [],
    },
    // Example of a category with a subscreen
    {
      id: uuidv4(),
      title: 'Feature Flags & Remote Config',
      // This parent button could navigate somewhere itself, or do nothing.
      // Here, it's just a container.
      subscreens: [
        {
          id: uuidv4(),
          title: 'Features flags 🏳️',
          navigationTarget: {
            screen: 'CheatcodesStackNavigator',
            params: { screen: 'CheatcodesScreenFeatureFlags' },
          },
        },
        {
          id: uuidv4(),
          title: 'Remote config 📊',
          navigationTarget: {
            screen: 'CheatcodesStackNavigator',
            params: { screen: 'CheatcodesScreenRemoteConfig' },
          },
        },
      ],
    },
  ]

  const filteredFeaturesButtons = filterAndSortCheatcodes(searchValue, featuresButtons)
  const filteredOtherButtons = filterAndSortCheatcodes(searchValue, otherButtons)

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
