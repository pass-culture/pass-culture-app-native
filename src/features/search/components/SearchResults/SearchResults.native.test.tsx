import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { LocationType } from 'features/search/enums'
import { LocationFilter, SearchState } from 'features/search/types'
import { MAX_RADIUS } from 'features/search/utils/reducer.helpers'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { SearchHit } from 'libs/search'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, act, superFlushWithAct } from 'tests/utils'
import { theme } from 'theme'

jest.mock('react-query')

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
let mockHits: SearchHit[] = []
let mockNbHits = 0
let mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/pages/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: mockHits,
    nbHits: mockNbHits,
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
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: SuggestedVenue = mockedSuggestedVenues[0]

describe('SearchResults component', () => {
  beforeAll(() => {
    mockHits = []
    mockNbHits = 0
  })

  it('should render correctly', async () => {
    jest.useFakeTimers()
    await superFlushWithAct()
    jest.advanceTimersByTime(2000)
    expect(render(<SearchResults />)).toMatchSnapshot()
    jest.useRealTimers()
    await superFlushWithAct()
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', async () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    const { getByTestId } = render(<SearchResults />)
    const flatlist = getByTestId('searchResultsFlatlist')

    mockData.pages.push({ hits: [], page: 1, nbHits: 0 })
    await act(async () => {
      flatlist.props.onEndReached()
    })
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1, searchId)

    mockData.pages.push({ hits: [], page: 2, nbHits: 0 })
    await act(async () => {
      flatlist.props.onEndReached()
    })
    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2, searchId)
  })

  it('should not log SearchScrollToPage when hitting the bottom of the page if no more results', async () => {
    mockHasNextPage = false
    const { getByTestId } = render(<SearchResults />)
    const flatlist = getByTestId('searchResultsFlatlist')
    await act(async () => {
      flatlist.props.onEndReached()
    })
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })

  it('should display location filter button', async () => {
    const { queryByTestId } = render(<SearchResults />)
    await act(async () => {
      expect(queryByTestId('locationButton')).toBeTruthy()
    })
  })

  it('should open the categories filter modal when pressing the category button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const categoryButton = getByTestId('categoryButton')

    await act(async () => {
      fireEvent.press(categoryButton)
    })

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

  it('should display category filter button', async () => {
    const { queryByTestId } = render(<SearchResults />)

    await act(async () => {
      expect(queryByTestId('categoryButton')).toBeTruthy()
    })
  })

  it('should display an icon and change color in category button when has category selected', async () => {
    useRoute.mockReturnValueOnce({
      params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
    })
    const { getByTestId } = render(<SearchResults />)

    const categoryButtonIcon = getByTestId('categoryButtonIcon')
    await act(async () => {
      expect(categoryButtonIcon).toBeTruthy()
    })

    const categoryButton = getByTestId('categoryButton')
    expect(categoryButton).toHaveStyle({ borderColor: theme.colors.primary })

    const categoryButtonLabel = getByTestId('categoryButtonLabel')
    expect(categoryButtonLabel).toHaveStyle({ color: theme.colors.primary })
  })

  it('should display price filter button', async () => {
    const { queryByTestId } = render(<SearchResults />)

    await act(async () => {
      expect(queryByTestId('priceButton')).toBeTruthy()
    })
  })

  it('should open the prices filter modal when pressing the prices filter button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const priceButton = getByTestId('priceButton')

    await act(async () => {
      fireEvent.press(priceButton)
    })

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

  it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
    useRoute.mockReturnValueOnce({
      params: { minPrice: '5' },
    })
    const { getByTestId } = render(<SearchResults />)

    const priceButtonIcon = getByTestId('priceButtonIcon')
    await act(async () => {
      expect(priceButtonIcon).toBeTruthy()
    })

    const priceButton = getByTestId('priceButton')
    expect(priceButton).toHaveStyle({ borderColor: theme.colors.primary })

    const priceButtonLabel = getByTestId('priceButtonLabel')
    expect(priceButtonLabel).toHaveStyle({ color: theme.colors.primary })
  })

  it('should display type filter button', async () => {
    const { queryByTestId } = render(<SearchResults />)

    await act(async () => {
      expect(queryByTestId('typeButton')).toBeTruthy()
    })
  })

  it('should open the type filter modal when pressing the type filter button', async () => {
    const { getByTestId, queryByTestId } = render(<SearchResults />)
    const typeButton = getByTestId('typeButton')

    await act(async () => {
      fireEvent.press(typeButton)
    })

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()

    const isInverseLayout = queryByTestId('inverseLayout')

    expect(isInverseLayout).toBeFalsy()
  })

  it.each`
    type               | params
    ${'duo offer'}     | ${{ offerIsDuo: true }}
    ${'digital offer'} | ${{ offerTypes: { isDigital: true, isEvent: false, isThing: false } }}
    ${'event offer'}   | ${{ offerTypes: { isDigital: false, isEvent: true, isThing: false } }}
    ${'thing offer'}   | ${{ offerTypes: { isDigital: false, isEvent: false, isThing: true } }}
  `(
    'should display an icon and change color in type button when has $type selected',
    async ({ params }) => {
      useRoute.mockReturnValueOnce({
        params,
      })
      const { getByTestId } = render(<SearchResults />)

      const typeButtonIcon = getByTestId('typeButtonIcon')
      await act(async () => {
        expect(typeButtonIcon).toBeTruthy()
      })

      const typeButton = getByTestId('typeButton')
      expect(typeButton).toHaveStyle({ borderColor: theme.colors.primary })

      const typeButtonLabel = getByTestId('typeButtonLabel')
      expect(typeButtonLabel).toHaveStyle({ color: theme.colors.primary })
    }
  )

  it('should not display geolocation incitation button when position is not null', async () => {
    const { queryByText } = render(<SearchResults />)

    await act(async () => {
      expect(queryByText('Géolocalise-toi')).toBeFalsy()
    })
  })

  it.each`
    filter                                                      | params
    ${'digital offer'}                                          | ${{ offerTypes: { isDigital: true, isEvent: false, isThing: false } }}
    ${`${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE} category`}  | ${{ offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE] }}
    ${`${SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE} category`} | ${{ offerCategories: [SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE] }}
  `(
    'should not display geolocation incitation button when $filter filter selected and position is null',
    async ({ params }) => {
      mockPosition = null
      useRoute.mockReturnValueOnce({
        params,
      })
      const { queryByText } = render(<SearchResults />)

      await act(async () => {
        expect(queryByText('Géolocalise-toi')).toBeFalsy()
      })
    }
  )

  it('should not display geolocation incitation button when position is null and no results search', async () => {
    mockPosition = null
    const { queryByText } = render(<SearchResults />)

    await act(async () => {
      expect(queryByText('Géolocalise-toi')).toBeFalsy()
    })
  })

  it.each`
    locationType               | locationFilter                                                                   | position            | locationButtonLabel
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${DEFAULT_POSITION} | ${'Partout'}
    ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${null}             | ${'Localisation'}
    ${LocationType.AROUND_ME}  | ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${DEFAULT_POSITION} | ${'Autour de moi'}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
    ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${DEFAULT_POSITION} | ${venue.label}
    ${LocationType.VENUE}      | ${{ locationType: LocationType.VENUE, venue }}                                   | ${null}             | ${venue.label}
  `(
    'should display $locationButtonLabel in location filter button label when location type is $locationType and position is $position',
    async ({
      locationFilter,
      position,
      locationButtonLabel,
    }: {
      locationFilter: LocationFilter
      position: GeoCoordinates | null
      locationButtonLabel: string
    }) => {
      mockPosition = position
      mockSearchState = { ...searchState, locationFilter }

      const { queryByText } = render(<SearchResults />)

      await act(async () => {
        expect(queryByText(locationButtonLabel)).toBeTruthy()
      })
    }
  )

  it('should display dates and hours filter button', async () => {
    const { queryByTestId } = render(<SearchResults />)
    await act(async () => {
      expect(queryByTestId('datesHoursButton')).toBeTruthy()
    })
  })

  it('should open the type filter modal when pressing the type filter button', async () => {
    const { getByTestId } = render(<SearchResults />)
    const datesHoursButton = getByTestId('datesHoursButton')

    await act(async () => {
      fireEvent.press(datesHoursButton)
    })

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })

  it.each`
    type       | params
    ${'date'}  | ${{ date: { option: 'today', selectedDate: new Date() } }}
    ${'hours'} | ${{ timeRange: [8, 24] }}
  `(
    'should display an icon and change color in dates and hours filter button when has $type selected',
    async ({ params }: { params: SearchState }) => {
      useRoute.mockReturnValueOnce({
        params,
      })
      const { getByTestId } = render(<SearchResults />)

      const datesHoursButtonIcon = getByTestId('datesHoursButtonIcon')
      await act(async () => {
        expect(datesHoursButtonIcon).toBeTruthy()
      })

      const datesHoursButton = getByTestId('datesHoursButton')
      expect(datesHoursButton).toHaveStyle({ borderColor: theme.colors.primary })

      const datesHoursButtonLabel = getByTestId('datesHoursButtonLabel')
      expect(datesHoursButtonLabel).toHaveStyle({ color: theme.colors.primary })
    }
  )

  it('should display geolocation incitation button when position is null', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    const { queryByText } = render(<SearchResults />)

    await act(async () => {
      expect(queryByText('Géolocalise-toi')).toBeTruthy()
    })
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    const { getByText } = render(<SearchResults />)

    await act(async () => {
      fireEvent.press(getByText('Géolocalise-toi'))
    })

    expect(mockShowGeolocPermissionModal).toHaveBeenCalled()
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    const { getByText } = render(<SearchResults />)

    await act(async () => {
      fireEvent.press(getByText('Géolocalise-toi'))
    })

    expect(analytics.logActivateGeolocfromSearchResults).toHaveBeenCalledTimes(1)
  })
})
