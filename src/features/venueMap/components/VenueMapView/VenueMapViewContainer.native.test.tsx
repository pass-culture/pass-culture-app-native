import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { State } from 'react-native-gesture-handler'
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils'
import { UseQueryResult } from 'react-query'

import { VenueTypeCodeKey } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import * as useVenueOffers from 'features/venue/api/useVenueOffers'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import { VenueOffers } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueMapViewContainer } from 'features/venueMap/components/VenueMapView/VenueMapViewContainer'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import * as useVenueMapFilters from 'features/venueMap/hook/useVenueMapFilters'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { useVenuesInRegionQuery } from 'features/venueMap/useVenuesInRegionQuery'
import mockVenueSearchParams from 'fixtures/venueSearchParams'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'

import * as constants from '../../constant'

jest.mock('@react-navigation/native')
jest.mock('@react-navigation/bottom-tabs')

const mockNavigate = jest.fn()
const mockUseNavigation = useNavigation as jest.Mock
mockUseNavigation.mockReturnValue({ navigate: mockNavigate })

const mockUseRoute = useRoute as jest.Mock
mockUseRoute.mockReturnValue({ name: 'venueMap' })

jest.mock('features/venueMap/useVenuesInRegionQuery')
const mockUseVenuesInRegionQuery = useVenuesInRegionQuery as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')

const useVenueOffersSpy = jest.spyOn(useVenueOffers, 'useVenueOffers')

const useVenueMapFiltersSpy = jest.spyOn(useVenueMapFilters, 'useVenueMapFilters')
useVenueMapFiltersSpy.mockReturnValue({
  activeFilters: constants.FILTERS_VENUE_TYPE_MAPPING.OUTINGS,
  addMacroFilter: jest.fn(),
  getSelectedMacroFilters: jest.fn(),
  removeMacroFilter: jest.fn(),
  toggleMacroFilter: jest.fn(),
})

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

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(mockVenueSearchParams)

jest.mock('features/search/context/SearchWrapper')

const mockUseVenueOffers = (emptyResponse = false) => {
  useVenueOffersSpy.mockReturnValue({
    isLoading: false,
    data: { hits: emptyResponse ? [] : VenueOffersResponseSnap, nbHits: emptyResponse ? 0 : 10 },
  } as unknown as UseQueryResult<VenueOffers, unknown>)
}

const pressVenueMarker = (venue: GeolocatedVenue, forcedVenueId?: string) => {
  return act(() => {
    fireEvent.press(screen.getByTestId(`marker-${venue.venueId}`), {
      stopPropagation: () => false,
      nativeEvent: {
        id: forcedVenueId ?? venue.venueId.toString(),
        coordinate: {
          latitude: venue._geoloc.lat,
          longitude: venue._geoloc.lng,
        },
      },
    })
  })
}

const initStore = () => {
  const { setVenues, setOffersPlaylistType, setInitialRegion, setRegion } = useVenueMapStore

  const mockCurrentRegion = {
    latitude: 48.871728,
    longitude: 2.308157,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  setVenues(venuesFixture)
  venuesFilterActions.setVenuesFilters([VenueTypeCodeKey.VISUAL_ARTS])
  setOffersPlaylistType(PlaylistType.SEARCH_RESULTS)
  setInitialRegion(mockCurrentRegion)
  setRegion(mockCurrentRegion)
}

describe('VenueMapViewContainer', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    initStore()
    mockUseVenueOffers()
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    ])
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 1,
      altitude: Infinity,
    })
  })

  beforeAll(() => {
    jest.useFakeTimers()
    mockUseVenuesInRegionQuery.mockReturnValue({ data: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render map', async () => {
    renderVenueMapViewContainer()
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should render map with active filters', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2,
    ])
    renderVenueMapViewContainer()
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should render map coming from other screen than venueMap', async () => {
    mockUseRoute.mockReturnValueOnce({ name: 'searchResults' })
    renderVenueMapViewContainer()
    const mapView = await screen.findByTestId('venue-map-view')

    expect(mapView).toBeOnTheScreen()
    expect(screen.getAllByTestId(/marker-/)).toHaveLength(venuesFixture.length)
  })

  it('should not display search button after initializing the map', async () => {
    renderVenueMapViewContainer()
    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
  })

  it('should display search button after region change', async () => {
    renderVenueMapViewContainer()
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
    renderVenueMapViewContainer()
    const mapView = await screen.findByTestId('venue-map-view')

    // Simulate region change
    fireEvent(mapView, 'onRegionChangeComplete', {
      latitude: 1,
      longitude: 1,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })

    await user.press(await screen.findByText('Rechercher dans cette zone'))

    await waitFor(() =>
      expect(screen.queryByText('Rechercher dans cette zone')).not.toBeOnTheScreen()
    )
  })

  it('should set venues in store when pressing search button', async () => {
    renderVenueMapViewContainer()
    const mapView = await screen.findByTestId('venue-map-view')

    const setVenuesSpy = jest.spyOn(useVenueMapStore, 'setVenues')

    await act(async () => {
      // Simulate region change
      fireEvent(mapView, 'onRegionChangeComplete', {
        latitude: 1,
        longitude: 1,
        latitudeDelta: 1,
        longitudeDelta: 1,
      })
      await user.press(await screen.findByText('Rechercher dans cette zone'))
    })

    expect(setVenuesSpy).toHaveBeenNthCalledWith(1, venuesFixture)
  })

  it('should display venueMapPreview + venueMapList in bottom sheet when marker is pressed', async () => {
    renderVenueMapViewContainer()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0])

    expect(await screen.findByTestId('venueMapPreview')).toBeOnTheScreen()
    expect(await screen.findByTestId('venueOfferPlaylist')).toBeOnTheScreen()
    expect(await screen.findByText('Voir les offres du lieu')).toBeOnTheScreen()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should not display venueMapPreview in bottom sheet if selected marker is not found in venue list', async () => {
    renderVenueMapViewContainer()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0], '666')

    expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen()
  })

  it('should remove selected venue when map is pressed', async () => {
    renderVenueMapViewContainer()
    const mockRemoveSelectedVenue = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0])

    await user.press(screen.getByTestId('venue-map-view'))

    await waitFor(() => {
      expect(mockRemoveSelectedVenue).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to Venue page when bottom sheet is open and fling gesture detected', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_FLING_BOTTOM_SHEET_NAVIGATE_TO_VENUE,
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    ])
    mockUseVenueOffers(true)
    renderVenueMapViewContainer()

    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0])
    await waitFor(() => expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen())

    fireGestureHandler(getByGestureTestId('flingGesture'), [
      { state: State.BEGAN, absoluteY: 0 },
      { state: State.ACTIVE, absoluteY: -10 },
      { state: State.END, absoluteY: -30 },
    ])

    expect(mockNavigate).toHaveBeenCalledWith('Venue', { id: venuesFixture[0].venueId })
  })

  it('should deactivate navigation to Venue page when bottom sheet is open, pressing venue button, wipIsOpenToPublic feature flag is true and venue is not open to public', async () => {
    mockUseVenueOffers(true)
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_IS_OPEN_TO_PUBLIC,
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    ])

    renderVenueMapViewContainer()

    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[1])
    await screen.findByTestId('venueMapPreview')

    await user.press(screen.getByText(venuesFixture[1].label))

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })

  it('should activate navigation to Venue page when bottom sheet is open, pressing venue button, wipIsOpenToPublic feature flag is true and venue is open to public', async () => {
    mockUseVenueOffers(true)
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_IS_OPEN_TO_PUBLIC,
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    ])

    renderVenueMapViewContainer()

    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await pressVenueMarker(venuesFixture[0])
    await waitFor(() => expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen())

    await user.press(screen.getByText(venuesFixture[0].label))

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should not display preview if wipOffersInBottomSheet FF disabled', async () => {
    setFeatureFlags([])

    renderVenueMapViewContainer()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    await pressVenueMarker(venuesFixture[0])

    await waitFor(() => expect(screen.queryByTestId('venueMapPreview')).not.toBeOnTheScreen())
  })

  it('should not display offers in bottom-sheet if wipOffersInBottomSheet FF disabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    renderVenueMapViewContainer()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)
    await pressVenueMarker(venuesFixture[0])

    await screen.findByTestId('venueMapPreview')

    expect(screen.getByTestId('venueMapPreview')).toBeOnTheScreen()
    expect(screen.queryByTestId('venueOfferPlaylist')).not.toBeOnTheScreen()
    expect(screen.queryByText('Voir les offres du lieu')).not.toBeOnTheScreen()
  })

  it('should center map on bottom sheet animation', async () => {
    renderVenueMapViewContainer()
    await screen.findByTestId(`marker-${venuesFixture[0].venueId}`)

    await user.press(screen.getByTestId('venue-map-view'))

    await pressVenueMarker(venuesFixture[0])

    await waitFor(() => expect(mockUseCenterOnLocation).toHaveBeenCalledWith(expect.any(Object)))
  })

  it('should display venue label when wipVenueMapPinV2 FF is activated', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
    ])
    renderVenueMapViewContainer()

    await screen.findByTestId('venue-map-view')

    expect(screen.getByText('Cinéma de la fin')).toBeOnTheScreen()
  })

  it('should not display venue label when wipVenueMapPinV2 FF is activated and zoom is too low', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
    ])
    Object.assign(constants.MARKER_LABEL_VISIBILITY_LIMIT, {
      zoom: 16,
      altitude: 1000,
    })

    renderVenueMapViewContainer()

    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })

  it('should show venues matching selected category', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_PIN_V2,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2,
    ])
    renderVenueMapViewContainer()

    await waitFor(() =>
      expect(screen.getAllByTestId(/marker-/)).toHaveLength(
        venuesFixture.filter((venue) =>
          constants.FILTERS_VENUE_TYPE_MAPPING.OUTINGS.includes(venue.venue_type)
        ).length
      )
    )
  })

  it('should not display venue label wipVenueMapPinV2 when FF is disabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    renderVenueMapViewContainer()
    await screen.findByTestId('venue-map-view')

    expect(screen.queryByText('Cinéma de la fin')).not.toBeOnTheScreen()
  })
})

function renderVenueMapViewContainer() {
  render(
    reactQueryProviderHOC(
      <BottomTabBarHeightContext.Provider value={80}>
        <VenueMapViewContainer />
      </BottomTabBarHeightContext.Provider>
    )
  )
}
