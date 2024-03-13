import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { VenueMapPreview } from 'features/venuemap/components/VenueMapPreview/VenueMapPreview'
import { render, screen } from 'tests/utils'

describe('<VenueMapPreview />', () => {
  it('should display venue name', () => {
    render(
      <VenueMapPreview
        venueName={venueResponseSnap.name}
        address={venueResponseSnap.address ?? ''}
        bannerUrl={venueResponseSnap.bannerUrl ?? ''}
        tags={['à 500m']}
      />
    )

    expect(screen.getByText(venueResponseSnap.name)).toBeOnTheScreen()
  })

  it('should display tags', () => {
    render(
      <VenueMapPreview
        venueName={venueResponseSnap.name}
        address={venueResponseSnap.address ?? ''}
        bannerUrl={venueResponseSnap.bannerUrl ?? ''}
        tags={['à 500m']}
      />
    )

    expect(screen.getByText('à 500m')).toBeOnTheScreen()
  })

  it('should not display tags', () => {
    render(
      <VenueMapPreview
        venueName={venueResponseSnap.name}
        address={venueResponseSnap.address ?? ''}
        bannerUrl={venueResponseSnap.bannerUrl ?? ''}
        tags={[]}
      />
    )

    expect(screen.queryByText('à 500m')).not.toBeOnTheScreen()
  })

  it('should display close button', () => {
    render(
      <VenueMapPreview
        venueName={venueResponseSnap.name}
        address={venueResponseSnap.address ?? ''}
        bannerUrl={venueResponseSnap.bannerUrl ?? ''}
        tags={[]}
      />
    )

    expect(screen.getByLabelText('Fermer')).toBeOnTheScreen()
  })
})
