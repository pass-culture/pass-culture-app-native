import React from 'react'
import { QueryObserverResult, UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse, SubcategoriesResponseModelv2 } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, fireEvent, render, waitFor, screen, act } from 'tests/utils/web'

import { Bookings } from './Bookings'

jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = jest.mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

describe('Bookings', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderBookings(bookingsSnap)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

  it('should always execute the query (in cache or in network)', async () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderBookings(bookingsSnap)

    await waitFor(() => {
      expect(useBookings).toHaveBeenCalledTimes(1)
    })
  })

  it('should display the right number of ongoing bookings', async () => {
    renderBookings(bookingsSnap)

    expect(await screen.findByText('2 réservations en cours')).toBeInTheDocument()
  })

  it('should display the empty bookings dedicated view', async () => {
    renderBookings(emptyBookingsSnap)

    expect(await screen.findByText('Découvrir le catalogue')).toBeInTheDocument()
  })

  it('should display ended bookings CTA with the right number', async () => {
    renderBookings(bookingsSnap)

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('Réservation terminée')).toBeInTheDocument()
    })
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    renderBookings(bookingsSnap)

    const cta = screen.getByText('Réservation terminée')
    fireEvent.click(cta)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
    })
  })
})

const renderBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings, isFetching: false } as QueryObserverResult<
      BookingsResponse,
      unknown
    >)

  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<Bookings />))
}
