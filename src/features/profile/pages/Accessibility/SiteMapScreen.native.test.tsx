import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { getTabHookConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { SiteMapScreen } from './SiteMapScreen'

jest.mock('libs/jwt/jwt')

jest.mock('libs/subcategories/useSubcategories')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockUseSearch = jest.fn(() => ({
  searchState: initialSearchState,
  dispatch: jest.fn(),
  hideSuggestions: jest.fn(),
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const user = userEvent.setup()
jest.useFakeTimers()

describe('SiteMapScreen', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    await screen.findByText('Plan du site')

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to home when press "Accueil" button', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    await screen.findByText('Plan du site')

    const homeButton = screen.getByText('Accueil')
    await user.press(homeButton)

    expect(navigate).toHaveBeenCalledWith(...getTabHookConfig('Home'))
  })

  it('should navigate to thematic search "Cinema" when press "Cinéma" button', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    await screen.findByText('Plan du site')

    const notificationsSettingsButton = screen.getByText('Cinéma')
    await user.press(notificationsSettingsButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          searchId: 'testUuidV4',
          isFullyDigitalOffersCategory: false,
          offerCategories: ['CINEMA'],
        },
        screen: 'ThematicSearch',
      },
      screen: 'SearchStackNavigator',
    })
  })

  it('should navigate to notifications settings when press "Notifications" button', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    await screen.findByText('Plan du site')

    const notificationsSettingsButton = screen.getByText('Notifications')
    await user.press(notificationsSettingsButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      screen: 'NotificationsSettings',
      params: undefined,
    })
  })
})
