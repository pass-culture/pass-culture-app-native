import React from 'react'

import * as showSkeletonAPI from 'features/home/api/useShowSkeleton'
import { formattedVenuesModule } from 'features/home/fixtures/homepage.fixture'
import { GenericHome } from 'features/home/pages/GenericHome'
import { analytics } from 'libs/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { BatchUser } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, waitFor, screen, fireEvent, act } from 'tests/utils'
import { Typo } from 'ui/theme'

const useShowSkeletonSpy = jest.spyOn(showSkeletonAPI, 'useShowSkeleton').mockReturnValue(false)

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const defaultModules = [formattedVenuesModule]
const homeId = 'fake-id'
const Header = <Typo.Title1>Header</Typo.Title1>

const mockStartTransaction = jest.fn()
const mockFinishTransaction = jest.fn()
jest.mock('shared/performance/transactions', () => {
  const originalModule = jest.requireActual('shared/performance/transactions')

  return {
    ...originalModule,
    startTransaction: (s: string) => {
      mockStartTransaction(s)
    },
    finishTransaction: (s: string) => {
      mockFinishTransaction(s)
    },
  }
})

describe('GenericHome', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true })

  describe('With not displayed skeleton by default', () => {
    it('should display skeleton', async () => {
      useShowSkeletonSpy.mockReturnValueOnce(true)
      renderGenericHome()
      await act(async () => {})

      expect(screen).toMatchSnapshot()
    })

    it('should display real content', async () => {
      renderGenericHome()
      await act(async () => {})

      await waitFor(() => {
        expect(screen).toMatchSnapshot()
      })
    })

    it('should display offline page when not connected', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      renderGenericHome()

      expect(await screen.findByText('Pas de réseau internet')).toBeOnTheScreen()
    })
  })

  describe('With displayed skeleton by default', () => {
    beforeAll(() => {
      useShowSkeletonSpy.mockReturnValue(true)
    })

    afterAll(() => {
      useShowSkeletonSpy.mockReturnValue(false)
    })

    it('should finish home component creation performance transaction when component created', async () => {
      renderGenericHome()

      await act(async () => {})

      await waitFor(() => {
        expect(mockFinishTransaction).toHaveBeenCalledTimes(1)
      })
    })

    it('should finish home loading performance transaction when home page loaded', async () => {
      renderGenericHome()

      await act(async () => {})

      // home component creation performance transaction
      expect(mockFinishTransaction).toHaveBeenCalledTimes(1)

      useShowSkeletonSpy.mockReturnValueOnce(false)
      // home component creation performance transaction + home loading performance transaction
      screen.rerender(
        reactQueryProviderHOC(
          <GenericHome modules={defaultModules} Header={Header} homeId={homeId} />
        )
      )

      await act(async () => {})

      expect(mockFinishTransaction).toHaveBeenCalledTimes(2)
    })
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
    const scrollView = screen.getByTestId('homeBodyScrollView')

    scrollView.props.onScroll(scrollEventMiddle)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
    expect(BatchUser.trackEvent).not.toHaveBeenCalled()

    scrollView.props.onScroll(scrollEventBottom)

    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_seen_all_the_homepage')
    })
  })

  it('should trigger logEvent "AllModulesSeen"', async () => {
    renderGenericHome()
    const scrollView = screen.getByTestId('homeBodyScrollView')

    fireEvent.scroll(scrollView, scrollEventBottom)

    await waitFor(() => {
      expect(analytics.logAllModulesSeen).toHaveBeenCalledWith(1)
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

    jest.clearAllMocks()

    // 2nd scroll to bottom => NOT trigger
    scrollView.props.onScroll(scrollEventMiddle)
    scrollView.props.onScroll(scrollEventBottom)

    expect(analytics.logAllModulesSeen).not.toHaveBeenCalled()
  })

  it('should display spinner when end is reached', async () => {
    // To simulate progressive loading we need at least 11 modules
    const modules = [
      formattedVenuesModule,
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
      { ...formattedVenuesModule, id: Math.random().toString() },
    ]
    renderGenericHome(modules)

    await act(async () => {
      const scrollView = screen.queryByTestId('homeBodyScrollView')
      scrollView?.props.onScroll(scrollEventBottom)
    })

    expect(await screen.findByTestId('spinner')).toBeOnTheScreen()
  })
})

function renderGenericHome(modules = defaultModules) {
  return render(
    reactQueryProviderHOC(<GenericHome modules={modules} Header={Header} homeId={homeId} />)
  )
}
