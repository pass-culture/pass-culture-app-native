import React from 'react'

import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { proAdvicesCardDataFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { render, screen } from 'tests/utils'

describe('VenueAdvicesSection', () => {
  it('should display correctly', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
      />
    )

    expect(screen.getByText(`Les avis par “${venueDataTest.name}”`)).toBeOnTheScreen()
  })

  it('should display see all advices button', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
      />
    )

    expect(screen.getByText('Lire les 2 avis')).toBeOnTheScreen()
  })
})
