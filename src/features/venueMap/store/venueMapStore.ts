// eslint-disable-next-line no-restricted-imports
import { create } from 'zustand'

import { PlaylistType } from 'features/offer/enums'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { Region } from 'libs/maps/maps'
import { VenueTypeCode } from 'libs/parsers/venueType'

type VenueMapStoreState = {
  offersPlaylistType: PlaylistType
  venueTypeCode?: VenueTypeCode | null
  venues: GeolocatedVenue[]
  selectedVenue?: GeolocatedVenue | null
  region?: Region
  initialRegion?: Region
}

const DEFAULT_STATE: VenueMapStoreState = {
  offersPlaylistType: PlaylistType.TOP_OFFERS,
  venues: [],
  selectedVenue: undefined,
  venueTypeCode: undefined,
  region: undefined,
  initialRegion: undefined,
}

export const useVenueMapStore = create<VenueMapStoreState>()(() => DEFAULT_STATE)

export const setOffersPlaylistType = (offersPlaylistType: PlaylistType) => {
  useVenueMapStore.setState({ offersPlaylistType })
}
export const setRegion = (region: Region) => {
  const currentRegion = useVenueMapStore.getState().region
  if (
    currentRegion?.latitude !== region.latitude ||
    currentRegion?.longitude !== region.longitude
  ) {
    return useVenueMapStore.setState({ region })
  }
}
export const setInitialRegion = (initialRegion: Region) => {
  useVenueMapStore.setState({ initialRegion })
}
export const setVenues = (venues: GeolocatedVenue[]) => {
  useVenueMapStore.setState({ venues })
}
export const setVenueTypeCode = (venueTypeCode: VenueTypeCode | null) =>
  useVenueMapStore.setState({ venueTypeCode })
export const setSelectedVenue = (selectedVenue: GeolocatedVenue) =>
  useVenueMapStore.setState({ selectedVenue })
export const removeSelectedVenue = () => useVenueMapStore.setState({ selectedVenue: undefined })
export const clearVenueMapStore = () => useVenueMapStore.setState(DEFAULT_STATE)
