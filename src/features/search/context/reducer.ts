import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'

export const initialSearchState: SearchState = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 20,
  locationFilter: { locationType: LocationMode.EVERYWHERE },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  isDigital: false,
  priceRange: null,
  query: '',
  tags: [],
  timeRange: null,
  view: SearchView.Landing,
  venue: undefined,
}

export type Action =
  | { type: 'SET_STATE'; payload: SearchState }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SET_LOCATION_EVERYWHERE' }
  | { type: 'SET_LOCATION_AROUND_ME'; payload?: number }
  | { type: 'SET_LOCATION_PLACE'; payload: { aroundRadius?: number; place: SuggestedPlace } }
  | { type: 'SET_VENUE'; payload?: Venue }
  | {
      type: 'SET_LOCATION_FILTERS'
      payload: { locationFilter: SearchState['locationFilter'] }
    }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload
    case 'PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'SELECT_DATE':
      if (!state.date) return state
      return { ...state, date: { ...state.date, selectedDate: action.payload.toISOString() } }
    case 'SET_LOCATION_AROUND_ME':
      return {
        ...state,
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
          aroundRadius: action.payload ?? MAX_RADIUS,
        },
      }
    case 'SET_LOCATION_EVERYWHERE':
      return { ...state, locationFilter: { locationType: LocationMode.EVERYWHERE } }
    case 'SET_LOCATION_PLACE':
      return {
        ...state,
        locationFilter: {
          locationType: LocationMode.AROUND_PLACE,
          place: action.payload.place,
          aroundRadius: action.payload.aroundRadius ?? MAX_RADIUS,
        },
      }
    case 'SET_VENUE':
      return {
        ...state,
        venue: action.payload,
      }
    case 'SET_LOCATION_FILTERS':
      return {
        ...state,
        locationFilter: action.payload.locationFilter,
      }
    default:
      return state
  }
}
