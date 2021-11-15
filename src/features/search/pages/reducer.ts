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
  let newState = state

  if (action.type === 'INIT') newState = initialSearchState
  if (action.type === 'SET_STATE') newState = { ...initialSearchState, ...action.payload }
  if (action.type === 'SET_STATE_FROM_NAVIGATE') {
    const priceRange = action.payload.priceRange
      ? clampPrice(action.payload.priceRange)
      : initialSearchState.priceRange
    newState = { ...initialSearchState, ...action.payload, priceRange }
  }
  if (action.type === 'PRICE_RANGE') newState = { ...state, priceRange: action.payload }
  if (action.type === 'RADIUS') {
    if ('aroundRadius' in state.locationFilter) {
      newState = {
        ...state,
        locationFilter: { ...state.locationFilter, aroundRadius: action.payload },
      }
    }
  }
  if (action.type === 'TIME_RANGE') newState = { ...state, timeRange: action.payload }
  if (action.type === 'TOGGLE_CATEGORY')
    newState = {
      ...state,
      offerCategories: addOrRemove(state.offerCategories, action.payload).sort(sortCategories),
    }
  if (action.type === 'SET_CATEGORY')
    newState = { ...state, offerCategories: action.payload.sort(sortCategories) }
  if (action.type === 'OFFER_TYPE')
    newState = {
      ...state,
      offerTypes: { ...state.offerTypes, [action.payload]: !state.offerTypes[action.payload] },
    }
  if (action.type === 'TOGGLE_OFFER_FREE') newState = { ...state, offerIsFree: !state.offerIsFree }
  if (action.type === 'TOGGLE_OFFER_DUO') newState = { ...state, offerIsDuo: !state.offerIsDuo }
  if (action.type === 'TOGGLE_OFFER_NEW') newState = { ...state, offerIsNew: !state.offerIsNew }
  if (action.type === 'TOGGLE_DATE') {
    if (state.date) newState = { ...state, date: null }
    else
      newState = {
        ...state,
        date: {
          option: DATE_FILTER_OPTIONS.TODAY,
          selectedDate: new Date(),
        },
      }
  }
  if (action.type === 'TOGGLE_HOUR') {
    if (state.timeRange) newState = { ...state, timeRange: null }
    else
      newState = {
        ...state,
        timeRange: [8, 24],
      }
  }
  if (action.type === 'SELECT_DATE_FILTER_OPTION') {
    if (state.date) newState = { ...state, date: { ...state.date, option: action.payload } }
  }
  if (action.type === 'SELECT_DATE') {
    if (state.date) newState = { ...state, date: { ...state.date, selectedDate: action.payload } }
  }
  if (action.type === 'SET_LOCATION_AROUND_ME') {
    newState = {
      ...state,
      locationFilter: {
        locationType: LocationType.AROUND_ME,
        aroundRadius: action.payload ?? MAX_RADIUS,
      },
    }
  }
  if (action.type === 'SET_LOCATION_EVERYWHERE')
    newState = { ...state, locationFilter: { locationType: LocationType.EVERYWHERE } }
  if (action.type === 'SET_LOCATION_PLACE')
    newState = {
      ...state,
      locationFilter: {
        locationType: LocationType.PLACE,
        place: action.payload.place,
        aroundRadius: action.payload.aroundRadius ?? MAX_RADIUS,
      },
    }
  if (action.type === 'SET_LOCATION_VENUE')
    newState = {
      ...state,
      locationFilter: { locationType: LocationType.VENUE, venue: action.payload },
    }
  if (action.type === 'SET_QUERY') newState = { ...state, query: action.payload }

  return newState
}
