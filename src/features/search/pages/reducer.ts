import { FetchAlgoliaParameters } from 'libs/algolia'
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
  searchAround: false,
  geolocation: null,
  date: null,
  timeRange: null,
  showResults: false,
}

export type Action =
  | { type: 'INIT' }
  | { type: 'INIT_FROM_SEE_MORE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'CATEGORIES'; payload: string }
  | { type: 'OFFER_TYPE'; payload: keyof SearchState['offerTypes'] }
  | { type: 'SHOW_RESULTS'; payload: boolean }
  | { type: 'TOGGLE_OFFER_FREE' }
  | { type: 'TOGGLE_OFFER_DUO' }
  | { type: 'TOGGLE_OFFER_NEW' }
  | { type: 'TOGGLE_DATE' }
  | { type: 'SELECT_DATE_FILTER_OPTION'; payload: DATE_FILTER_OPTIONS }
  | { type: 'SELECT_DATE'; payload: Date }

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
    case 'CATEGORIES':
      return {
        ...state,
        offerCategories: addOrRemove(state.offerCategories, action.payload),
      }
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
    case 'SELECT_DATE_FILTER_OPTION':
      if (!state.date) return state
      return { ...state, date: { ...state.date, option: action.payload } }
    case 'SELECT_DATE':
      if (!state.date) return state
      return { ...state, date: { ...state.date, selectedDate: action.payload } }
    default:
      return state
  }
}
