import React from 'react'
import { QueryObserverResult } from 'react-query'

import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { fireEvent, render, screen } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

jest.mock('react-query')

describe('EndedBookings', () => {
  it('should render correctly', () => {
    renderEndedBookings(bookingsSnap)

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', () => {
    const useBookings = jest.spyOn(bookingsAPI, 'useBookings')
    renderEndedBookings(bookingsSnap)

    expect(useBookings).toHaveBeenCalledTimes(1)
  })

  it('should display the right number of ended bookings', () => {
    renderEndedBookings(bookingsSnap)

    expect(screen.queryByText('1 réservation terminée')).toBeOnTheScreen()
  })

  it('should goBack when we press on the back button', () => {
    renderEndedBookings(bookingsSnap)
    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})

const renderEndedBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookings')
    .mockReturnValue({ data: bookings } as QueryObserverResult<BookingsResponse, unknown>)

  return render(<EndedBookings />)
}
