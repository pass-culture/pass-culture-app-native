import React from 'react'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { BookingsResponse, SubcategoriesResponseModel } from 'api/gen'
import { useBookings } from 'features/bookings/api/queries'
import { analytics } from 'libs/analytics'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { flushAllPromises, render } from 'tests/utils'

import { bookingsSnap as mockBookings } from '../api/bookingsSnap'

import { OnGoingBookingsList } from './OnGoingBookingsList'

jest.mock('react-query')

jest.mock('features/bookings/api/queries')
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
} as UseQueryResult<SubcategoriesResponseModel, unknown>)

describe('<OnGoingBookingsList /> - Analytics', () => {
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
      } as UseQueryResult<SubcategoriesResponseModel, unknown>
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
