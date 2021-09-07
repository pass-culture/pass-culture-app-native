import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'

import { addOrRemove, clampPrice } from './reducer.helpers'

export const initialSearchState: SearchState = {
  beginningDatetime: null,
  date: null,
  endingDatetime: null,
  hitsPerPage: 20,
  locationFilter: {
    aroundRadius: null,
    geolocation: null,
    locationType: LocationType.EVERYWHERE,
    place: null,
    venueId: null,
  },
  offerCategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: {
    isDigital: false,
    isEvent: false,
    isThing: false,
  },
  priceRange: null,
  query: '',
  showResults: false,
  tags: [],
  timeRange: null,
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
  | { type: 'LOCATION_AROUND_ME'; payload: SearchState['locationFilter']['geolocation'] }
  | { type: 'LOCATION_EVERYWHERE' }
  | { type: 'LOCATION_PLACE'; payload: Omit<SuggestedPlace, 'venueId'> }
  | { type: 'LOCATION_VENUE'; payload: SuggestedPlace }
  | { type: 'RESET_LOCATION'; payload: GeoCoordinates | null }
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
      return { ...state, locationFilter: { ...state.locationFilter, aroundRadius: action.payload } }
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
        locationFilter: {
          locationType: LocationType.AROUND_ME,
          geolocation: action.payload,
          place: null,
          aroundRadius: 100,
          venueId: null,
        },
      }
    case 'LOCATION_EVERYWHERE':
      return {
        ...state,
        locationFilter: {
          locationType: LocationType.EVERYWHERE,
          geolocation: null,
          place: null,
          aroundRadius: null,
          venueId: null,
        },
      }
    case 'LOCATION_PLACE':
      return {
        ...state,
        locationFilter: {
          locationType: LocationType.PLACE,
          geolocation: action.payload.geolocation,
          place: action.payload,
          aroundRadius: 100,
          venueId: null,
        },
      }
    case 'LOCATION_VENUE':
      return {
        ...state,
        locationFilter: {
          aroundRadius: null,
          locationType: LocationType.PLACE,
          geolocation: action.payload.geolocation,
          place: {
            label: action.payload.label,
            info: action.payload.info,
            geolocation: action.payload.geolocation,
          },
          venueId: action.payload.venueId,
        },
      }
    case 'RESET_LOCATION':
      if (action.payload) {
        return {
          ...state,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            geolocation: action.payload,
            place: null,
            aroundRadius: 100,
            venueId: null,
          },
        }
      } else {
        return {
          ...state,
          locationFilter: {
            locationType: LocationType.EVERYWHERE,
            geolocation: null,
            place: null,
            aroundRadius: null,
            venueId: null,
          },
        }
      }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    default:
      return state
  }
}
