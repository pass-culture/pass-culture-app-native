import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { useHomepageData } from 'features/home/api'
import { useAvailableCredit } from 'features/user/helpers/useAvailableCredit'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { BatchUser } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises, render, waitFor } from 'tests/utils'

import { Home } from './Home'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

jest.mock('features/home/api')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/user/helpers/useAvailableCredit')
const mockUseAvailableCredit = useAvailableCredit as jest.MockedFunction<typeof useAvailableCredit>

jest.mock('libs/geolocation')

const modules = [
  {
    search: [
      {
        categories: ['Livres'],
        hitsPerPage: 10,
        isDigital: false,
        isGeolocated: false,
        title: 'Playlist de livres',
      },
    ],
    display: {
      layout: 'two-items',
      minOffers: 1,
      subtitle: 'Un sous-titre',
      title: 'Playlist de livres',
    },
    moduleId: '1M8CiTNyeTxKsY3Gk9wePI',
  },
]

describe('Home component', () => {
  useRoute.mockReturnValue({ params: {} })

  mockUseHomepageData.mockReturnValue({
    modules,
    homeEntryId: 'fakeEntryId',
  })
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  afterEach(jest.clearAllMocks)

  it('should render skeleton when there are no modules to display', () => {
    mockUseHomepageData.mockReturnValueOnce({
      modules: [],
      homeEntryId: 'fake-entry-id',
      thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
    })
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: beneficiaryUser })
    mockUseAvailableCredit.mockReturnValueOnce({ amount: 49600, isExpired: false })

    const home = renderHome()
    expect(home).toMatchSnapshot()
  })

  it('should render correctly without login modal', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
    })
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { toJSON } = renderHome()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should have a welcome message', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: false,
    })
    const { getByText } = renderHome()
    await waitFor(() => getByText('Bienvenue\u00a0!'))
  })

  it('should have a personalized welcome message when user is logged in', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: beneficiaryUser,
      isUserLoading: false,
    })
    const { getByText } = renderHome()

    await waitFor(() => getByText('Bonjour Jean'))
  })

  it('should show the available credit to the user - remaining', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: {
        ...beneficiaryUser,
        domainsCredit: {
          all: { initial: 49600, remaining: 49600 },
        },
      },
      isUserLoading: false,
    })
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAvailableCredit.mockReturnValue({ amount: 49600, isExpired: false })
    const { getByText } = renderHome()

    await waitFor(() => getByText('Tu as 496\u00a0€ sur ton pass'))
    mockUseAvailableCredit.mockReset()
  })

  it('should show the available credit to the user - expired', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: { ...beneficiaryUser, depositExpirationDate: '2020-02-16T17:16:04.735235' },
      isUserLoading: false,
    })
    const { queryByText, getByText } = renderHome()
    await waitFor(() => {
      expect(getByText('Ton crédit est expiré')).toBeTruthy()
      expect(queryByText('Tu as 496\u00a0€ sur ton pass')).toBeNull()
    })
  })

  it('should show the available credit to the user - not logged in', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
    })
    const { queryByText } = renderHome()
    await waitFor(() => {
      expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
    })
  })

  it('should show the available credit to the user - not beneficiary', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: nonBeneficiaryUser,
      isUserLoading: false,
    })
    const { queryByText } = renderHome()
    await waitFor(() => {
      expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
    })
  })

  it('should not have code push button', async () => {
    const { queryByText } = renderHome()
    await waitFor(() => {
      expect(queryByText('Check update')).toBeNull()
    })
  })

  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const { queryByText } = renderHome()
    await waitFor(() => {
      expect(queryByText('CheatMenu')).toBeTruthy()
    })
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { queryByText } = renderHome()
    expect(queryByText('CheatMenu')).toBeNull()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const renderAPI = renderHome()
    expect(renderAPI.queryByText('Pas de réseau internet')).toBeTruthy()
  })
})

describe('Home N-1', () => {
  it('should render correctly', () => {
    useRoute.mockReturnValueOnce({ params: { entryId: 'fake-entry-id' } })
    mockUseHomepageData.mockReturnValueOnce({
      modules,
      homeEntryId: 'fakeEntryId',
      thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
    })

    const home = renderHome()
    expect(home).toMatchSnapshot()
  })
})

describe('Home component - Analytics', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }

  it('should trigger logEvent "AllModulesSeen" when reaching the end', () => {
    const { getByTestId } = renderHome()
    const scrollView = getByTestId('homeBodyScrollView')

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
    expect(BatchUser.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage')
  })

  it('should trigger logEvent "AllModulesSeen" only once', () => {
    const { getByTestId } = renderHome()
    const scrollView = getByTestId('homeBodyScrollView')

    // 1st scroll to bottom => trigger
    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)

    jest.clearAllMocks()

    // 2nd scroll to bottom => NOT trigger
    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    flushAllPromises()
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })
})

function renderHome() {
  return render(<Home />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
