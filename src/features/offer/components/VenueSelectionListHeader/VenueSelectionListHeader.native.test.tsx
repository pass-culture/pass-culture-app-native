import React from 'react'

import { VenueSelectionListHeader } from 'features/offer/components/VenueSelectionListHeader/VenueSelectionListHeader'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('<VenueSelectionListHeader />', () => {
  beforeEach(() => setFeatureFlags())

  it('should display geolocation system banner when user has not a location', () => {
    render(
      reactQueryProviderHOC(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation={false}
        />
      )
    )

    expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
  })

  it('should display subtitle', () => {
    render(
      reactQueryProviderHOC(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation={false}
        />
      )
    )

    expect(screen.getByText('Sélectionner un lieu')).toBeOnTheScreen()
  })

  it('should display header message', () => {
    render(
      reactQueryProviderHOC(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation={false}
        />
      )
    )

    expect(screen.getByText('Lieux à proximité')).toBeOnTheScreen()
  })

  it('should not display geolocation banner when user has a location', () => {
    render(
      reactQueryProviderHOC(
        <VenueSelectionListHeader
          subTitle="Sélectionner un lieu"
          headerMessage="Lieux à proximité"
          isSharingLocation
        />
      )
    )

    expect(screen.queryByText('Active ta géolocalisation')).not.toBeOnTheScreen()
  })
})
