import React from 'react'
import { QueryObserverResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse } from 'api/gen'
import * as bookingsAPI from 'features/bookings/api/useBookings'
import { bookingsSnap, emptyBookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'

import { Bookings } from './Bookings'

const useBookingsSpy = jest.spyOn(bookingsAPI, 'useBookings')

useBookingsSpy.mockReturnValue({ data: bookingsSnap, isFetching: false } as QueryObserverResult<
  BookingsResponse,
  unknown
>)

describe('Bookings', () => {
  it('should render correctly', async () => {
    renderBookings()

    await screen.findByText('Mes réservations')

    expect(screen).toMatchSnapshot()
  })

  it('should always execute the query (in cache or in network)', async () => {
    renderBookings()
    await act(async () => {})

    //Due to multiple renders useBookings is called twice
    expect(useBookingsSpy).toHaveBeenCalledTimes(2)
  })

  it('should display the right number of ongoing bookings', async () => {
    renderBookings()
    await act(async () => {})

    expect(screen.getByText('2 réservations en cours')).toBeOnTheScreen()
  })

  it('should display the empty bookings dedicated view', async () => {
    const useBookingsResultMock = {
      data: emptyBookingsSnap,
      isFetching: false,
    } as QueryObserverResult<BookingsResponse, unknown>
    // Due to multiple renders we need to mock useBookings twice
    useBookingsSpy
      .mockReturnValueOnce(useBookingsResultMock)
      .mockReturnValueOnce(useBookingsResultMock)
    renderBookings()

    await act(async () => {})

    expect(await screen.findByText('Découvrir le catalogue')).toBeOnTheScreen()
  })

  it('should display ended bookings CTA with the right number', async () => {
    renderBookings()
    await act(async () => {})

    expect(screen.queryByText('1')).toBeOnTheScreen()
    expect(screen.queryByText('Réservation terminée')).toBeOnTheScreen()
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    renderBookings()

    const cta = screen.getByText('Réservation terminée')
    await act(async () => {
      fireEvent.press(cta)
    })

    expect(navigate).toHaveBeenCalledWith('EndedBookings', undefined)
  })
})

const renderBookings = () => {
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  return render(reactQueryProviderHOC(<Bookings />))
}
