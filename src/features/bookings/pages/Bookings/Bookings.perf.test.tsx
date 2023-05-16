import React from 'react'

import { AuthWrapper } from 'features/auth/context/AuthContext'
import { Bookings } from 'features/bookings/pages/Bookings/Bookings'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

describe('<Bookings />', () => {
  it('Performance test for Bookings page', async () => {
    storage.saveString('access_token', 'token')
    await measurePerformance(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <AuthWrapper>
          <Bookings />
        </AuthWrapper>
      ),
      {
        scenario: async () => {
          await screen.findByText('2 réservations en cours')
        },
      }
    )
  })
})
