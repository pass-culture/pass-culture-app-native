import { FetchAlgoliaParameters } from 'libs/algolia'

export type SearchState = Omit<
  FetchAlgoliaParameters,
  'hitsPerPage' | 'page' | 'sortBy' | 'keywords'
>

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
}

export type Action =
  | { type: 'INIT' }
  | { type: 'INIT_FROM_SEE_MORE'; payload: Partial<SearchState> }
  | { type: 'PRICE_RANGE'; payload: SearchState['priceRange'] }
  | { type: 'CATEGORIES'; payload: string }

export const searchReducer = (state: SearchState, action: Action) => {
  switch (action.type) {
    case 'INIT':
      return initialSearchState
    case 'INIT_FROM_SEE_MORE':
      return { ...state, ...action.payload }
    case 'PRICE_RANGE':
      return { ...state, priceRange: action.payload }
    case 'CATEGORIES':
      if (state.offerCategories.includes(action.payload)) {
        return {
          ...state,
          offerCategories: state.offerCategories.filter((category) => category !== action.payload),
        }
      } else {
        return { ...state, offerCategories: [...state.offerCategories, action.payload] }
      }
    default:
      return state
  }
}
