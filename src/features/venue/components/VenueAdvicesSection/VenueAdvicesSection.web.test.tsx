import React from 'react'

import { VenueAdvicesSection } from 'features/venue/components/VenueAdvicesSection/VenueAdvicesSection.web'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { proAdvicesCardDataFixture } from 'features/venue/fixtures/venueProAdvices.fixture'
import { render, screen } from 'tests/utils/web'

describe('VenueAdvicesSection', () => {
  it('should display see all advices button below the list in mobile', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
      />
    )

    expect(screen.getByTestId('allAdvicesButtonMobile')).toBeInTheDocument()
    expect(screen.queryByTestId('allAdvicesButtonDesktop')).not.toBeInTheDocument()
  })

  it('should display see all advices button next to section title in desktop', () => {
    render(
      <VenueAdvicesSection
        advicesCardData={[...proAdvicesCardDataFixture]}
        nbAdvices={2}
        venue={venueDataTest}
        onShowWritersModal={jest.fn()}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByTestId('allAdvicesButtonDesktop')).toBeInTheDocument()
    expect(screen.queryByTestId('allAdvicesButtonMobile')).not.toBeInTheDocument()
  })
})
