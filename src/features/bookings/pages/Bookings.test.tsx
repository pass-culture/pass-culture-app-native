import { render } from '@testing-library/react-native'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct } from 'tests/utils'

import { Bookings } from './Bookings'

describe('Bookings', () => {
  it('should display the right account of ongoing bookings', async () => {
    const { queryByText } = renderBookings()

    await waitForExpect(() => {
      expect(queryByText('0\u00a0réservation en cours')).toBeTruthy()
    })
    await superFlushWithAct(1)
    await waitForExpect(() => {
      expect(queryByText('1\u00a0réservation en cours')).toBeTruthy()
    })
  })
})

const renderBookings = () => {
  return render(reactQueryProviderHOC(<Bookings />))
}
