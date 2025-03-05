import { PlaylistType } from 'features/offer/enums'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { act, renderHook } from 'tests/utils'

import {
  clearVenueMapStore,
  setInitialRegion,
  setOffersPlaylistType,
  setRegion,
  setSelectedVenue,
  setVenues,
  useVenueMapStore,
} from './venueMapStore'

describe('VenueMapStore', () => {
  it('should set default state at first', () => {
    const { result } = renderHook(() => useVenueMapStore())

    expect(result.current.venues).toStrictEqual([])
    expect(result.current.initialRegion).toBeUndefined()
    expect(result.current.region).toBeUndefined()
    expect(result.current.offersPlaylistType).toBe(PlaylistType.TOP_OFFERS)
    expect(result.current.selectedVenue).toBeUndefined()
    expect(result.current.venueTypeCode).toBeUndefined()
  })

  it('should set venues', () => {
    const { result } = renderHook(() => useVenueMapStore())

    act(() => {
      setVenues([venuesFixture[0]])
    })

    expect(result.current.venues).toStrictEqual([venuesFixture[0]])

    act(() => {
      setVenues([venuesFixture[1]])
    })

    expect(result.current.venues).toStrictEqual([venuesFixture[1]])
  })

  it('should clear store to default state', () => {
    const { result } = renderHook(() => useVenueMapStore())
    act(() => {
      setVenues(venuesFixture)
    })

    act(() => {
      clearVenueMapStore()
    })

    expect(result.current.venues).toStrictEqual([])
  })

  it('should set values', () => {
    const { result } = renderHook(() => useVenueMapStore())
    const REGION = { latitude: 22.9, longitude: 33.2, longitudeDelta: 2, latitudeDelta: 3 }
    act(() => {
      setVenues(venuesFixture)
      setOffersPlaylistType(PlaylistType.SEARCH_RESULTS)
      setInitialRegion(REGION)
      setRegion(REGION)
      setSelectedVenue(venuesFixture[1])
    })

    expect(result.current.venues).toStrictEqual(venuesFixture)
    expect(result.current.initialRegion).toStrictEqual(REGION)
    expect(result.current.region).toStrictEqual(REGION)
    expect(result.current.offersPlaylistType).toBe(PlaylistType.SEARCH_RESULTS)
    expect(result.current.selectedVenue).toStrictEqual(venuesFixture[1])
  })
})
