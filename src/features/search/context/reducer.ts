import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

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
  isDigital: false,
  priceRange: null,
  query: '',
  tags: [],
  timeRange: null,
  view: SearchView.Landing,
  venue: undefined,
  gtls: [],
}

export type Action =
  | { type: 'SET_STATE'; payload: SearchState }
  | { type: 'SET_LOCATION_EVERYWHERE' }
  | { type: 'SET_LOCATION_AROUND_ME'; payload?: number }
  | { type: 'SET_LOCATION_PLACE'; payload: { aroundRadius?: number; place: SuggestedPlace } }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload
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
    default:
      return state
  }
}
