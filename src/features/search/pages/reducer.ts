import { SuggestedPlace } from 'libs/adresse/types'
import { FetchAlgoliaParameters, LocationType, AlgoliaGeolocation } from 'libs/algolia'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'

import { clampPrice, addOrRemove } from './reducer.helpers'

export type SearchParameters = Omit<
  FetchAlgoliaParameters,
  'hitsPerPage' | 'page' | 'sortBy' | 'keywords'
>
export type SearchState = SearchParameters & { showResults: boolean }

export const initialSearchState: SearchState = {
  aroundRadius: null,
  offerCategories: [],
  tags: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
  beginningDatetime: null,
  endingDatetime: null,
  priceRange: null,
  searchAround: LocationType.EVERYWHERE,
  geolocation: null,
  date: null,
  timeRange: null,
  showResults: false,
  place: null,
}

export const DEFAULT_TIME_RANGE = [8, 24]

export type Action =
  | { type: 'INIT' }
  | { type: 'INIT_FROM_SEE_MORE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'TIME_RANGE'; payload: SearchState['timeRange'] }
  | { type: 'OFFER_TYPE'; payload: keyof SearchState['offerTypes'] }
  | { type: 'SHOW_RESULTS'; payload: boolean }
  | { type: 'SET_CATEGORY'; payload: SearchState['offerCategories'] }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'TOGGLE_OFFER_FREE' }
  | { type: 'TOGGLE_OFFER_DUO' }
  | { type: 'TOGGLE_OFFER_NEW' }
  | { type: 'TOGGLE_DATE' }
  | { type: 'TOGGLE_HOUR' }
  | { type: 'SELECT_DATE_FILTER_OPTION'; payload: DATE_FILTER_OPTIONS }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'LOCATION_TYPE'; payload: LocationType }
  | { type: 'SET_POSITION'; payload: AlgoliaGeolocation | null }
  | { type: 'SET_PLACE'; payload: SuggestedPlace | null }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'INIT':
      return initialSearchState
    case 'SHOW_RESULTS':
      return { ...state, showResults: action.payload }
    case 'INIT_FROM_SEE_MORE':
      return {
        ...state,
        ...action.payload,
        priceRange: clampPrice(action.payload.priceRange),
      }
    case 'PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'TIME_RANGE':
      return { ...state, timeRange: action.payload }
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        offerCategories: addOrRemove(state.offerCategories, action.payload),
      }
    case 'SET_CATEGORY':
      return { ...state, offerCategories: action.payload }
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
    case 'LOCATION_TYPE':
      return { ...state, searchAround: action.payload }
    case 'SET_POSITION':
      return { ...state, geolocation: action.payload }
    case 'SET_PLACE':
      return { ...state, place: action.payload }
    default:
      return state
  }
}
