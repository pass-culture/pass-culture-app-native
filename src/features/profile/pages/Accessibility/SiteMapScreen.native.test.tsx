import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { SiteMapScreen } from 'features/profile/pages/Accessibility/SiteMapScreen'
import { initialSearchState } from 'features/search/context/reducer'
import { nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/jwt/jwt')

jest.mock('libs/subcategories/useSubcategories')

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const baseAuthContext = {
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
  user: {
    ...nonBeneficiaryUser,
    isEligibleForBeneficiaryUpgrade: false,
    currency: CurrencyEnum.EUR,
  },
}

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = jest.mocked(useAuthContext)
mockUseAuthContext.mockReturnValue({ ...baseAuthContext, isLoggedIn: true })

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

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: { params: undefined, screen: 'Home' },
      screen: 'TabNavigator',
    })
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

  it('should render the correct count of list item when user connected', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    const connectionLinkLabel = screen.getByLabelText(
      'Profil – Liste - Élément 2 sur 12 - Se connecter'
    )

    expect(connectionLinkLabel).toBeOnTheScreen()
  })

  it('should render the correct count of list item when user is not connected', async () => {
    mockUseAuthContext.mockReturnValueOnce({ ...baseAuthContext, isLoggedIn: false })

    render(reactQueryProviderHOC(<SiteMapScreen />))

    const connectionLinkLabel = screen.getByLabelText(
      'Profil – Liste - Élément 2 sur 9 - Se connecter'
    )

    expect(connectionLinkLabel).toBeOnTheScreen()
  })
})
