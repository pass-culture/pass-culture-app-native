import React from 'react'

import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('<VenueMapView />', () => {
  it('should render map', async () => {
    renderVenueMapView()
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
  })

  it('should not display search button after initializing the map', async () => {
    renderVenueMapView()

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should display search button after region change', async () => {
    renderVenueMapView()
    const mapView = await screen.findByTestId('venue-map-view')

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })

    expect(screen.getByText('Rechercher dans cette zone')).toBeOnTheScreen()
  })

  it('should not display search button after search press', async () => {
    renderVenueMapView()
    const mapView = await screen.findByTestId('venue-map-view')

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })
    fireEvent.press(await screen.findByText('Rechercher dans cette zone'))

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })
})

function renderVenueMapView() {
  render(reactQueryProviderHOC(<VenueMapView height={700} />))
}
