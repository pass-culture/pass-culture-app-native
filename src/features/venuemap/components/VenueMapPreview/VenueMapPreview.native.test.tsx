import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VenueMapPreview } from 'features/venuemap/components/VenueMapPreview/VenueMapPreview'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueMapPreview />', () => {
  it('should display venue name', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={['à 500m']}
        navigateTo={{ screen: 'Venue' }}
      />
    )

    expect(screen.getByText(offerResponseSnap.venue.name)).toBeOnTheScreen()
  })

  it('should display tags', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={['à 500m']}
        navigateTo={{ screen: 'Venue' }}
      />
    )

    expect(screen.getByText('à 500m')).toBeOnTheScreen()
  })

  it('should not display tags', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={[]}
        navigateTo={{ screen: 'Venue' }}
      />
    )

    expect(screen.queryByText('à 500m')).not.toBeOnTheScreen()
  })

  it('should display close button', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={[]}
        navigateTo={{ screen: 'Venue' }}
      />
    )

    expect(screen.getByLabelText('Fermer')).toBeOnTheScreen()
  })

  it('should navigate to Venue when pressing on the preview', () => {
    render(
      <VenueMapPreview
        venueName={offerResponseSnap.venue.name}
        address={offerResponseSnap.venue.address ?? ''}
        bannerUrl={offerResponseSnap.venue.bannerUrl ?? ''}
        tags={[]}
        navigateTo={{ screen: 'Venue', params: { id: offerResponseSnap.venue.id } }}
      />
    )

    fireEvent.press(screen.getByText(offerResponseSnap.venue.name))

    expect(navigate).toHaveBeenCalledWith('Venue', { id: 1664 })
  })
})
