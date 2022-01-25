import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import {
  MAX_PRICE,
  MAX_RADIUS,
  MIN_PRICE,
  sortCategories,
} from 'features/search/pages/reducer.helpers'
import { SearchState } from 'features/search/types'
import { SuggestedPlace } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'

import { addOrRemove, clampPrice } from './reducer.helpers'

export const initialSearchState: SearchState = {
  beginningDatetime: null,
  date: null,
  endingDatetime: null,
  hitsPerPage: 20,
  locationFilter: { locationType: LocationType.EVERYWHERE },
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
  priceRange: [MIN_PRICE, MAX_PRICE],
  query: '',
  showResults: false,
  tags: [],
  timeRange: null,
}

export type Action =
  | { type: 'INIT' }
  | { type: 'SET_STATE'; payload: Partial<SearchState> }
  | { type: 'SET_STATE_FROM_NAVIGATE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'RADIUS'; payload: number }
  | { type: 'TIME_RANGE'; payload: SearchState['timeRange'] }
  | { type: 'OFFER_TYPE'; payload: keyof SearchState['offerTypes'] }
  | { type: 'SHOW_RESULTS'; payload: boolean }
  | { type: 'SET_CATEGORY'; payload: SearchGroupNameEnum[] }
  | { type: 'TOGGLE_CATEGORY'; payload: SearchGroupNameEnum }
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
  | { type: 'SET_LOCATION_VENUE'; payload: SuggestedVenue }
  | { type: 'SET_QUERY'; payload: string }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialSearchState, showResults: state.showResults }
    case 'SET_STATE':
      return { ...initialSearchState, ...action.payload }
    case 'SHOW_RESULTS':
      return { ...state, showResults: action.payload }
    case 'SET_STATE_FROM_NAVIGATE':
      return {
        ...state,
        ...action.payload,
        priceRange: clampPrice(action.payload.priceRange),
      }
    case 'PRICE_RANGE':
      return { ...state, priceRange: action.payload }
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
      return { ...state, offerCategories: action.payload.sort(sortCategories) }
    case 'OFFER_TYPE':
      return {
        ...state,
        offerTypes: { ...state.offerTypes, [action.payload]: !state.offerTypes[action.payload] },
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
          selectedDate: new Date(),
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
      return { ...state, date: { ...state.date, selectedDate: action.payload } }
    case 'SET_LOCATION_AROUND_ME':
      return {
        ...state,
        locationFilter: {
          locationType: LocationType.AROUND_ME,
          aroundRadius: action.payload ?? MAX_RADIUS,
        },
      }
    case 'SET_LOCATION_EVERYWHERE':
      return { ...state, locationFilter: { locationType: LocationType.EVERYWHERE } }
    case 'SET_LOCATION_PLACE':
      return {
        ...state,
        locationFilter: {
          locationType: LocationType.PLACE,
          place: action.payload.place,
          aroundRadius: action.payload.aroundRadius ?? MAX_RADIUS,
        },
      }
    case 'SET_LOCATION_VENUE':
      return {
        ...state,
        locationFilter: { locationType: LocationType.VENUE, venue: action.payload },
      }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    default:
      return state
  }
}
