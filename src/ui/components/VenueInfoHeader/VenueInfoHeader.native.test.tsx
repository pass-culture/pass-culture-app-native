import React from 'react'

import { render, screen } from 'tests/utils'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'

const VENUE_THUMBNAIL_SIZE = 48

describe('<VenueInfoHeader />', () => {
  it('should display venue name', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        showArrow={false}
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display venue subtitle', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByText('Paris, France')).toBeOnTheScreen()
  })

  it('should display image when imageURL is provided', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByTestId('VenuePreviewImage')).toBeOnTheScreen()
  })

  it('should not display image when imageURL is not provided', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.queryByTestId('VenuePreviewImage')).not.toBeOnTheScreen()
    expect(screen.getByTestId('VenuePreviewPlaceholder')).toBeOnTheScreen()
  })

  it('should display arrow when showArrow is true', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should not display arrow when showArrow is false', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })
})
