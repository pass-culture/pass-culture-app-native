import React from 'react'

import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { render, screen } from 'tests/utils'

describe('<VenueSelectionListHeader />', () => {
  it('should display subtitle', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation={false}
      />
    )

    expect(screen.getByText('Sélectionner un lieu')).toBeOnTheScreen()
  })

  it('should display header message', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation={false}
      />
    )

    expect(screen.getByText('Lieux à proximité')).toBeOnTheScreen()
  })

  it('should display geolocation banner when user has not a location', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation={false}
      />
    )

    expect(screen.getByText('Active ta géolocalisation')).toBeOnTheScreen()
  })

  it('should not display geolocation banner when user has a location', () => {
    render(
      <VenueSelectionListHeader
        subTitle="Sélectionner un lieu"
        headerMessage="Lieux à proximité"
        isSharingLocation
      />
    )

    expect(screen.queryByText('Active ta géolocalisation')).not.toBeOnTheScreen()
  })
})
