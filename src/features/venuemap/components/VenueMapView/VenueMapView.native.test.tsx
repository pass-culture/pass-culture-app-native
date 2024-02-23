import React from 'react'

import { VenueMapView } from 'features/venuemap/components/VenueMapView/VenueMapView'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

describe('<VenueMapView />', () => {
  it('should render map', async () => {
    renderVenueMapView()
    const mapView = screen.getByTestId('venue-map-view')

    await act(() => {})

    expect(mapView).toBeOnTheScreen()
  })

  it('should not display search button after initializing the map', async () => {
    renderVenueMapView()

    await act(() => {})

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should display search button after region change', async () => {
    renderVenueMapView()
    const mapView = screen.getByTestId('venue-map-view')

    await act(() => {})

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
    const mapView = screen.getByTestId('venue-map-view')

    await act(() => {})

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })

    await act(async () => fireEvent.press(await screen.findByText('Rechercher dans cette zone')))

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })
})

function renderVenueMapView() {
  render(reactQueryProviderHOC(<VenueMapView padding={{ top: 0, left: 0, right: 0, bottom: 0 }} />))
}
