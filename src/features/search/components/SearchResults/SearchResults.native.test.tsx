import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchResults } from 'features/search/components/SearchResults/SearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter, SearchState, SearchView, UserData } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { Offer } from 'shared/offer/types'
import { act, fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

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
      offers: {
        nbHits: 0,
        hits: [],
        page: 0,
      },
    },
  ],
}
let mockHits: Offer[] = []
let mockNbHits = 0
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockRefetch = jest.fn()
let mockUserData: UserData[] = []
let mockIsLoading = false
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: mockHits,
    nbHits: mockNbHits,
    isFetching: false,
    isLoading: mockIsLoading,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    userData: mockUserData,
    refetch: mockRefetch,
  }),
}))

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: Position = DEFAULT_POSITION
let mockIsGeolocated = false
let mockIsCustomPosition = false
const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/LocationWrapper', () => ({
  useLocation: () => ({
    userPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    isGeolocated: mockIsGeolocated,
    isCustomPosition: mockIsCustomPosition,
    place: mockPlace,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

const venue: Venue = mockedSuggestedVenues[0]

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

jest.useFakeTimers({ legacyFakeTimers: true })

describe('SearchResults component', () => {
  beforeAll(() => {
    mockHits = []
    mockNbHits = 0
  })

  afterEach(() => {
    mockHits = []
    mockNbHits = 0
    mockSearchState = searchState
    mockPosition = DEFAULT_POSITION
    mockUserData = []
    mockIsGeolocated = false
    mockIsCustomPosition = false
  })

  it('should render correctly', async () => {
    jest.advanceTimersByTime(2000)
    render(<SearchResults />)
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', async () => {
    useRoute.mockReturnValueOnce({
      params: { searchId },
    })
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits

    mockData.pages.push({
      offers: {
        nbHits: 0,
        hits: [],
        page: 1,
      },
    })

    render(<SearchResults />)

    const flashList = screen.getByTestId('searchResultsFlashlist')

    await act(() => {})

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(1, searchId)

    mockData.pages.push({
      offers: {
        nbHits: 0,
        hits: [],
        page: 2,
      },
    })
    await act(async () => {
      flashList.props.onEndReached()
    })

    expect(mockFetchNextPage).toHaveBeenCalledTimes(2)
    expect(analytics.logSearchScrollToPage).toHaveBeenCalledWith(2, searchId)
  })

  describe('Category filter', () => {
    it('should display category filter button', async () => {
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('Catégories')).toBeOnTheScreen()
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      render(<SearchResults />)
      const categoryButton = screen.getByTestId('Catégories')

      await act(async () => {
        fireEvent.press(categoryButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      useRoute.mockReturnValueOnce({
        params: { offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE] },
      })
      render(<SearchResults />)
      await act(async () => {})

      const categoryButtonIcon = screen.getByTestId('categoryButtonIcon')

      expect(categoryButtonIcon).toBeOnTheScreen()

      const categoryButton = screen.getByTestId('Catégories\u00a0: Filtre sélectionné')

      expect(categoryButton).toHaveStyle({
        borderWidth: 2,
        backgroundColor: theme.colors.greyLight,
      })
    })
  })

  describe('Price filter', () => {
    it('should display price filter button', async () => {
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('Prix')).toBeOnTheScreen()
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      render(<SearchResults />)
      const priceButton = screen.getByTestId('Prix')

      await act(async () => {
        fireEvent.press(priceButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
      useRoute.mockReturnValueOnce({
        params: { minPrice: '5' },
      })
      render(<SearchResults />)
      await act(async () => {})

      const priceButtonIcon = screen.getByTestId('priceButtonIcon')

      expect(priceButtonIcon).toBeOnTheScreen()

      const priceButton = screen.getByTestId('Prix\u00a0: Filtre sélectionné')

      expect(priceButton).toHaveStyle({ borderWidth: 2, backgroundColor: theme.colors.greyLight })
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
        await act(async () => {})

        expect(screen.getByTestId('Duo')).toBeOnTheScreen()
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        render(<SearchResults />)
        const duoButton = screen.getByTestId('Duo')

        await act(async () => {
          fireEvent.press(duoButton)
        })

        const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

        expect(fullscreenModalScrollView).toBeOnTheScreen()

        const isInverseLayout = screen.queryByTestId('inverseLayout')

        expect(isInverseLayout).not.toBeOnTheScreen()
      })
    })

    describe('when user is logged in and beneficiary with no credit', () => {
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
        await act(async () => {})

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
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
        await act(async () => {})

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
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
        await act(async () => {})

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
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
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when position is null and no results search', async () => {
      mockPosition = null
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  describe('Location filter', () => {
    it('should display location filter button', async () => {
      mockPosition = null
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('Localisation')).toBeOnTheScreen()
    })

    it.each`
      locationType               | locationFilter                                                                   | position            | locationButtonLabel
      ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${DEFAULT_POSITION} | ${'Partout'}
      ${LocationType.EVERYWHERE} | ${{ locationType: LocationType.EVERYWHERE }}                                     | ${null}             | ${'Localisation'}
      ${LocationType.AROUND_ME}  | ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}            | ${DEFAULT_POSITION} | ${'Autour de moi'}
      ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${DEFAULT_POSITION} | ${Kourou.label}
      ${LocationType.PLACE}      | ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: MAX_RADIUS }} | ${null}             | ${Kourou.label}
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
        await act(async () => {})

        expect(screen.queryByText(locationButtonLabel)).toBeOnTheScreen()
      }
    )
  })

  it(`should display ${venue.label} in location filter button label when a venue is selected`, async () => {
    mockSearchState = { ...searchState, venue }
    render(<SearchResults />)
    await act(async () => {})

    expect(screen.queryByText(venue.label)).toBeOnTheScreen()
  })

  describe('Venue filter', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should open the venue modal when pressing the venue filter button', async () => {
      render(<SearchResults />)

      await act(async () => {
        const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
        fireEvent.press(venueButton)
      })

      expect(screen.getByTestId('fullscreenModalView')).toHaveTextContent(
        'Trouver un lieu culturel'
      )
    })

    it('should call navigate on press "Rechercher" in venue modal', async () => {
      render(<SearchResults />)

      await act(async () => {
        const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
        fireEvent.press(venueButton)
      })

      fireEvent.press(screen.getByText('Rechercher'))

      expect(navigate).toHaveBeenCalledWith(
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          locationFilter: { locationType: LocationType.EVERYWHERE },
          view: SearchView.Results,
        })
      )
    })

    it('when ENABLE_APP_LOCATION featureFlag, should display "Lieu culturel" in venue filter if no venue is selected', async () => {
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('when ENABLE_APP_LOCATION featureFlag, should display venueButtonLabel in venue filter if a venue is selected', async () => {
      mockSearchState = {
        ...searchState,
        venue,
      }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent(venue.label)
    })

    it('when ENABLE_APP_LOCATION featureFlag, should display "Lieu culturel" in venue filter if location type is AROUND_ME', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS },
      }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('when ENABLE_APP_LOCATION featureFlag, should display "Lieu culturel" in venue filter if location type is EVERYWHERE', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationType.EVERYWHERE },
      }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByTestId('Dates & heures')).toBeOnTheScreen()
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      render(<SearchResults />)
      const datesHoursButton = screen.getByTestId('Dates & heures')

      await act(async () => {
        fireEvent.press(datesHoursButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
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
        await act(async () => {})

        const datesHoursButtonIcon = screen.getByTestId('datesHoursButtonIcon')

        expect(datesHoursButtonIcon).toBeOnTheScreen()

        const datesHoursButton = screen.getByTestId('Dates & heures\u00a0: Filtre sélectionné')

        expect(datesHoursButton).toHaveStyle({
          borderWidth: 2,
          backgroundColor: theme.colors.greyLight,
        })
      }
    )
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    render(<SearchResults />)

    await act(async () => {
      fireEvent.press(screen.getByText('Géolocalise-toi'))
    })

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user position received in a second time', async () => {
    mockPosition = null
    render(<SearchResults />)
    await act(async () => {})

    expect(mockRefetch).not.toHaveBeenCalled()

    mockPosition = DEFAULT_POSITION
    screen.rerender(<SearchResults />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user stop to share his position', async () => {
    mockPosition = DEFAULT_POSITION
    render(<SearchResults />)
    await act(async () => {})

    // previousUserPosition is empty in first rendering
    expect(mockRefetch).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResults />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)

    mockPosition = null
    screen.rerender(<SearchResults />)

    // first rendering + rendering when user stop to share his position
    expect(mockRefetch).toHaveBeenCalledTimes(2)
  })

  it('should not log PerformSearch when there is not search query execution', async () => {
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()
  })

  it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
    mockIsLoading = true
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()

    mockIsLoading = false
    screen.rerender(<SearchResults />)

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResults />)

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
  })

  it('should log PerformSearch with search result when there is search query execution', async () => {
    mockIsLoading = true
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()

    mockIsLoading = false
    mockSearchState = searchState
    screen.rerender(<SearchResults />)

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(1, mockSearchState, mockNbHits)
  })

  it('should not log NoSearchResult when there is not search query execution', async () => {
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
  })

  it('should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render', async () => {
    mockIsLoading = true
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()

    mockIsLoading = false
    screen.rerender(<SearchResults />)

    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResults />)

    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
  })

  it('should log NoSearchResult with search result when there is search query execution and nbHits = 0', async () => {
    mockIsLoading = true
    render(<SearchResults />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()

    mockIsLoading = false
    mockSearchState = searchState
    screen.rerender(<SearchResults />)

    expect(analytics.logNoSearchResult).toHaveBeenNthCalledWith(1, '', searchId)
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    render(<SearchResults />)

    await act(async () => {
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
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUserData = [{ message: 'n’est pas disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  describe('Offer unavailable message', () => {
    it('should display when query is an unavailable offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = [{ message: 'Offre non disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByText('Offre non disponible sur le pass Culture.')).toBeOnTheScreen()
    })

    it('should not display when query is an available offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = []
      mockSearchState = { ...searchState, query: 'Deezer' }
      render(<SearchResults />)
      await act(async () => {})

      expect(screen.queryByText('Offre non disponible sur le pass Culture.')).not.toBeOnTheScreen()
    })
  })

  describe('Main filter button', () => {
    it('should display filter button with the number of active filters', async () => {
      mockSearchState = {
        ...searchState,
        priceRange: [5, 300],
        offerIsDuo: true,
      }

      render(<SearchResults />)
      let filterButton
      await act(async () => {
        filterButton = screen.getByLabelText('Voir tous les filtres\u00a0: 2 filtres actifs')
      })

      expect(filterButton).toBeOnTheScreen()
      expect(filterButton).toHaveTextContent('2')
    })
  })
})
