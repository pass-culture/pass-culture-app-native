import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

useRoute.mockImplementation(() => ({ params: { id: venueResponseSnap.id } }))

describe('<Venue />', () => {
  it('Performance test for Venue page', async () => {
    await measurePerformance(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<Venue />),
      {
        scenario: async () => {
          await screen.findByLabelText('Nom du lieu : Le Petit Rintintin 1')
        },
      }
    )
  })
})
