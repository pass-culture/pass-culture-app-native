import React from 'react'
import { QueryObserverResult } from 'react-query'

import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { fireEvent, render } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

jest.mock('react-query')

describe('EndedBookings', () => {
  afterEach(jest.restoreAllMocks)

  it('should render correctly', () => {
    const renderAPI = renderEndedBookings(bookingsSnap)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderEndedBookings(bookingsSnap)
    expect(useBookings).toBeCalledTimes(1)
  })

  it('should display the right number of ended bookings', () => {
    const { queryByText } = renderEndedBookings(bookingsSnap)
    expect(queryByText('1 réservation terminée')).toBeTruthy()
  })

  it('should goBack when we press on the back button', () => {
    const { getByTestId } = renderEndedBookings(bookingsSnap)
    fireEvent.press(getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

const renderEndedBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings } as QueryObserverResult<BookingsResponse, unknown>)

  return render(<EndedBookings />)
}
