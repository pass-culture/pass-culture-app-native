import React, { ComponentPropsWithRef } from 'react'
import { State } from 'react-native-gesture-handler'
import { getByGestureTestId, fireGestureHandler } from 'react-native-gesture-handler/jest-utils'
import { UseQueryResult } from 'react-query'

import { VenueTypeCodeKey } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueMapView } from 'features/venueMap/components/VenueMapView/VenueMapView'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

import * as constants from './constant'

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')
const useVenueOffersSpy = jest.spyOn(useVenueOffers, 'useVenueOffers')

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = jest.requireActual('react-native')
  class MockBottomSheet extends View {
    close() {
      this.props.onAnimate(0, -1)
      this.props.onChange(-1)
    }
    expand() {
      this.props.onAnimate(0, 2)
      this.props.onChange(2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
      this.props.onChange(0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})

const mockUseVenueOffers = (emptyResponse = false) => {
  useVenueOffersSpy.mockReturnValue({
    isLoading: false,
    data: { hits: emptyResponse ? [] : VenueOffersResponseSnap, nbHits: emptyResponse ? 0 : 10 },
  } as unknown as UseQueryResult<useVenueOffers.VenueOffers, unknown>)
}

const pressVenueMarker = (venue: GeolocatedVenue) => {
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
}

describe('<VenueMapView />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockUseVenueOffers()

    useFeatureFlagSpy.mockReturnValue(true)
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 1,
      altitude: Infinity,
    })
  })

  beforeAll(() => {
    jest.useFakeTimers()
    mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render map', async () => {
    render(getVenueMapViewComponent({}))
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should not display search button after initializing the map', async () => {
    render(getVenueMapViewComponent({}))
    await screen.findByTestId('venue-map-view')

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
    await user.press(await screen.findByText('Rechercher dans cette zone'))

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should reset initial venues store when pressing search button', async () => {
    render(getVenueMapViewComponent({}))
    const mapView = await screen.findByTestId('venue-map-view')

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })

    await user.press(await screen.findByText('Rechercher dans cette zone'))

    expect(mockSetInitialVenues).toHaveBeenNthCalledWith(1, [])
  })

  it('should display venueMapPreview + venueMapList in bottom sheet when marker is pressed', async () => {
    render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    pressVenueMarker(venuesFixture[0])

    expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen()
    expect(screen.getByTestId('venueOfferPlaylist')).toBeOnTheScreen()
    expect(screen.getByText('Voir les offres du lieu')).toBeOnTheScreen()
  })

  it('should navigate to Venue page when bottom sheet is open and fling gesture detected', async () => {
    mockUseVenueOffers(true)

    render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    pressVenueMarker(venuesFixture[0])
    await waitFor(() => expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen())

    fireGestureHandler(getByGestureTestId('flingGesture'), [
      { state: State.BEGAN, absoluteY: 0 },
      { state: State.ACTIVE, absoluteY: -10 },
      { state: State.END, absoluteY: -30 },
    ])

    expect(mockNavigate).toHaveBeenCalledWith('Venue', { id: venuesFixture[0].venueId })
  })

  it('should not display preview is marker id has not been found in venue list', async () => {
    render(getVenueMapViewComponent({}))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    pressVenueMarker(venuesFixture[0])

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should not display preview if wipOffersInBottomSheet FF disabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])

    render(getVenueMapViewComponent({}))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    pressVenueMarker(venuesFixture[0])

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should not display offers in bottom-sheet if wipOffersInBottomSheet FF disabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    pressVenueMarker(venuesFixture[0])

    await screen.findByTestId('venueMapPreview')

    expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen()
    expect(screen.queryByTestId('venueOfferPlaylist')).not.toBeOnTheScreen()
    expect(screen.queryByText('Voir les offres du lieu')).not.toBeOnTheScreen()
  })

  it('should hide bottom sheet when a marker is selected and map is pressed', async () => {
    const { rerender } = render(getVenueMapViewComponent({ selectedVenue: venuesFixture[0] }))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    pressVenueMarker(venuesFixture[0])

    await user.press(screen.getByTestId('venue-map-view'))

    rerender(getVenueMapViewComponent({}))

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should center map on bottom sheet animation', async () => {
    render(getVenueMapViewComponent({}))
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await user.press(screen.getByTestId('venue-map-view'))

    pressVenueMarker(venuesFixture[0])

    expect(mockUseCenterOnLocation).toHaveBeenCalledWith(expect.any(Object))
  })

  it('should display venue label when wipVenueMapPinV2 FF is activated', async () => {
    activateFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
    ])
    render(getVenueMapViewComponent({}))

    expect(await screen.findByText('Cinéma de la fin')).toBeOnTheScreen()
  })

  it('should not display venue label when wipVenueMapPinV2 FF is activated and zoom is too low', async () => {
    activateFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
    ])
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 16,
      altitude: 1000,
    })

    render(getVenueMapViewComponent({}))

    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })

  it('should not display venue label wipVenueMapPinV2 when FF is disabled', async () => {
    activateFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    render(getVenueMapViewComponent({}))
    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })
})

const mockCurrentRegion = {
  latitude: 48.871728,
  longitude: 2.308157,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

type RenderVenueMapViewType = Partial<ComponentPropsWithRef<typeof VenueMapView>>

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
