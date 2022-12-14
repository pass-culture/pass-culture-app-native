import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter, SearchState, UserData } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { SearchHit } from 'libs/search'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, act, waitFor } from 'tests/utils'
import { theme } from 'theme'

jest.mock('react-query')

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
jest.mock('features/search/context/SearchWrapper', () => ({
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
let mockUserData: UserData[] = []
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: mockHits,
    nbHits: mockNbHits,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    userData: mockUserData,
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
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(render(<SearchResults />)).toMatchSnapshot()
    })
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
    await waitFor(() => {
      flatlist.props.onEndReached()
    })
    expect(analytics.logSearchScrollToPage).not.toHaveBeenCalled()
  })

  describe('Category filter', () => {
    it('should display category filter button', async () => {
      const { getByTestId } = render(<SearchResults />)

      await waitFor(() => {
        expect(getByTestId('categoryButton')).toBeTruthy()
      })
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      const { getByTestId } = render(<SearchResults />)
      const categoryButton = getByTestId('categoryButton')

      await waitFor(() => {
        fireEvent.press(categoryButton)
      })

      const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeTruthy()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      useRoute.mockReturnValueOnce({
        params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
      })
      const { getByTestId } = render(<SearchResults />)

      const categoryButtonIcon = getByTestId('categoryButtonIcon')
      await waitFor(() => {
        expect(categoryButtonIcon).toBeTruthy()
      })

      const categoryButton = getByTestId('categoryButton')
      expect(categoryButton).toHaveStyle({ borderColor: theme.colors.primary })

      const categoryButtonLabel = getByTestId('categoryButtonLabel')
      expect(categoryButtonLabel).toHaveStyle({ color: theme.colors.primary })
    })
  })

  describe('Price filter', () => {
    it('should display price filter button', async () => {
      const { getByTestId } = render(<SearchResults />)

      await waitFor(() => {
        expect(getByTestId('priceButton')).toBeTruthy()
      })
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      const { getByTestId } = render(<SearchResults />)
      const priceButton = getByTestId('priceButton')

      await waitFor(() => {
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
      await waitFor(() => {
        expect(priceButtonIcon).toBeTruthy()
      })

      const priceButton = getByTestId('priceButton')
      expect(priceButton).toHaveStyle({ borderColor: theme.colors.primary })

      const priceButtonLabel = getByTestId('priceButtonLabel')
      expect(priceButtonLabel).toHaveStyle({ color: theme.colors.primary })
    })
  })

  describe('Offer type filter', () => {
    it('should display type filter button', async () => {
      const { getByTestId } = render(<SearchResults />)

      await waitFor(() => {
        expect(getByTestId('typeButton')).toBeTruthy()
      })
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      const { getByTestId, queryByTestId } = render(<SearchResults />)
      const typeButton = getByTestId('typeButton')

      await waitFor(() => {
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

        await waitFor(() => {
          const typeButtonIcon = getByTestId('typeButtonIcon')
          expect(typeButtonIcon).toBeTruthy()
        })

        const typeButton = getByTestId('typeButton')
        expect(typeButton).toHaveStyle({ borderColor: theme.colors.primary })

        const typeButtonLabel = getByTestId('typeButtonLabel')
        expect(typeButtonLabel).toHaveStyle({ color: theme.colors.primary })
      }
    )
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })

    it.each`
      filter                                                      | params
      ${'digital offer'}                                          | ${{ offerTypes: { isDigital: true, isEvent: false, isThing: false } }}
      ${`${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE} category`}  | ${{ offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE] }}
      ${`${SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE} category`} | ${{ offerCategories: [SearchGroupNameEnumv2.PLATEFORMES_EN_LIGNE] }}
    `('when $filter filter selected and position is null', async ({ params }) => {
      mockPosition = null
      useRoute.mockReturnValueOnce({
        params,
      })
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })

    it('when position is null and no results search', async () => {
      mockPosition = null
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })
  })

  describe('Location filter', () => {
    it('should display location filter button', async () => {
      const { getByTestId } = render(<SearchResults />)
      await waitFor(() => {
        expect(getByTestId('locationButton')).toBeTruthy()
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

        await waitFor(() => {
          expect(queryByText(locationButtonLabel)).toBeTruthy()
        })
      }
    )
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      const { queryByTestId } = render(<SearchResults />)
      await waitFor(() => {
        expect(queryByTestId('datesHoursButton')).toBeTruthy()
      })
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      const { getByTestId } = render(<SearchResults />)
      const datesHoursButton = getByTestId('datesHoursButton')

      await waitFor(() => {
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
        await waitFor(() => {
          expect(datesHoursButtonIcon).toBeTruthy()
        })

        const datesHoursButton = getByTestId('datesHoursButton')
        expect(datesHoursButton).toHaveStyle({ borderColor: theme.colors.primary })

        const datesHoursButtonLabel = getByTestId('datesHoursButtonLabel')
        expect(datesHoursButtonLabel).toHaveStyle({ color: theme.colors.primary })
      }
    )
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    const { getByText } = render(<SearchResults />)

    await waitFor(() => {
      fireEvent.press(getByText('Géolocalise-toi'))
    })

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    const { getByText } = render(<SearchResults />)

    await waitFor(() => {
      fireEvent.press(getByText('Géolocalise-toi'))
    })

    expect(analytics.logActivateGeolocfromSearchResults).toHaveBeenCalledTimes(1)
  })

  describe('should display geolocation incitation button', () => {
    beforeAll(() => {
      mockPosition = null
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
    })

    it('when position is null', async () => {
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Géolocalise-toi')).toBeTruthy()
      })
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUserData = [{ message: "n'est pas disponible sur le pass Culture." }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })
  })

  describe('Offer unavailable message', () => {
    it('should display when query is an unavailable offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = [{ message: 'Offre non disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Offre non disponible sur le pass Culture.')).toBeTruthy()
      })
    })

    it('should not display when query is an available offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = []
      mockSearchState = { ...searchState, query: 'Deezer' }
      const { queryByText } = render(<SearchResults />)

      await waitFor(() => {
        expect(queryByText('Offre non disponible sur le pass Culture.')).toBeFalsy()
      })
    })
  })
})
