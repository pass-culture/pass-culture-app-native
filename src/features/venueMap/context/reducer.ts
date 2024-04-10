import { Venue } from 'features/venue/types'
import { GeolocatedVenue } from 'features/venueMap/components/VenueMapView/types'
import { VenueTypeCode } from 'libs/parsers/venueType'

type Action =
  | { type: 'INIT' }
  | { type: 'SET_VENUE_TYPE_CODE'; payload: VenueTypeCode | null }
  | { type: 'SET_VENUES'; payload: Venue[] }
  | { type: 'SET_SELECTED_VENUE'; payload: GeolocatedVenue | null }

type VenueMapState = {
  venueTypeCode: VenueTypeCode | null
  venues: Venue[]
  selectedVenue: GeolocatedVenue | null
}

export type VenueMapContextType = {
  venueMapState: VenueMapState
  dispatch: React.Dispatch<Action>
}

export const initialVenueMapState: VenueMapState = {
  venueTypeCode: null,
  venues: [],
  selectedVenue: null,
}

export const venueMapReducer = (state: VenueMapState, action: Action): VenueMapState => {
  switch (action.type) {
    case 'INIT':
      return initialVenueMapState
    case 'SET_VENUE_TYPE_CODE':
      return { ...state, venueTypeCode: action.payload }
    case 'SET_VENUES':
      return { ...state, venues: action.payload }
    case 'SET_SELECTED_VENUE':
      return { ...state, selectedVenue: action.payload }
    default:
      return state
  }
}
