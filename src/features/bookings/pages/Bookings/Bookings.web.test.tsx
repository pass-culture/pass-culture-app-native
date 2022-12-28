import React from 'react'
import { QueryObserverResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, fireEvent, render } from 'tests/utils/web'

import { Bookings } from './Bookings'

describe('Bookings', () => {
  afterEach(jest.restoreAllMocks)

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = await renderBookings(bookingsSnap)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderBookings(bookingsSnap)
    expect(useBookings).toBeCalledTimes(1)
  })

  it('should display the right number of ongoing bookings', async () => {
    const { queryByText } = renderBookings(bookingsSnap)

    expect(queryByText('2 réservations en cours')).toBeTruthy()
  })

  it('should display the empty bookings dedicated view', async () => {
    const { queryByText } = await renderBookings(emptyBookingsSnap)
    expect(queryByText('Découvrir le catalogue')).toBeTruthy()
  })

  it('should display ended bookings CTA with the right number', async () => {
    const { queryByText } = renderBookings(bookingsSnap)

    await waitForExpect(() => {
      expect(queryByText('1')).toBeTruthy()
      expect(queryByText('Réservation terminée')).toBeTruthy()
    })
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    const { getByText } = renderBookings(bookingsSnap)

    const cta = getByText('Réservation terminée')
    fireEvent.click(cta)
    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('EndedBookings', undefined)
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
