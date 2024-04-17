import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState, SearchView, UserData } from 'features/search/types'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { Offer } from 'shared/offer/types'
import { act, fireEvent, render, screen } from 'tests/utils'
import { theme } from 'theme'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const searchId = uuidv4()
const searchState = { ...initialSearchState, searchId }
let mockSearchState = searchState
const mockDispatch = jest.fn()

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('features/accessibility/context/AccessibilityFiltersWrapper')
const mockAccessibilityFilter = useAccessibilityFiltersContext as jest.MockedFunction<
  typeof useAccessibilityFiltersContext
>

mockAccessibilityFilter.mockReturnValue({
  disabilities: defaultDisabilitiesProperties,
  setDisabilities: () => jest.fn(),
})

const mockDisabilitesPropertiesTruthy = {
  isAudioDisabilityCompliant: true,
  isMentalDisabilityCompliant: true,
  isMotorDisabilityCompliant: true,
  isVisualDisabilityCompliant: true,
}

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
let mockHasGeolocPosition = false
const mockPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    hasGeolocPosition: mockHasGeolocPosition,
    place: mockPlace,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

const venue = mockedSuggestedVenue

jest.useFakeTimers()

describe('SearchResultsContent component', () => {
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
    mockHasGeolocPosition = false
  })

  it('should render correctly', async () => {
    jest.advanceTimersByTime(2000)
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', async () => {
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits

    mockData.pages.push({
      offers: {
        nbHits: 0,
        hits: [],
        page: 1,
      },
    })

    render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('Catégories')).toBeOnTheScreen()
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      render(<SearchResultsContent />)
      const categoryButton = screen.getByTestId('Catégories')

      await act(async () => {
        fireEvent.press(categoryButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      mockSearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
      }
      render(<SearchResultsContent />)
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
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('Prix')).toBeOnTheScreen()
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      render(<SearchResultsContent />)
      const priceButton = screen.getByTestId('Prix')

      await act(async () => {
        fireEvent.press(priceButton)
      })

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
      mockSearchState = {
        ...mockSearchState,
        minPrice: '5',
      }
      render(<SearchResultsContent />)
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
        render(<SearchResultsContent />)
        await act(async () => {})

        expect(screen.getByTestId('Duo')).toBeOnTheScreen()
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        render(<SearchResultsContent />)
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
        render(<SearchResultsContent />)
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
        render(<SearchResultsContent />)
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
        render(<SearchResultsContent />)
        await act(async () => {})

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it.each`
      filter                                                     | params
      ${`${SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE} category`} | ${{ offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE] }}
    `('when $filter filter selected and position is null', async ({ params }) => {
      mockPosition = null
      mockSearchState = {
        ...mockSearchState,
        ...params,
      }

      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when position is null and no results search', async () => {
      mockPosition = null
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  it(`should display ${venue.label} in location filter button label when a venue is selected`, async () => {
    mockSearchState = { ...searchState, venue }
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(screen.getByText(venue.label)).toBeOnTheScreen()
  })

  describe('Venue filter', () => {
    it('should open the venue modal when pressing the venue filter button', async () => {
      render(<SearchResultsContent />)

      await act(async () => {
        const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
        fireEvent.press(venueButton)
      })

      expect(screen.getByTestId('fullscreenModalView')).toHaveTextContent(
        'Trouver un lieu culturel'
      )
    })

    it('should call set search state on press "Rechercher" in venue modal', async () => {
      render(<SearchResultsContent />)

      await act(async () => {
        const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
        fireEvent.press(venueButton)
      })

      fireEvent.press(screen.getByText('Rechercher'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...mockSearchState,
          locationFilter: { locationType: LocationMode.EVERYWHERE },
          view: SearchView.Results,
        },
      })
    })

    it('should display "Lieu culturel" in venue filter if no venue is selected', async () => {
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display venueButtonLabel in venue filter if a venue is selected', async () => {
      mockSearchState = {
        ...searchState,
        venue,
      }
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent(venue.label)
    })

    it('should display "Lieu culturel" in venue filter if location type is AROUND_ME', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
      }
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display "Lieu culturel" in venue filter if location type is EVERYWHERE', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
      }
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByTestId('Dates & heures')).toBeOnTheScreen()
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      render(<SearchResultsContent />)
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
        mockSearchState = {
          ...mockSearchState,
          ...params,
        }
        render(<SearchResultsContent />)
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
    render(<SearchResultsContent />)

    await act(async () => {
      fireEvent.press(screen.getByText('Géolocalise-toi'))
    })

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user position received in a second time', async () => {
    mockPosition = null
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(mockRefetch).not.toHaveBeenCalled()

    mockPosition = DEFAULT_POSITION
    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user stop to share his position', async () => {
    mockPosition = DEFAULT_POSITION
    render(<SearchResultsContent />)
    await act(async () => {})

    // previousGeolocPosition is empty in first rendering
    expect(mockRefetch).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)

    mockPosition = null
    screen.rerender(<SearchResultsContent />)

    // first rendering + rendering when user stop to share his position
    expect(mockRefetch).toHaveBeenCalledTimes(2)
  })

  it('should not log PerformSearch when there is not search query execution', async () => {
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()
  })

  it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
    mockIsLoading = true
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()

    mockIsLoading = false
    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
  })

  it('should log PerformSearch with search result when there is search query execution', async () => {
    mockIsLoading = true
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()

    mockIsLoading = false
    mockSearchState = searchState
    const mockAccessibilityFilter = {
      isAudioDisabilityCompliant: undefined,
      isMentalDisabilityCompliant: undefined,
      isMotorDisabilityCompliant: undefined,
      isVisualDisabilityCompliant: undefined,
    }
    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
      1,
      mockSearchState,
      mockAccessibilityFilter,
      mockNbHits
    )
  })

  it('should log PerformSearch with accessibilityFilter when there is search query execution', async () => {
    mockAccessibilityFilter
      .mockReturnValueOnce({
        disabilities: mockDisabilitesPropertiesTruthy,
        setDisabilities: () => jest.fn(),
      })
      .mockReturnValueOnce({
        disabilities: mockDisabilitesPropertiesTruthy,
        setDisabilities: () => jest.fn(),
      })
      .mockReturnValueOnce({
        disabilities: mockDisabilitesPropertiesTruthy,
        setDisabilities: () => jest.fn(),
      })
      .mockReturnValueOnce({
        disabilities: mockDisabilitesPropertiesTruthy,
        setDisabilities: () => jest.fn(),
      })

    mockIsLoading = true
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()

    mockIsLoading = false
    mockSearchState = searchState

    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
      1,
      mockSearchState,
      mockDisabilitesPropertiesTruthy,
      mockNbHits
    )
  })

  it('should not log NoSearchResult when there is not search query execution', async () => {
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
  })

  it('should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render', async () => {
    mockIsLoading = true
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()

    mockIsLoading = false
    screen.rerender(<SearchResultsContent />)

    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResultsContent />)

    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
  })

  it('should log NoSearchResult with search result when there is search query execution and nbHits = 0', async () => {
    mockIsLoading = true
    render(<SearchResultsContent />)
    await act(async () => {})

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()

    mockIsLoading = false
    mockSearchState = searchState
    screen.rerender(<SearchResultsContent />)

    expect(analytics.logNoSearchResult).toHaveBeenNthCalledWith(1, '', searchId)
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockHits = mockedAlgoliaResponse.hits
    mockNbHits = mockedAlgoliaResponse.nbHits
    render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUserData = [{ message: 'n’est pas disponible sur le pass Culture.' }]
      mockSearchState = { ...searchState, query: 'iPhone' }
      render(<SearchResultsContent />)
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
      render(<SearchResultsContent />)
      await act(async () => {})

      expect(screen.getByText('Offre non disponible sur le pass Culture.')).toBeOnTheScreen()
    })

    it('should not display when query is an available offer', async () => {
      mockHits = mockedAlgoliaResponse.hits
      mockNbHits = mockedAlgoliaResponse.nbHits
      mockUserData = []
      mockSearchState = { ...searchState, query: 'Deezer' }
      render(<SearchResultsContent />)
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

      render(<SearchResultsContent />)
      let filterButton
      await act(async () => {
        filterButton = screen.getByLabelText('Voir tous les filtres\u00a0: 2 filtres actifs')
      })

      expect(filterButton).toBeOnTheScreen()
      expect(filterButton).toHaveTextContent('2')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should display accessibility filter button', async () => {
      render(<SearchResultsContent />)
      const accessibilityFilterButton = await screen.findByRole('button', { name: 'Accessibilité' })

      expect(accessibilityFilterButton).toBeOnTheScreen()
    })

    it('should open accessibility filters modal when accessibilityFiltersButton is pressed', async () => {
      render(<SearchResultsContent />)
      const accessibilityFilterButton = screen.getByRole('button', { name: 'Accessibilité' })

      fireEvent.press(accessibilityFilterButton)
      const accessibilityFiltersModal = await screen.findByText(
        'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
      )

      expect(accessibilityFiltersModal).toBeOnTheScreen()
    })
  })
})
