import { FetchAlgoliaParameters, LocationType, AlgoliaGeolocation } from 'libs/algolia'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
import { SuggestedPlace } from 'libs/place'

import { clampPrice, addOrRemove } from './reducer.helpers'

export type SearchParameters = Omit<FetchAlgoliaParameters, 'hitsPerPage' | 'page' | 'query'>
export type SearchState = SearchParameters & { showResults: boolean; query: string }

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
  locationType: LocationType.EVERYWHERE,
  geolocation: null,
  date: null,
  timeRange: null,
  showResults: false,
  place: null,
  query: '',
}

export type Action =
  | { type: 'INIT' }
  | { type: 'SET_STATE'; payload: Partial<SearchState> }
  | { type: 'INIT_FROM_SEE_MORE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'RADIUS'; payload: number }
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
  | { type: 'LOCATION_AROUND_ME'; payload: AlgoliaGeolocation }
  | { type: 'LOCATION_EVERYWHERE' }
  | { type: 'LOCATION_PLACE'; payload: SuggestedPlace }
  | { type: 'SET_QUERY'; payload: string }

export const searchReducer = (state: SearchState, action: Action): SearchState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialSearchState, showResults: state.showResults }
    case 'SET_STATE':
      return { ...initialSearchState, ...action.payload }
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
    case 'RADIUS':
      return { ...state, aroundRadius: action.payload }
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
    case 'LOCATION_AROUND_ME':
      return {
        ...state,
        locationType: LocationType.AROUND_ME,
        geolocation: action.payload,
        place: null,
      }
    case 'LOCATION_EVERYWHERE':
      return {
        ...state,
        locationType: LocationType.EVERYWHERE,
        geolocation: null,
        place: null,
      }
    case 'LOCATION_PLACE':
      return {
        ...state,
        locationType: LocationType.PLACE,
        geolocation: action.payload.geolocation,
        place: action.payload,
      }
    case 'SET_QUERY':
      return {
        ...state,
        query: action.payload,
      }
    default:
      return state
  }
}
