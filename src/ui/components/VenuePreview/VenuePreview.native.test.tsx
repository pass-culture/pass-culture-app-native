import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { mockSettings } from 'tests/mockSettings'
import { render, screen } from 'tests/utils'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'

const VENUE_THUMBNAIL_SIZE = 48

mockSettings()

describe('<VenuePreview />', () => {
  it('should display venue name', () => {
    render(
      <VenuePreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        imageHeight={VENUE_THUMBNAIL_SIZE}
        imageWidth={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display image when image url is provided', () => {
    render(
      <VenuePreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        imageHeight={VENUE_THUMBNAIL_SIZE}
        imageWidth={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByTestId('VenuePreviewImage')).toBeOnTheScreen()
  })

  it('should display placeholder when image url is not provided', () => {
    render(
      <VenuePreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={undefined}
        imageHeight={VENUE_THUMBNAIL_SIZE}
        imageWidth={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByTestId('VenuePreviewPlaceholder')).toBeOnTheScreen()
  })

  it('should not display arrow by default', () => {
    render(
      <VenuePreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        imageHeight={VENUE_THUMBNAIL_SIZE}
        imageWidth={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })

  it('should display arrow when specified', () => {
    render(
      <VenuePreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        imageHeight={VENUE_THUMBNAIL_SIZE}
        imageWidth={VENUE_THUMBNAIL_SIZE}
        withRightArrow
      />
    )

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })
})
