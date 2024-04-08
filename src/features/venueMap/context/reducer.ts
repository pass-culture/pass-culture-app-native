import { VenueTypeCode } from 'libs/parsers/venueType'

type Action = { type: 'INIT' } | { type: 'SET_VENUE_TYPE_CODE'; payload: VenueTypeCode | null }

type VenueMapState = {
  venueTypeCode: VenueTypeCode | null
}

export type VenueMapContextType = {
  venueMapState: VenueMapState
  dispatch: React.Dispatch<Action>
}

export const initialVenueMapState: VenueMapState = {
  venueTypeCode: null,
}

export const venueMapReducer = (state: VenueMapState, action: Action): VenueMapState => {
  switch (action.type) {
    case 'INIT':
      return initialVenueMapState
    case 'SET_VENUE_TYPE_CODE':
      return { ...state, venueTypeCode: action.payload }
    default:
      return state
  }
}
