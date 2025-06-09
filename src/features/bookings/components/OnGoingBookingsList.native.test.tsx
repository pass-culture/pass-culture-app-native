import React from 'react'
import { UseQueryResult } from 'react-query'

import { BookingsResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { bookingsSnap as mockBookings } from 'features/bookings/fixtures/index'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useBookingsQuery } from 'queries/bookings/index'
import { act, render, screen } from 'tests/utils'
import { showErrorSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { OnGoingBookingsList } from './OnGoingBookingsList'

jest.mock('queries/bookings/useBookingsQuery')
const mockUseBookings = jest.mocked(useBookingsQuery)
mockUseBookings.mockReturnValue({
  data: mockBookings,
  isLoading: false,
  isFetching: false,
} as unknown as UseQueryResult<BookingsResponse, unknown>)

jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = jest.mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

jest.mock('ui/components/snackBar/SnackBarContext', () =>
  jest.requireActual('ui/components/snackBar/__mocks__/SnackBarContext')
)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<OnGoingBookingsList /> - Analytics', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

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

  describe('offline', () => {
    it('should allow pull to refetch when netInfo.isConnected && netInfo.isInternetReachable', () => {
      const refetch = jest.fn()
      const loadingBookings = {
        data: {
          ended_bookings: [],
          ongoing_bookings: [],
          hasBookingsAfter18: false,
        } as BookingsResponse,
        isLoading: false,
        isFetching: false,
        refetch: refetch as unknown,
      } as UseQueryResult<BookingsResponse, unknown>
      mockUseBookings.mockReturnValueOnce(loadingBookings)
      renderOnGoingBookingsList()

      const flatList = screen.getByTestId('OnGoingBookingsList')

      expect(flatList).toBeDefined()
      expect(flatList.props.onRefresh).toBeDefined()
    })

    it('should show snack bar error when trying to pull to refetch with message "Impossible de recharger tes réservations, connecte-toi à internet pour réessayer."', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: false,
      })
      const refetch = jest.fn()
      const loadingBookings = {
        data: {
          ended_bookings: [],
          ongoing_bookings: [],
          hasBookingsAfter18: false,
        } as BookingsResponse,
        isLoading: false,
        isFetching: false,
        refetch: refetch as unknown,
      } as UseQueryResult<BookingsResponse, unknown>
      mockUseBookings.mockReturnValueOnce(loadingBookings)
      renderOnGoingBookingsList()

      const flatList = screen.getByTestId('OnGoingBookingsList')

      expect(flatList).toBeDefined()

      await act(async () => {
        flatList.props.onRefresh()
      })

      expect(showErrorSnackBar).toHaveBeenCalledWith({
        message: `Impossible de recharger tes réservations, connecte-toi à internet pour réessayer.`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  describe('displays the placeholder', () => {
    it('when bookings are loading', () => {
      const loadingBookings = {
        data: undefined,
        isLoading: true,
        isFetching: false,
      } as UseQueryResult<BookingsResponse, unknown>
      mockUseBookings.mockReturnValueOnce(loadingBookings)
      renderOnGoingBookingsList()

      const placeholder = screen.queryByTestId('BookingsPlaceholder')

      expect(placeholder).toBeOnTheScreen()
    })

    it('when subcategories are loading', () => {
      const loadingSubcategories = {
        isLoading: true,
      } as UseQueryResult<SubcategoriesResponseModelv2, unknown>
      mockUseSubcategories.mockReturnValueOnce(loadingSubcategories)
      renderOnGoingBookingsList()

      const placeholder = screen.queryByTestId('BookingsPlaceholder')

      expect(placeholder).toBeOnTheScreen()
    })
  })

  it('should trigger logEvent "BookingsScrolledToBottom" when reaching the end', () => {
    renderOnGoingBookingsList()
    const flatList = screen.getByTestId('OnGoingBookingsList')

    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })

    expect(analytics.logBookingsScrolledToBottom).not.toHaveBeenCalled()

    flatList.props.onScroll({ nativeEvent: nativeEventBottom })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "BookingsScrolledToBottom" only once', () => {
    renderOnGoingBookingsList()
    const flatList = screen.getByTestId('OnGoingBookingsList')

    // 1st scroll to bottom => trigger
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)

    // 2nd scroll to bottom => NOT trigger
    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})

function renderOnGoingBookingsList() {
  render(<OnGoingBookingsList />)
}
