import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VenueMapPreview } from 'features/toto/components/VenueMapPreview/VenueMapPreview'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueMapPreview />', () => {
  it('should display venue name', () => {
    renderVenueMapPreview({})

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display tags', () => {
    renderVenueMapPreview({ tags: ['à 500m'] })

    expect(screen.getByText('à 500m')).toBeOnTheScreen()
  })

  it('should not display tags', () => {
    renderVenueMapPreview({})

    expect(screen.queryByText('à 500m')).not.toBeOnTheScreen()
  })

  it('should display close button', () => {
    renderVenueMapPreview({})

    expect(screen.getByLabelText('Fermer')).toBeOnTheScreen()
  })

  it('should navigate to Venue when pressing on the preview', () => {
    renderVenueMapPreview({
      navigateTo: { screen: 'Venue', params: { id: offerResponseSnap.venue.id } },
    })

    fireEvent.press(screen.getByText(offerResponseSnap.venue.name))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 1664 })
  })
})

type RenderVenueMapPreviewType = Partial<ComponentProps<typeof VenueMapPreview>>

function renderVenueMapPreview({
  venueName = offerResponseSnap.venue.name,
  address = offerResponseSnap.venue.address ?? '',
  bannerUrl = offerResponseSnap.venue.bannerUrl ?? '',
  tags = [],
  navigateTo = { screen: 'Venue' },
}: RenderVenueMapPreviewType) {
  render(
    <VenueMapPreview
      venueName={venueName}
      address={address}
      bannerUrl={bannerUrl}
      tags={tags}
      navigateTo={navigateTo}
    />
  )
}
