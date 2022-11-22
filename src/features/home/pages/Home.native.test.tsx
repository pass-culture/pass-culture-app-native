import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { UserProfileResponse } from 'api/gen'
import { useHomepageData } from 'features/home/api'
import { env } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { BatchUser } from 'libs/react-native-batch'
import { flushAllPromises, render, waitFor } from 'tests/utils'

import { Home } from './Home'

jest.mock('features/home/api/useShowSkeleton', () => ({
  useShowSkeleton: jest.fn(() => false),
}))

let mockUserProfileInfo: Partial<UserProfileResponse> | undefined = undefined
jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: mockUserProfileInfo })),
}))

jest.mock('features/home/api')
const mockUseHomepageData = useHomepageData as jest.Mock

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

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
  beforeEach(() => {
    mockUserProfileInfo = {
      email: 'email@domain.ext',
      firstName: 'Jean',
      isBeneficiary: true,
      depositExpirationDate: '2023-02-16T17:16:04.735235',
      domainsCredit: {
        all: { initial: 50000, remaining: 49600 },
        physical: { initial: 20000, remaining: 0 },
        digital: { initial: 20000, remaining: 19600 },
      },
    }
  })

  it('should render skeleton when there are no modules to display', () => {
    mockUseHomepageData.mockReturnValueOnce({
      modules: [],
      homeEntryId: 'fake-entry-id',
      thematicHeader: { title: 'HeaderTitle', subtitle: 'HeaderSubtitle' },
    })

    const home = render(<Home />)
    expect(home).toMatchSnapshot()
  })

  it('should render correctly without login modal', async () => {
    mockUserProfileInfo = undefined
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { toJSON } = render(<Home />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should have a welcome message', async () => {
    mockUserProfileInfo = undefined
    const { getByText } = render(<Home />)
    await waitFor(() => getByText('Bienvenue\u00a0!'))
  })

  it('should have a personalized welcome message when user is logged in', async () => {
    const { getByText } = render(<Home />)

    await waitFor(() => getByText('Bonjour Jean'))
  })

  it('should show the available credit to the user - remaining', async () => {
    const { getByText } = render(<Home />)

    await waitFor(() => getByText('Tu as 496\u00a0€ sur ton pass'))
  })

  it('should show the available credit to the user - expired', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mockUserProfileInfo!.depositExpirationDate = '2020-02-16T17:16:04.735235'
    const { queryByText, getByText } = render(<Home />)
    await waitFor(() => {
      expect(getByText('Ton crédit est expiré')).toBeTruthy()
      expect(queryByText('Tu as 496\u00a0€ sur ton pass')).toBeNull()
    })
  })

  it('should show the available credit to the user - not logged in', async () => {
    mockUserProfileInfo = undefined
    const { queryByText } = render(<Home />)
    await waitFor(() => {
      expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
    })
  })

  it('should show the available credit to the user - not beneficiary', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mockUserProfileInfo!.isBeneficiary = false
    const { queryByText } = render(<Home />)
    await waitFor(() => {
      expect(queryByText('Toute la culture à portée de main')).toBeTruthy()
    })
  })

  it('should not have code push button', async () => {
    const { queryByText } = render(<Home />)
    await waitFor(() => {
      expect(queryByText('Check update')).toBeNull()
    })
  })

  it('should have CheatMenu button when FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=true', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = true
    const { queryByText } = render(<Home />)
    await waitFor(() => {
      expect(queryByText('CheatMenu')).toBeTruthy()
    })
  })

  it('should NOT have CheatMenu button when NOT FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING=false', async () => {
    env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING = false
    const { queryByText } = render(<Home />)
    expect(queryByText('CheatMenu')).toBeNull()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const renderAPI = render(<Home />)
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

    const home = render(<Home />)
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
    const { getByTestId } = render(<Home />)
    const scrollView = getByTestId('homeBodyScrollView')

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
    expect(BatchUser.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage')
  })

  it('should trigger logEvent "AllModulesSeen" only once', () => {
    const { getByTestId } = render(<Home />)
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
