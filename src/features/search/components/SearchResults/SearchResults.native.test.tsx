import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter, SearchState, UserData } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { Offer } from 'libs/algolia'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { GeoCoordinates, Position } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, act, waitFor, screen } from 'tests/utils'
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

jest.mock('features/auth/context/AuthContext')
const mockUser = { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 7000 } } }
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  user: mockUser,
  refetchUser: jest.fn(),
  isUserLoading: false,
})

const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
let mockHits: Offer[] = []
let mockNbHits = 0
const mockHasNextPage = true
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
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: Position = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: Venue = mockedSuggestedVenues[0]

describe('SearchResults component', () => {
  beforeAll(() => {
    mockHits = []
    mockNbHits = 0
  })

  afterEach(() => {
    mockHits = []
    mockNbHits = 0
  })

  it('should render correctly', async () => {
    jest.useFakeTimers('legacy')
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(render(<SearchResults />)).toMatchSnapshot()
    })
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', async () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits

    render(<SearchResults />)

    const flashList = screen.getByTestId('searchResultsFlashlist')

    mockData.pages.push({
      hits: [],
      page: 1,
      nbHits: 0,
    })
    await act(async () => {
      flashList.props.onEndReached()
    })
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1, searchId)

    mockData.pages.push({ hits: [], page: 2, nbHits: 0 })
    await act(async () => {
      flashList.props.onEndReached()
    })
    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2, searchId)
  })

  describe('Category filter', () => {
    it('should display category filter button', async () => {
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.getByTestId('Catégories')).toBeTruthy()
      })
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      render(<SearchResults />)
      const categoryButton = screen.getByTestId('Catégories')

      await waitFor(() => {
        fireEvent.press(categoryButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeTruthy()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      useRoute.mockReturnValueOnce({
        params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
      })
      render(<SearchResults />)

      const categoryButtonIcon = screen.getByTestId('categoryButtonIcon')
      await waitFor(() => {
        expect(categoryButtonIcon).toBeTruthy()
      })

      const categoryButton = screen.getByTestId('Catégories\u00a0: Filtre sélectionné')
      expect(categoryButton).toHaveStyle({ borderColor: theme.colors.primary })

      const categoryButtonLabel = screen.getByTestId('categoryButtonLabel')
      expect(categoryButtonLabel).toHaveStyle({ color: theme.colors.primary })
    })
  })

  describe('Price filter', () => {
    it('should display price filter button', async () => {
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.getByTestId('Prix')).toBeTruthy()
      })
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      render(<SearchResults />)
      const priceButton = screen.getByTestId('Prix')

      await waitFor(() => {
        fireEvent.press(priceButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeTruthy()
    })

    it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
      useRoute.mockReturnValueOnce({
        params: { minPrice: '5' },
      })
      render(<SearchResults />)

      const priceButtonIcon = screen.getByTestId('priceButtonIcon')
      await waitFor(() => {
        expect(priceButtonIcon).toBeTruthy()
      })

      const priceButton = screen.getByTestId('Prix\u00a0: Filtre sélectionné')
      expect(priceButton).toHaveStyle({ borderColor: theme.colors.primary })

      const priceButtonLabel = screen.getByTestId('priceButtonLabel')
      expect(priceButtonLabel).toHaveStyle({ color: theme.colors.primary })
    })
  })

  describe('Offer Duo filter', () => {
    describe('When user is logged in and is benificiary with credit', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: true,
          setIsLoggedIn: jest.fn(),
          user: beneficiaryUser,
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
      })

      it('should display Duo filter button', async () => {
        render(<SearchResults />)

        await waitFor(() => {
          expect(screen.getByTestId('Duo')).toBeTruthy()
        })
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        render(<SearchResults />)
        const duoButton = screen.getByTestId('Duo')

        await waitFor(() => {
          fireEvent.press(duoButton)
        })

        const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

        expect(fullscreenModalScrollView).toBeTruthy()

        const isInverseLayout = screen.queryByTestId('inverseLayout')

        expect(isInverseLayout).toBeFalsy()
      })
    })

    describe('when user is logged in and benificiary with no credit', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          user: { ...beneficiaryUser, domainsCredit: { all: { initial: 8000, remaining: 0 } } },
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
      })

      it('should not display Duo filter button', async () => {
        render(<SearchResults />)

        await waitFor(() => {
          expect(screen.queryByText('Duo')).toBeFalsy()
        })
      })
    })

    describe('when user is not logged in', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          user: undefined,
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
      })

      it('should not display Duo offer button', async () => {
        render(<SearchResults />)

        await waitFor(() => {
          expect(screen.queryByText('Duo')).toBeFalsy()
        })
      })
    })

    describe('when user is not a beneficiary', () => {
      beforeEach(() => {
        mockUseAuthContext.mockReturnValueOnce({
          isLoggedIn: false,
          setIsLoggedIn: jest.fn(),
          user: nonBeneficiaryUser,
          refetchUser: jest.fn(),
          isUserLoading: false,
        })
      })

      it('should not display Duo offer button', async () => {
        render(<SearchResults />)

        await waitFor(() => {
          expect(screen.queryByText('Duo')).toBeFalsy()
        })
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })

    it.each`
      filter                                                     | params
      ${`${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE} category`} | ${{ offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE] }}
    `('when $filter filter selected and position is null', async ({ params }) => {
      mockPosition = null
      useRoute.mockReturnValueOnce({
        params,
      })
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })

    it('when position is null and no results search', async () => {
      mockPosition = null
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })
  })

  describe('Location filter', () => {
    it('should display location filter button', async () => {
      render(<SearchResults />)
      await waitFor(() => {
        expect(screen.getByTestId('Localisation')).toBeTruthy()
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
        position: Position
        locationButtonLabel: string
      }) => {
        mockPosition = position
        mockSearchState = { ...searchState, locationFilter }

        render(<SearchResults />)

        await waitFor(() => {
          expect(screen.queryByText(locationButtonLabel)).toBeTruthy()
        })
      }
    )
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      render(<SearchResults />)
      await waitFor(() => {
        expect(screen.queryByTestId('Dates & heures')).toBeTruthy()
      })
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      render(<SearchResults />)
      const datesHoursButton = screen.getByTestId('Dates & heures')

      await waitFor(() => {
        fireEvent.press(datesHoursButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

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
        render(<SearchResults />)

        const datesHoursButtonIcon = screen.getByTestId('datesHoursButtonIcon')
        await waitFor(() => {
          expect(datesHoursButtonIcon).toBeTruthy()
        })

        const datesHoursButton = screen.getByTestId('Dates & heures\u00a0: Filtre sélectionné')
        expect(datesHoursButton).toHaveStyle({ borderColor: theme.colors.primary })

        const datesHoursButtonLabel = screen.getByTestId('datesHoursButtonLabel')
        expect(datesHoursButtonLabel).toHaveStyle({ color: theme.colors.primary })
      }
    )
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    render(<SearchResults />)

    await waitFor(() => {
      fireEvent.press(screen.getByText('Géolocalise-toi'))
    })

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    render(<SearchResults />)

    await waitFor(() => {
      fireEvent.press(screen.getByText('Géolocalise-toi'))
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
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Géolocalise-toi')).toBeTruthy()
      })
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUserData = [{ message: 'n’est pas disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Géolocalise-toi')).toBeFalsy()
      })
    })
  })

  describe('Offer unavailable message', () => {
    it('should display when query is an unavailable offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = [{ message: 'Offre non disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Offre non disponible sur le pass Culture.')).toBeTruthy()
      })
    })

    it('should not display when query is an available offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = []
      mockSearchState = { ...searchState, query: 'Deezer' }
      render(<SearchResults />)

      await waitFor(() => {
        expect(screen.queryByText('Offre non disponible sur le pass Culture.')).toBeFalsy()
      })
    })
  })
})
