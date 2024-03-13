import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VenueMapPreview } from 'features/venuemap/components/VenueMapPreview/VenueMapPreview'
import { render, screen } from 'tests/utils'

describe('<VenueMapPreview />', () => {
  it('should display venue name', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={['à 500m']}
      />
    )

    expect(screen.getByText(offerResponseSnap.venue.name)).toBeOnTheScreen()
  })

  it('should display tags', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={['à 500m']}
      />
    )

    expect(screen.getByText('à 500m')).toBeOnTheScreen()
  })

  it('should not display tags', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={[]}
      />
    )

    expect(screen.queryByText('à 500m')).not.toBeOnTheScreen()
  })

  it('should display close button', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={[]}
      />
    )

    expect(screen.getByLabelText('Fermer')).toBeOnTheScreen()
  })
})
