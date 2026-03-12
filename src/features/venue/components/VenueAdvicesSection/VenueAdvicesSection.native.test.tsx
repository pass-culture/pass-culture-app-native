import React from 'react'

import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { proAdvicesCardDataFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('VenueAdvicesSection', () => {
  it('should display correctly', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
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
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText('Lire les 2 avis')).toBeOnTheScreen()
  })

  it('should display "Nouveau" tag when wipProReviewsNewTag FF activated', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        enableNewTagProAdvices
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText('Nouveau')).toBeOnTheScreen()
  })
})
