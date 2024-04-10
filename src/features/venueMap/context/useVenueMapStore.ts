import { create } from 'zustand'

import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueTypeCode } from 'libs/parsers/venueType'

type State = {
  venueTypeCode: VenueTypeCode | null
  venues: Venue[]
  selectedVenue: GeolocatedVenue | null
}
type Actions = {
  setVenueTypeCode: (payload: VenueTypeCode | null) => void
  setVenues: (payload: Venue[]) => void
  setSelectedVenue: (payload: GeolocatedVenue | null) => void
}

export type Store = State & Actions

export const useVenueMapStore = create<Store>((set) => ({
  venueTypeCode: null,
  venues: [],
  selectedVenue: null,
  setVenueTypeCode: (payload) => set({ venueTypeCode: payload }),
  setVenues: (payload) => set({ venues: payload }),
  setSelectedVenue: (payload) => set({ selectedVenue: payload }),
}))
