import { Venue } from 'features/venue/types'
import { VenueTypeCode } from 'libs/parsers/venueType'

type Action =
  | { type: 'INIT' }
  | { type: 'SET_VENUE_TYPE_CODE'; payload: VenueTypeCode | null }
  | { type: 'SET_VENUES'; payload: Venue[] }

type VenueMapState = {
  venueTypeCode: VenueTypeCode | null
  venues: Venue[]
}

export type VenueMapContextType = {
  venueMapState: VenueMapState
  dispatch: React.Dispatch<Action>
}

export const initialVenueMapState: VenueMapState = {
  venueTypeCode: null,
  venues: [],
}

export const venueMapReducer = (state: VenueMapState, action: Action): VenueMapState => {
  switch (action.type) {
    case 'INIT':
      return initialVenueMapState
    case 'SET_VENUE_TYPE_CODE':
      return { ...state, venueTypeCode: action.payload }
    case 'SET_VENUES':
      return { ...state, venues: action.payload }
    default:
      return state
  }
}
