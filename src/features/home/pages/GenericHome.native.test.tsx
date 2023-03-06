import React from 'react'

import * as showSkeletonAPI from 'features/home/api/useShowSkeleton'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { GenericHome } from 'features/home/pages/GenericHome'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { BatchUser } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor, screen } from 'tests/utils'
import { Typo } from 'ui/theme'

const useShowSkeletonSpy = jest.spyOn(showSkeletonAPI, 'useShowSkeleton')

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const modules = [formattedVenuesModule]
const homeId = 'fake-id'
const Header = <Typo.Title1>Header</Typo.Title1>

// jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')

describe('GenericHome', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })
  useShowSkeletonSpy.mockReturnValue(false)

  it('should display skeleton', async () => {
    useShowSkeletonSpy.mockReturnValueOnce(true)
    const home = renderGenericHome()
    await screen.findByTestId('homeBodyScrollView')
    expect(home).toMatchSnapshot()
  })

  it('should display real content', async () => {
    const home = renderGenericHome()
    await screen.findByTestId('homeBodyScrollView')
    expect(home).toMatchSnapshot()
  })

  it('should display offline page when not connected', () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
    renderGenericHome()
    expect(screen.getByText('Pas de réseau internet')).toBeTruthy()
  })
})

describe('GenericHome page - Analytics', () => {
  const scrollEventMiddle = {
    nativeEvent: {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 400 }, // how far did we scroll
      contentSize: { height: 1600 },
    },
    persist: jest.fn(),
  }
  const scrollEventBottom = {
    nativeEvent: {
      layoutMeasurement: { height: 1000 },
      contentOffset: { y: 900 },
      contentSize: { height: 1600 },
    },
    persist: jest.fn(),
  }

  it('should trigger logEvent "AllModulesSeen" when reaching the end', async () => {
    renderGenericHome()
    const scrollView = await screen.findByTestId('homeBodyScrollView')

    scrollView.props.onScroll(scrollEventMiddle)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
    expect(BatchUser.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll(scrollEventBottom)

    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage')
    })
  })

  it('should trigger logEvent "AllModulesSeen" only once', async () => {
    renderGenericHome()
    const scrollView = await screen.findByTestId('homeBodyScrollView')

    // 1st scroll to bottom => trigger
    scrollView.props.onScroll(scrollEventBottom)
    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
    })

    jest.clearAllMocks() // pourquoi on a ce truc au milieu du test o_O

    // 2nd scroll to bottom => NOT trigger
    scrollView.props.onScroll(scrollEventMiddle)
    scrollView.props.onScroll(scrollEventBottom)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })
})

function renderGenericHome() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<GenericHome modules={modules} Header={Header} homeId={homeId} />)
  )
}
