import { render } from '@testing-library/react-native'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'

import { initialSearchState } from '../reducer'
import { Search } from '../Search'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const parameters = {
  aroundRadius: null,
  beginningDatetime: null,
  endingDatetime: null,
  geolocation: { latitude: 48.8557, longitude: 2.3469 },
  hitsPerPage: 8,
  locationType: 'EVERYWHERE',
  offerCategories: ['CINEMA'],
  offerIsDuo: false,
  offerIsFree: false,
  offerIsNew: false,
  offerTypes: { isDigital: false, isEvent: false, isThing: false },
  priceRange: [0, 500],
  tags: [],
}

describe('Search component', () => {
  beforeAll(() => {
    useRoute.mockImplementation(() => ({ params: {} }))
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should render correctly', () => {
    const { toJSON } = render(<Search />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should handle coming from "See More" correctly', () => {
    useRoute.mockImplementation(() => ({ params: { parameters } }))
    render(<Search />)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT_FROM_SEE_MORE', payload: parameters })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SHOW_RESULTS', payload: true })
  })
})
