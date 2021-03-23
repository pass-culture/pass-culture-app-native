import { act, fireEvent, render } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingsResponse } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { superFlushWithAct } from 'tests/utils'

import { emptyBookingsSnap } from '../api/bookingsSnap'

import { Bookings } from './Bookings'

allowConsole({ error: true })

describe('Bookings', () => {
  it('should display the right account of ongoing bookings', async () => {
    const { queryByText } = renderBookings()

    await superFlushWithAct(10)
    await waitForExpect(() => {
      expect(queryByText('1\u00a0réservation en cours')).toBeTruthy()
    })
  })

  it('should display the empty bookings dedicated view', async () => {
    server.use(
      rest.get<BookingsResponse>(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(emptyBookingsSnap))
      })
    )
    const { getByText } = await renderBookings()
    await superFlushWithAct(10)
    getByText('Explorer les offres')
  })

  it('should display ended bookings CTA with the right number', async () => {
    const { queryByText } = renderBookings()

    await superFlushWithAct(10)
    await waitForExpect(() => {
      expect(queryByText('1')).toBeTruthy()
      expect(queryByText('Réservation terminée')).toBeTruthy()
    })
  })

  it('should navigate to ended bookings page on press ended bookings CTA', async () => {
    const { getByTestId } = renderBookings()

    await superFlushWithAct(10)

    await act(async () => {
      const row = getByTestId('row-ended-bookings')
      await fireEvent.press(row)
    })

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('EndedBookings')
    })
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}
