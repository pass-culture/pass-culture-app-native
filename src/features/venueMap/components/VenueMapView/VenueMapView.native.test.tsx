import React, { ComponentProps } from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@gorhom/bottom-sheet', () => {
  const ActualBottomSheet = jest.requireActual('@gorhom/bottom-sheet/mock').default

  class MockBottomSheet extends ActualBottomSheet {
    close() {
      this.props.onAnimate(0, -1)
    }
    expand() {
      this.props.onAnimate(0, 2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})

describe('<VenueMapView />', () => {
  beforeEach(() => {
    useFeatureFlagSpy.mockReturnValue(true)
  })

  beforeAll(() => {
    mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
  })

  it('should render map', async () => {
    render(getVenueMapViewComponent({}))
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should not display search button after initializing the map', async () => {
    render(getVenueMapViewComponent({}))

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should display search button after region change', async () => {
    render(getVenueMapViewComponent({}))
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
    render(getVenueMapViewComponent({}))
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
    render(getVenueMapViewComponent({}))
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
    render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
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
    render(getVenueMapViewComponent({}))
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

  it('should not display preview if wipOffersInBottomSheet FF disabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])

    render(getVenueMapViewComponent({}))
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

  it('should not display offers in bottom-sheet if wipOffersInBottomSheet FF disabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
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
    expect(screen.queryByTestId('venueOfferPlaylist')).not.toBeOnTheScreen()
    expect(screen.queryByText('Voir les offres du lieu')).not.toBeOnTheScreen()
  })

  it('should hide bottom sheet when a marker is selected and map is pressed', async () => {
    const { rerender } = render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
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

    rerender(getVenueMapViewComponent({}))

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should center map on bottom sheet animation', async () => {
    render(getVenueMapViewComponent({}))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    fireEvent.press(screen.getByTestId('venue-map-view'))

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

    expect(mockUseCenterOnLocation).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should display venue label when wipVenueMapPinV2 FF is activated', () => {
    activateFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
    ])
    render(getVenueMapViewComponent({}))

    expect(screen.getByText('Cinéma de la fin')).toBeOnTheScreen()
  })

  it('should not display venue label wipVenueMapPinV2 when FF is disabled', () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    render(getVenueMapViewComponent({}))

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })
})

const mockCurrentRegion = {
  latitude: 48.871728,
  longitude: 2.308157,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

type RenderVenueMapViewType = Partial<ComponentProps<typeof VenueMapView>>

function getVenueMapViewComponent({
  selectedVenue = null,
  venues = venuesFixture,
  venueTypeCode = VenueTypeCodeKey.VISUAL_ARTS,
  currentRegion = mockCurrentRegion,
}: RenderVenueMapViewType) {
  return reactQueryProviderHOC(
    <VenueMapView
      height={700}
      from="venueMap"
      venues={venues}
      selectedVenue={selectedVenue}
      venueTypeCode={venueTypeCode}
      setSelectedVenue={jest.fn()}
      removeSelectedVenue={jest.fn()}
      currentRegion={currentRegion}
      setCurrentRegion={jest.fn()}
      setLastRegionSearched={jest.fn()}
      playlistType={PlaylistType.TOP_OFFERS}
    />
  )
}
