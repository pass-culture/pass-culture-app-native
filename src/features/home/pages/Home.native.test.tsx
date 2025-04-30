import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { RefreshResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { useHomepageData } from 'features/home/api/useHomepageData'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { storage } from 'libs/storage'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { Home } from './Home'

jest.mock('libs/network/NetInfoWrapper')

const mockShouldShowSkeleton = false

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => mockShouldShowSkeleton),
}))

jest.mock('ui/components/ModuleBanner/backgroundImageSource')

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: false })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

jest.mock('features/home/api/useHomepageData')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/location')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

useRoute.mockReturnValue({ params: undefined })

mockUseHomepageData.mockReturnValue({
  modules: [formattedVenuesModule],
  homeEntryId: 'fakeEntryId',
})

describe('Home page', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockServer.postApi<RefreshResponse>('/v1/refresh_access_token', {})
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    storage.clear('logged_in_session_count')
    storage.clear('has_seen_onboarding_subscription')
  })

  it('should render correctly', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
    })
    renderHome()
    await screen.findByText('Bienvenue !')

    expect(screen).toMatchSnapshot()
  })

  it('should log ConsultHome', async () => {
    useRoute.mockReturnValueOnce({ params: undefined })
    mockUseHomepageData.mockReturnValueOnce({
      modules: [formattedVenuesModule],
      id: 'fakeEntryId',
    })
    renderHome()
    await screen.findByText('Bienvenue !')

    expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: 'fakeEntryId' })
  })

  it('should display onboarding subscription modal on third logged in session', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    await storage.saveObject('logged_in_session_count', 1)
    renderHome()
    await screen.findByText('Bienvenue !')

    expect(screen.queryByText('Suis tes thèmes préférés')).not.toBeOnTheScreen()

    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    await storage.saveObject('logged_in_session_count', 2)
    renderHome()
    await screen.findByText('Bienvenue !')

    expect(screen.queryByText('Suis tes thèmes préférés')).not.toBeOnTheScreen()

    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    await storage.saveObject('logged_in_session_count', 3)
    renderHome()

    expect(await screen.findByText('Suis tes thèmes préférés')).toBeOnTheScreen()
  })

  it('should log analytics when onboarding subscription modal is displayed', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    await storage.saveObject('logged_in_session_count', 3)

    renderHome()

    await screen.findByText('Suis tes thèmes préférés')

    expect(analytics.logConsultSubscriptionModal).toHaveBeenCalledTimes(1)
  })

  it('should not display onboarding subscription modal on third logged in session when user is not currently logged in', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false })
    await storage.saveObject('logged_in_session_count', 3)

    renderHome()

    await screen.findByText('Bienvenue !')

    expect(screen.queryByText('Suis tes thèmes préférés')).not.toBeOnTheScreen()
  })

  it('should not display onboarding subscription modal when user has already seen it', async () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true })
    await storage.saveObject('logged_in_session_count', 3)
    await storage.saveObject('has_seen_onboarding_subscription', true)

    renderHome()

    await screen.findByText('Bienvenue !')

    expect(screen.queryByText('Suis tes thèmes préférés')).not.toBeOnTheScreen()
  })
})

function renderHome() {
  render(<Home />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
