import { Hit } from '@algolia/client-search'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { addOrRemove, MAX_RADIUS, sortCategories } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { AlgoliaVenue } from 'libs/algolia'
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
  | { type: 'INIT' }
  | { type: 'SET_STATE_FROM_DEFAULT'; payload: Partial<SearchState> }
  | { type: 'SET_STATE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'SET_MIN_PRICE'; payload: string }
  | { type: 'SET_MAX_PRICE'; payload: string }
  | { type: 'RADIUS'; payload: number }
  | { type: 'TIME_RANGE'; payload: SearchState['timeRange'] }
  | { type: 'TOGGLE_IS_DIGITAL'; payload: SearchState['isDigital'] }
  | { type: 'SET_CATEGORY'; payload: SearchGroupNameEnumv2[] }
  | { type: 'TOGGLE_CATEGORY'; payload: SearchGroupNameEnumv2 }
  | { type: 'TOGGLE_OFFER_FREE' }
  | { type: 'TOGGLE_OFFER_DUO' }
  | { type: 'TOGGLE_OFFER_NEW' }
  | { type: 'TOGGLE_DATE' }
  | { type: 'TOGGLE_HOUR' }
  | { type: 'SELECT_DATE_FILTER_OPTION'; payload: DATE_FILTER_OPTIONS }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SET_LOCATION_EVERYWHERE' }
  | { type: 'SET_LOCATION_AROUND_ME'; payload?: number }
  | { type: 'SET_LOCATION_PLACE'; payload: { aroundRadius?: number; place: SuggestedPlace } }
  | { type: 'SET_VENUE'; payload?: Venue }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_VENUES'; payload: Hit<AlgoliaVenue>[] }
  | {
      type: 'SET_LOCATION_FILTERS'
      payload: { locationFilter: SearchState['locationFilter'] }
    }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialSearchState, view: state.view }
    case 'SET_STATE_FROM_DEFAULT':
      return { ...initialSearchState, ...action.payload }
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload,
      }
    case 'PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'SET_MIN_PRICE':
      return { ...state, minPrice: action.payload }
    case 'SET_MAX_PRICE':
      return { ...state, maxPrice: action.payload }
    case 'RADIUS':
      if ('aroundRadius' in state.locationFilter) {
        return {
          ...state,
          locationFilter: { ...state.locationFilter, aroundRadius: action.payload },
        }
      } else {
        return state
      }
    case 'TIME_RANGE':
      return { ...state, timeRange: action.payload }
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        offerCategories: addOrRemove(state.offerCategories, action.payload).sort(sortCategories),
      }
    case 'SET_CATEGORY':
      return { ...state, offerCategories: [...action.payload].sort(sortCategories) }
    case 'TOGGLE_IS_DIGITAL':
      return {
        ...state,
        isDigital: action.payload,
      }
    case 'TOGGLE_OFFER_FREE':
      return { ...state, offerIsFree: !state.offerIsFree }
    case 'TOGGLE_OFFER_DUO':
      return { ...state, offerIsDuo: !state.offerIsDuo }
    case 'TOGGLE_OFFER_NEW':
      return { ...state, offerIsNew: !state.offerIsNew }
    case 'TOGGLE_DATE':
      if (state.date) return { ...state, date: null }
      return {
        ...state,
        date: {
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: new Date().toISOString(),
        },
      }
    case 'TOGGLE_HOUR':
      if (state.timeRange) return { ...state, timeRange: null }
      return {
        ...state,
        timeRange: [8, 24],
      }
    case 'SELECT_DATE_FILTER_OPTION':
      if (!state.date) return state
      return { ...state, date: { ...state.date, option: action.payload } }
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
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_LOCATION_FILTERS':
      return {
        ...state,
        locationFilter: action.payload.locationFilter,
      }
    default:
      return state
  }
}
