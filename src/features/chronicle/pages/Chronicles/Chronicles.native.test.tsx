import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

useRoute.mockReturnValue({
  params: {
    offerId: offerResponseSnap.id,
  },
})

describe('Chronicles', () => {
  beforeEach(() => {
    mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
  })

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<Chronicles />))

    expect(await screen.findByText('Tous les avis')).toBeOnTheScreen()
  })
})
