import React from 'react'
import waitForExpect from 'wait-for-expect'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { superFlushWithAct, render } from 'tests/utils'

import { EndedBookings } from './EndedBookings'

describe('EndedBookings', () => {
  it('should display the right number of ended bookings', async () => {
    const { queryByText } = renderEndedBookings()

    await superFlushWithAct(10)
    await waitForExpect(() => {
      expect(queryByText('1\u00a0réservation terminée')).toBeTruthy()
    })
  })
})

const renderEndedBookings = () => {
  return render(reactQueryProviderHOC(<EndedBookings />))
}
