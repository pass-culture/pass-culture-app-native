import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'

const VENUE_THUMBNAIL_SIZE = 48

describe('<VenueInfoHeader />', () => {
  it('should display venue name', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          showArrow={false}
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display venue subtitle', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.getByText('Paris, France')).toBeOnTheScreen()
  })

  it('should display image when imageURL is provided', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.getByTestId('VenuePreviewImage')).toBeOnTheScreen()
  })

  it('should not display image when imageURL is not provided', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.queryByTestId('VenuePreviewImage')).not.toBeOnTheScreen()
    expect(screen.getByTestId('VenuePreviewPlaceholder')).toBeOnTheScreen()
  })

  it('should display arrow when showArrow is true', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should not display arrow when showArrow is false', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })

  it('should display custom thumbnail placeholder icon when no image URL', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageURL=""
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.getByTestId('LocationIcon')).toBeOnTheScreen()
  })

  it('should not display default thumbnail placeholder icon', () => {
    render(
      reactQueryProviderHOC(
        <VenueInfoHeader
          title="PATHE BEAUGRENELLE"
          subtitle="Paris, France"
          showArrow={false}
          imageURL="https://example.com/image.jpg"
          imageSize={VENUE_THUMBNAIL_SIZE}
        />
      )
    )

    expect(screen.queryByTestId('ThumbnailPlaceholderIcon')).not.toBeOnTheScreen()
  })
})
