import React from 'react'
import { QueryObserverResult } from 'react-query'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse } from 'api/gen'
import * as Queries from 'features/bookings/api/queries'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { emptyBookingsSnap, bookingsSnap } from '../api/bookingsSnap'

import { Bookings } from './Bookings'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: jest.fn(() => ({ isLoading: false })),
}))

describe('Bookings', () => {
  afterEach(jest.restoreAllMocks)

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(Queries, 'useBookings')
    renderBookings(bookingsSnap)
    expect(useBookings).toBeCalledTimes(1)
  })

  it('should display the right number of ongoing bookings', async () => {
    const { queryByText } = renderBookings(bookingsSnap)

    expect(queryByText('1 réservation en cours')).toBeTruthy()
  })

  it('should display the empty bookings dedicated view', () => {
    const { getByText } = renderBookings(emptyBookingsSnap)
    getByText('Explorer les offres')
  })

  it('should display ended bookings CTA with the right number', async () => {
    const { queryByText } = renderBookings(bookingsSnap)

    await waitForExpect(() => {
      expect(queryByText('1')).toBeTruthy()
      expect(queryByText('Réservation terminée')).toBeTruthy()
    })
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    const { getByTestId } = renderBookings(bookingsSnap)

    const cta = getByTestId('Réservation terminée')
    fireEvent.press(cta)
    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('EndedBookings')
    })
  })
})

const renderBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(Queries, 'useBookings')
    .mockReturnValue({ data: bookings, isLoading: false, isFetching: false } as QueryObserverResult<
      BookingsResponse,
      unknown
    >)

  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<Bookings />))
}
