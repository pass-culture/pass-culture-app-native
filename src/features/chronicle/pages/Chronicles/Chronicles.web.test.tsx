import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

useRoute.mockReturnValue({
  params: {
    offerId: offerResponseSnap.id,
  },
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/openUrl')

describe('Chronicles', () => {
  beforeEach(() => {
    mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, offerResponseSnap)
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should render correctly in mobile', async () => {
    render(reactQueryProviderHOC(<Chronicles />), {
      theme: {
        isDesktopViewport: false,
      },
    })

    expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
    expect(screen.queryByText("Réserver l'offre")).not.toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-*/).length).toBeGreaterThan(0)
  })

  it('should render correctly in desktop', async () => {
    render(reactQueryProviderHOC(<Chronicles />), {
      theme: {
        isDesktopViewport: true,
      },
    })

    expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
    expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeInTheDocument()
    expect(screen.getByText('Dès 5,00 €')).toBeInTheDocument()
    expect(screen.getByTestId('booking-button')).toBeInTheDocument()
    expect(screen.getAllByTestId(/chronicle-*/).length).toBeGreaterThan(0)
  })
})
