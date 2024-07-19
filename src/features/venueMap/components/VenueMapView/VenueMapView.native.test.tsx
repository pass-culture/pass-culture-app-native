import React from 'react'

import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')

describe('<VenueMapView />', () => {
  beforeAll(() => {
    mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
    useFeatureFlagSpy.mockReturnValue(true)
  })

  it('should render map', async () => {
    renderVenueMapView()
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
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

  it('should reset initial venues store when pressing search button', async () => {
    renderVenueMapView()
    const mapView = screen.getByTestId('venue-map-view')

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })

    fireEvent.press(await screen.findByText('Rechercher dans cette zone'))

    expect(mockSetInitialVenues).toHaveBeenNthCalledWith(1, [])
  })

  it('should display venueMapPreview + venueMapList in bottom sheet when marker is pressed', async () => {
    renderVenueMapView()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    fireEvent.press(screen.getByTestId(`marker-${venuesFixture[0].venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: venuesFixture[0].venueId.toString(),
        coordinate: {
          latitude: venuesFixture[0]._geoloc.lat,
          longitude: venuesFixture[0]._geoloc.lng,
        },
      },
    })

    await screen.findByTestId('venueMapPreview')

    expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen()
    expect(screen.getByTestId('venueOfferPlaylist')).toBeOnTheScreen()
    expect(screen.getByText('Voir les offres du lieu')).toBeOnTheScreen()
  })

  it('should not display preview is marker id has not been found in venue list', async () => {
    renderVenueMapView()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    fireEvent.press(screen.getByTestId(`marker-${venuesFixture[0].venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: '0',
        coordinate: {
          latitude: venuesFixture[0]._geoloc.lat,
          longitude: venuesFixture[0]._geoloc.lng,
        },
      },
    })

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should not display preview is FF disabled', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderVenueMapView()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    fireEvent.press(screen.getByTestId(`marker-${venuesFixture[0].venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: venuesFixture[0].venueId.toString(),
        coordinate: {
          latitude: venuesFixture[0]._geoloc.lat,
          longitude: venuesFixture[0]._geoloc.lng,
        },
      },
    })

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should hide bottom sheet when a marker is selected and map is pressed', async () => {
    renderVenueMapView()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    fireEvent.press(screen.getByTestId(`marker-${venuesFixture[0].venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: venuesFixture[0].venueId.toString(),
        coordinate: {
          latitude: venuesFixture[0]._geoloc.lat,
          longitude: venuesFixture[0]._geoloc.lng,
        },
      },
    })

    fireEvent.press(screen.getByTestId('venue-map-view'))

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })
})

function renderVenueMapView() {
  return render(reactQueryProviderHOC(<VenueMapView height={700} from="venueMap" />))
}
