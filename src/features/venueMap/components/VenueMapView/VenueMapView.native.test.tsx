import React from 'react'

import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { act, fireEvent, renderAsync, screen, userEvent } from 'tests/utils'

import * as constants from '../../constant'

import { VenueMapView } from './VenueMapView'

jest.mock('react-native-map-clustering')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')

const mockCurrentRegion = {
  latitude: 48.871728,
  longitude: 2.308157,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

const pressVenueMarker = (venue: GeolocatedVenue) => {
  return act(() => {
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(screen.getByTestId(`marker-${venue.venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: venue.venueId.toString(),
        coordinate: {
          latitude: venue._geoloc.lat,
          longitude: venue._geoloc.lng,
        },
      },
    })
  })
}

describe('VenueMapView', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.useFakeTimers()
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 1,
      altitude: Infinity,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render empty map', async () => {
    await renderAsync(<VenueMapView venues={[]} />)

    const map = await screen.findByTestId('venue-map-view')

    expect(map).toBeOnTheScreen()
  })

  it('should render map with markers', async () => {
    await renderAsync(<VenueMapView venues={venuesFixture} />)

    expect(await screen.findByTestId('venue-map-view')).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should not display search button after initializing the map', async () => {
    await renderAsync(<VenueMapView venues={venuesFixture} onSearch={undefined} />)
    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should display search button and call refresh on press', async () => {
    const handleOnSearch = jest.fn()
    await renderAsync(<VenueMapView venues={venuesFixture} onSearch={handleOnSearch} />)

    await screen.findByTestId('venue-map-view')
    await user.press(await screen.findByText('Rechercher dans cette zone'))

    expect(handleOnSearch).toHaveBeenCalledTimes(1)
  })

  it('should display venue label', async () => {
    await renderAsync(
      <VenueMapView venues={venuesFixture} showLabel initialRegion={mockCurrentRegion} />
    )

    expect(await screen.findByText('Cinéma de la fin')).toBeOnTheScreen()
  })

  it('should not display venue label', async () => {
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 16,
      altitude: 1000,
    })

    await renderAsync(
      <VenueMapView venues={venuesFixture} showLabel={false} initialRegion={mockCurrentRegion} />
    )

    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })

  it('should call select marker when pressed', async () => {
    const handleOnMarkerPress = jest.fn()
    await renderAsync(<VenueMapView venues={venuesFixture} onMarkerPress={handleOnMarkerPress} />)
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0])

    expect(handleOnMarkerPress).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeEvent: {
          coordinate: {
            latitude: venuesFixture[0]._geoloc.lat,
            longitude: venuesFixture[0]._geoloc.lng,
          },
          id: venuesFixture[0].venueId.toString(),
        },
      })
    )
  })

  it('should select marker by default', async () => {
    await renderAsync(
      <VenueMapView venues={venuesFixture} selectedVenueId={venuesFixture[0].venueId} />
    )

    expect(
      await screen.findByTestId(`marker-${venuesFixture[0].venueId}-selected`)
    ).toBeOnTheScreen()
  })

  it('should render cluster', async () => {
    const { root } = await renderAsync(<VenueMapView venues={venuesFixture} />)
    root.props.renderCluster({ properties: { cluster_id: 'cluster' } })

    expect(await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)).toBeOnTheScreen()
  })
})
