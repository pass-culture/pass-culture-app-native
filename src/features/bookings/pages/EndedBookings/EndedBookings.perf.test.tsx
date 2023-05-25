import React from 'react'

import { AuthWrapper } from 'features/auth/context/AuthContext'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

describe('<EndedBookings />', () => {
  it('Performance test for EndedBookings page', async () => {
    storage.saveString('access_token', 'token')
    await measurePerformance(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <AuthWrapper>
          <EndedBookings />
        </AuthWrapper>
      ),
      {
        scenario: async () => {
          await screen.findByText('1 réservation terminée')
        },
      }
    )
  })
})
