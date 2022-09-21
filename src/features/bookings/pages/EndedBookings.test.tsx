import React from 'react'
import { QueryObserverResult } from 'react-query'

import { BookingsResponse } from 'api/gen'
import * as Queries from 'features/bookings/api/queries'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

jest.mock('react-query')

describe('EndedBookings', () => {
  afterEach(jest.restoreAllMocks)

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(Queries, 'useBookings')
    renderEndedBookings(bookingsSnap)
    expect(useBookings).toBeCalledTimes(1)
  })

  it('should display the right number of ended bookings', () => {
    const { queryByText } = renderEndedBookings(bookingsSnap)
    expect(queryByText('1 réservation terminée')).toBeTruthy()
  })
})

const renderEndedBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(Queries, 'useBookings')
    .mockReturnValue({ data: bookings } as QueryObserverResult<BookingsResponse, unknown>)

  return render(<EndedBookings />)
}
