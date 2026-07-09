import React from 'react'

import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen } from 'tests/utils'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

const VENUE_THUMBNAIL_SIZE = 48

describe('<VenueInfoHeader />', () => {
  beforeEach(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

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

  it('should display custom thumbnail placeholder icon when no image URL', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageURL=""
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.getByTestId('LocationIcon')).toBeOnTheScreen()
  })

  it('should not display default thumbnail placeholder icon', () => {
    render(
      <VenueInfoHeader
        title="PATHE BEAUGRENELLE"
        subtitle="Paris, France"
        showArrow={false}
        imageURL="https://example.com/image.jpg"
        imageSize={VENUE_THUMBNAIL_SIZE}
      />
    )

    expect(screen.queryByTestId('ThumbnailPlaceholderIcon')).not.toBeOnTheScreen()
  })
})
