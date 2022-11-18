import React from 'react'

import { initialSearchState } from 'features/search/context/reducer/reducer'
import { GeoCoordinates } from 'libs/geolocation'
import { render, superFlushWithAct } from 'tests/utils'

import { SearchResults } from './SearchResults'

jest.mock('react-query')

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/pages/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
const mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

describe('SearchResults component', () => {
  it('should render correctly', async () => {
    jest.useFakeTimers()
    await superFlushWithAct()
    jest.advanceTimersByTime(2000)
    expect(render(<SearchResults />)).toMatchSnapshot()
    jest.useRealTimers()
    await superFlushWithAct()
  })
})
