import React from 'react'

import * as showSkeletonAPI from 'features/home/api/useShowSkeleton'
import { ProcessedModule } from 'features/home/contentful/moduleTypes'
import { GenericHome } from 'features/home/pages/GenericHome'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { BatchUser } from 'libs/react-native-batch'
import { flushAllPromises, render } from 'tests/utils'
import { Typo } from 'ui/theme'

const useShowSkeletonSpy = jest.spyOn(showSkeletonAPI, 'useShowSkeleton')

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

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
] as ProcessedModule[]

const homeEntryId = 'fake-entry-id'
const Header = <Typo.Title1>Header</Typo.Title1>

describe('GenericHome', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  useShowSkeletonSpy.mockReturnValue(false)

  afterEach(jest.clearAllMocks)

  it('should render skeleton when useShowSkeleton is true', () => {
    useShowSkeletonSpy.mockReturnValueOnce(true)
    const home = render(<GenericHome modules={modules} Header={Header} homeEntryId={homeEntryId} />)
    expect(home).toMatchSnapshot()
  })

  it('should render modules when useShowSkeleton is false', () => {
    const home = render(<GenericHome modules={modules} Header={Header} homeEntryId={homeEntryId} />)
    expect(home).toMatchSnapshot()
  })

  it('should render offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    const { getByText } = render(
      <GenericHome modules={modules} Header={Header} homeEntryId={homeEntryId} />
    )
    expect(getByText('Pas de réseau internet')).toBeTruthy()
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
    const { getByTestId } = render(
      <GenericHome modules={modules} Header={Header} homeEntryId={homeEntryId} />
    )
    const scrollView = getByTestId('homeBodyScrollView')

    scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
    expect(BatchUser.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage')
  })

  it('should trigger logEvent "AllModulesSeen" only once', () => {
    const { getByTestId } = render(
      <GenericHome modules={modules} Header={Header} homeEntryId={homeEntryId} />
    )
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
