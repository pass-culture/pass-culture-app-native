import React from 'react'

import * as jwt from '__mocks__/jwt-decode'
import { AuthWrapper } from 'features/auth/context/AuthContext'
import { EndedBookings } from 'features/bookings/pages/EndedBookings/EndedBookings'
import { decodedTokenWithRemainingLifetime } from 'libs/jwt/fixtures'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.unmock('libs/jwt')
jest.spyOn(jwt, 'default').mockReturnValue(decodedTokenWithRemainingLifetime)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<EndedBookings />', () => {
  it('Performance test for EndedBookings page', async () => {
    storage.saveString('access_token', 'token')
    storage.saveString('PASSCULTURE_REFRESH_TOKEN', 'token')
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
