import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { BookingsResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { bookingsSnap as mockBookings } from 'features/bookings/fixtures/bookingsSnap'
import { analytics } from 'libs/firebase/analytics'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { flushAllPromises, render, act } from 'tests/utils'
import { showErrorSnackBar } from 'ui/components/snackBar/__mocks__/SnackBarContext'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { OnGoingBookingsList } from './OnGoingBookingsList'

jest.mock('react-query')

jest.mock('features/bookings/api')
const mockUseBookings = mocked(useBookings)
mockUseBookings.mockReturnValue({
  data: mockBookings,
  isLoading: false,
  isFetching: false,
} as UseQueryResult<BookingsResponse, unknown>)

jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.mock('ui/components/snackBar/SnackBarContext', () =>
  jest.requireActual('ui/components/snackBar/__mocks__/SnackBarContext')
)
describe('<OnGoingBookingsList /> - Analytics', () => {
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
        } as BookingsResponse,
        isLoading: false,
        isFetching: false,
        refetch: refetch as unknown,
      } as UseQueryResult<BookingsResponse, unknown>
      mockUseBookings.mockReturnValueOnce(loadingBookings)
      const { getByTestId } = render(<OnGoingBookingsList />)

      const flatList = getByTestId('OnGoingBookingsList')
      expect(flatList).toBeDefined()
      expect(flatList.props.onRefresh).toBeDefined()
    })
    it('should show snack bar error when trying to pull to refetch with message "Impossible de recharger tes réservations, connecte-toi à internet pour réessayer."', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
      const refetch = jest.fn()
      const loadingBookings = {
        data: {
          ended_bookings: [],
          ongoing_bookings: [],
        } as BookingsResponse,
        isLoading: false,
        isFetching: false,
        refetch: refetch as unknown,
      } as UseQueryResult<BookingsResponse, unknown>
      mockUseBookings.mockReturnValueOnce(loadingBookings)
      const { getByTestId } = render(<OnGoingBookingsList />)

      const flatList = getByTestId('OnGoingBookingsList')
      expect(flatList).toBeDefined()

      await act(async () => {
        flatList.props.onRefresh()
      })
      expect(showErrorSnackBar).toBeCalledWith({
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
      const { queryByTestId } = render(<OnGoingBookingsList />)

      const placeholder = queryByTestId('BookingsPlaceholder')

      expect(placeholder).toBeTruthy()
    })

    it('when subcategories are loading', () => {
      const loadingSubcategories = {
        isLoading: true,
      } as UseQueryResult<SubcategoriesResponseModelv2, unknown>
      mockUseSubcategories.mockReturnValueOnce(loadingSubcategories)
      const { queryByTestId } = render(<OnGoingBookingsList />)

      const placeholder = queryByTestId('BookingsPlaceholder')

      expect(placeholder).toBeTruthy()
    })
  })

  it('should trigger logEvent "BookingsScrolledToBottom" when reaching the end', () => {
    const { getByTestId } = render(<OnGoingBookingsList />)
    const flatList = getByTestId('OnGoingBookingsList')

    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logBookingsScrolledToBottom).not.toHaveBeenCalled()

    flatList.props.onScroll({ nativeEvent: nativeEventBottom })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "BookingsScrolledToBottom" only once', () => {
    const { getByTestId } = render(<OnGoingBookingsList />)
    const flatList = getByTestId('OnGoingBookingsList')

    // 1st scroll to bottom => trigger
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)

    // 2nd scroll to bottom => NOT trigger
    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })
    flushAllPromises()

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})
