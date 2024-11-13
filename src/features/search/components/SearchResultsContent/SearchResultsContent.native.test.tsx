import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState, UserData } from 'features/search/types'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { Offer } from 'shared/offer/types'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'
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

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')

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
mockAuthContextWithUser(mockUser)

jest.mock('features/location/helpers/useLocationState', () => ({
  useLocationState: () => ({
    onModalHideRef: { current: jest.fn() },
  }),
}))

jest.mock('features/location/helpers/useLocationSubmit', () => ({
  useLocationSubmit: () => ({
    setTempAroundMeRadius: jest.fn(),
  }),
}))

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

const mockHits: Offer[] = []
const mockFetchNextPage = jest.fn()
const mockRefetch = jest.fn()
const mockUserData: UserData[] = []

const initialSearchResults = {
  data: mockData,
  hits: mockHits,
  nbHits: 0,
  isFetching: false,
  isLoading: false,
  hasNextPage: true,
  fetchNextPage: mockFetchNextPage,
  isFetchingNextPage: false,
  userData: mockUserData,
  refetch: mockRefetch,
}

const mockUseSearchResults = jest.fn(() => initialSearchResults)
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => mockUseSearchResults(),
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
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const mockShowGeolocPermissionModal = jest.fn()
let mockSelectedLocationMode = LocationMode.AROUND_ME

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    hasGeolocPosition: mockHasGeolocPosition,
    place: mockPlace,
    selectedLocationMode: mockSelectedLocationMode,
  }),
}))

const mockRemoveSelectedVenue = jest.fn()
jest.mock('features/venueMap/store/selectedVenueStore', () => ({
  useSelectedVenueActions: () => ({
    removeSelectedVenue: mockRemoveSelectedVenue,
    setSelectedVenue: jest.fn(),
  }),
  useSelectedVenue: jest.fn(),
}))

jest.mock('libs/subcategories/useSubcategories')

const venue = mockedSuggestedVenue

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

jest.mock('@gorhom/bottom-sheet', () => {
  const { View } = jest.requireActual('react-native')

  class MockBottomSheet extends View {
    close() {
      this.props.onAnimate(0, -1)
    }
    expand() {
      this.props.onAnimate(0, 2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})

describe('SearchResultsContent component', () => {
  const user = userEvent.setup()

  beforeAll(() => {
    mockUseSearchResults.mockReturnValue({ ...initialSearchResults, hits: [], nbHits: 0 })
    mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
  })

  afterEach(() => {
    mockUseSearchResults.mockReturnValue({
      ...initialSearchResults,
      hits: [],
      nbHits: 0,
      userData: [],
    })
    mockSearchState = searchState
    mockPosition = DEFAULT_POSITION

    mockHasGeolocPosition = false
  })

  it('should render correctly', async () => {
    jest.advanceTimersByTime(2000)
    renderSearchResultsContent()

    expect(await screen.findByText('Lieu culturel')).toBeOnTheScreen()
  })

  it('should log SearchScrollToPage when hitting the bottom of the page', async () => {
    mockUseSearchResults.mockReturnValueOnce({
      ...initialSearchResults,
      hits: mockedAlgoliaResponse.hits,
      nbHits: mockedAlgoliaResponse.nbHits,
      userData: [],
    })

    mockData.pages.push({
      offers: {
        nbHits: 0,
        hits: [],
        page: 1,
      },
    })

    renderSearchResultsContent()

    const flashList = screen.getByTestId('searchResultsFlashlist')

    await screen.findByText('Lieu culturel')

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
      renderSearchResultsContent()

      expect(await screen.findByText('Catégories')).toBeOnTheScreen()
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      renderSearchResultsContent()
      const categoryButton = await screen.findByText('Catégories')

      await user.press(categoryButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      mockSearchState = {
        ...mockSearchState,
        offerCategories: [SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE],
      }
      renderSearchResultsContent()

      const categoryButtonIcon = await screen.findByTestId('categoryButtonIcon')

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
      renderSearchResultsContent()

      expect(await screen.findByText('Prix')).toBeOnTheScreen()
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      renderSearchResultsContent()
      const priceButton = screen.getByTestId('Prix')

      await user.press(priceButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
      mockSearchState = {
        ...mockSearchState,
        minPrice: '5',
      }
      renderSearchResultsContent()

      const priceButtonIcon = await screen.findByTestId('priceButtonIcon')

      expect(priceButtonIcon).toBeOnTheScreen()

      const priceButton = screen.getByTestId('Prix\u00a0: Filtre sélectionné')

      expect(priceButton).toHaveStyle({ borderWidth: 2, backgroundColor: theme.colors.greyLight })
    })
  })

  describe('Offer Duo filter', () => {
    describe('When user is logged in and is benificiary with credit', () => {
      beforeEach(() => {
        mockAuthContextWithUser(beneficiaryUser)
      })

      it('should display Duo filter button', async () => {
        renderSearchResultsContent()

        expect(await screen.findByText('Duo')).toBeOnTheScreen()
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        renderSearchResultsContent()
        const duoButton = screen.getByTestId('Duo')

        await user.press(duoButton)

        const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

        expect(fullscreenModalScrollView).toBeOnTheScreen()

        const isInverseLayout = screen.queryByTestId('inverseLayout')

        expect(isInverseLayout).not.toBeOnTheScreen()
      })
    })

    describe('when user is logged in and beneficiary with no credit', () => {
      beforeEach(() => {
        mockAuthContextWithUser({
          ...beneficiaryUser,
          domainsCredit: { all: { initial: 8000, remaining: 0 } },
        })
      })

      it('should not display Duo filter button', async () => {
        renderSearchResultsContent()

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('when user is not logged in', () => {
      beforeEach(() => {
        mockAuthContextWithoutUser()
      })

      it('should not display Duo offer button', async () => {
        renderSearchResultsContent()

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('when user is not a beneficiary', () => {
      beforeEach(() => {
        mockAuthContextWithUser(nonBeneficiaryUser)
      })

      it('should not display Duo offer button', async () => {
        renderSearchResultsContent()

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      renderSearchResultsContent()

      await screen.findByText('Lieu culturel')

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

      renderSearchResultsContent()

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when position is null and no results search', async () => {
      mockPosition = null
      renderSearchResultsContent()

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  it(`should display ${venue.label} in location filter button label when a venue is selected`, async () => {
    mockSearchState = { ...searchState, venue }
    renderSearchResultsContent()

    expect(await screen.findByText(venue.label)).toBeOnTheScreen()
  })

  describe('Venue filter', () => {
    it('should open the venue modal when pressing the venue filter button', async () => {
      renderSearchResultsContent()

      const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
      await user.press(venueButton)

      expect(screen.getByTestId('fullscreenModalView')).toHaveTextContent(
        'Trouver un lieu culturel'
      )
    })

    it('should call set search state on press "Rechercher" in venue modal', async () => {
      renderSearchResultsContent()

      const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
      await user.press(venueButton)

      await user.press(screen.getByText('Rechercher'))

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...mockSearchState,
          locationFilter: { locationType: LocationMode.EVERYWHERE },
        },
      })
    })

    it('should display "Lieu culturel" in venue filter if no venue is selected', async () => {
      renderSearchResultsContent()

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display venueButtonLabel in venue filter if a venue is selected', async () => {
      mockSearchState = {
        ...searchState,
        venue,
      }
      renderSearchResultsContent()

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent(venue.label)
    })

    it('should display "Lieu culturel" in venue filter if location type is AROUND_ME', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
      }
      renderSearchResultsContent()

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display "Lieu culturel" in venue filter if location type is EVERYWHERE', async () => {
      mockSearchState = {
        ...searchState,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
      }
      renderSearchResultsContent()

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      renderSearchResultsContent()

      expect(await screen.findByText('Dates & heures')).toBeOnTheScreen()
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      renderSearchResultsContent()
      const datesHoursButton = screen.getByTestId('Dates & heures')

      await user.press(datesHoursButton)

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
        renderSearchResultsContent()

        const datesHoursButtonIcon = await screen.findByTestId('datesHoursButtonIcon')

        expect(datesHoursButtonIcon).toBeOnTheScreen()

        const datesHoursButton = screen.getByTestId('Dates & heures\u00a0: Filtre sélectionné')

        expect(datesHoursButton).toHaveStyle({
          borderWidth: 2,
          backgroundColor: theme.colors.greyLight,
        })
      }
    )
  })

  describe('Accessibility filter', () => {
    it('should display accessibility filter button', async () => {
      renderSearchResultsContent()
      const accessibilityFilterButton = await screen.findByRole('button', { name: 'Accessibilité' })

      expect(accessibilityFilterButton).toBeOnTheScreen()
    })

    it('should open accessibility filters modal when accessibilityFiltersButton is pressed', async () => {
      renderSearchResultsContent()
      const accessibilityFilterButton = screen.getByRole('button', { name: 'Accessibilité' })

      await user.press(accessibilityFilterButton)
      const accessibilityFiltersModal = await screen.findByText(
        'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
      )

      expect(accessibilityFiltersModal).toBeOnTheScreen()
    })
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockUseSearchResults.mockReturnValueOnce({
      ...initialSearchResults,
      hits: mockedAlgoliaResponse.hits,
      nbHits: mockedAlgoliaResponse.nbHits,
      userData: [],
    })
    renderSearchResultsContent()

    await user.press(screen.getByText('Géolocalise-toi'))

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user position received in a second time', async () => {
    mockPosition = null
    renderSearchResultsContent()
    await screen.findByText('Lieu culturel')

    expect(mockRefetch).not.toHaveBeenCalled()

    mockPosition = DEFAULT_POSITION
    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user stop to share his position', async () => {
    mockPosition = DEFAULT_POSITION
    renderSearchResultsContent()
    await screen.findByText('Lieu culturel')

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
    renderSearchResultsContent()
    await screen.findByText('Lieu culturel')

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()
  })

  it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    renderSearchResultsContent()

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    screen.rerender(<SearchResultsContent />)

    screen.rerender(<SearchResultsContent />)

    await waitFor(() => {
      expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
    })
  })

  it('should log PerformSearch with search result when there is search query execution', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    renderSearchResultsContent()

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    mockSearchState = searchState
    const mockAccessibilityFilter = {
      isAudioDisabilityCompliant: undefined,
      isMentalDisabilityCompliant: undefined,
      isMotorDisabilityCompliant: undefined,
      isVisualDisabilityCompliant: undefined,
    }
    screen.rerender(<SearchResultsContent />)

    await waitFor(() => {
      expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
        1,
        mockSearchState,
        mockAccessibilityFilter,
        0,
        'SearchResults'
      )
    })
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

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    renderSearchResultsContent()

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    mockSearchState = searchState

    screen.rerender(<SearchResultsContent />)

    await waitFor(() => {
      expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
        1,
        mockSearchState,
        mockDisabilitesPropertiesTruthy,
        0,
        'SearchResults'
      )
    })
  })

  it('should not log NoSearchResult when there is not search query execution', async () => {
    renderSearchResultsContent()
    await screen.findByText('Lieu culturel')

    expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
  })

  it('should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    renderSearchResultsContent()

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    screen.rerender(<SearchResultsContent />)

    screen.rerender(<SearchResultsContent />)

    await waitFor(() => {
      expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
    })
  })

  it('should log NoSearchResult with search result when there is search query execution and nbHits = 0', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    renderSearchResultsContent()

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    mockSearchState = searchState
    screen.rerender(<SearchResultsContent />)

    await waitFor(() => {
      expect(analytics.logNoSearchResult).toHaveBeenNthCalledWith(1, '', searchId)
    })
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockPosition = null
    mockUseSearchResults.mockReturnValueOnce({
      ...initialSearchResults,
      hits: mockedAlgoliaResponse.hits,
      nbHits: mockedAlgoliaResponse.nbHits,
    })
    renderSearchResultsContent()

    await user.press(screen.getByText('Géolocalise-toi'))

    expect(analytics.logActivateGeolocfromSearchResults).toHaveBeenCalledTimes(1)
  })

  describe('should display geolocation incitation button', () => {
    beforeAll(() => {
      mockPosition = null
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
      })
    })

    it('when position is null', async () => {
      renderSearchResultsContent()

      expect(await screen.findByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
        userData: [{ message: 'n’est pas disponible sur le pass Culture.' }],
      })
      mockSearchState = { ...searchState, query: 'iPhone' }
      renderSearchResultsContent()
      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  describe('Offer unavailable message', () => {
    it('should display when query is an unavailable offer', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
        userData: [{ message: 'Offre non disponible sur le pass Culture.' }],
      })

      mockSearchState = { ...searchState, query: 'iPhone' }
      renderSearchResultsContent()

      expect(await screen.findByText('Offre non disponible sur le pass Culture.')).toBeOnTheScreen()
    })

    it('should not display when query is an available offer', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
        userData: [],
      })
      mockSearchState = { ...searchState, query: 'Deezer' }
      renderSearchResultsContent()
      await screen.findByText('Lieu culturel')

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

      renderSearchResultsContent()

      const filterButton = await screen.findByLabelText(
        'Voir tous les filtres\u00a0: 2 filtres actifs'
      )

      expect(filterButton).toBeOnTheScreen()
      expect(filterButton).toHaveTextContent('2')
    })
  })

  describe('when feature flag map in search activated', () => {
    beforeEach(() => {
      mockUseSearchResults.mockReturnValue({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
      })
      useFeatureFlagSpy.mockReturnValue(true)
    })

    afterEach(() => {
      mockSelectedLocationMode = LocationMode.AROUND_ME
    })

    it('should display tabs when FF map active', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      renderSearchResultsContent()

      expect(await screen.findByText('Carte')).toBeOnTheScreen()
      expect(await screen.findByText('Liste')).toBeOnTheScreen()
    })

    it('should not display tabs when FF map deactivated', async () => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
      renderSearchResultsContent()

      await screen.findByText('Prix')

      expect(screen.queryByText('Carte')).not.toBeOnTheScreen()
      expect(screen.queryByText('Liste')).not.toBeOnTheScreen()
    })

    it('should log consult venue map when pressing map tab', async () => {
      render(reactQueryProviderHOC(<SearchResultsContent />))

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(analytics.logConsultVenueMap).toHaveBeenCalledWith({
        from: 'search',
        searchId: 'testUuidV4',
      })
    })

    it('should reset selected venue in store when pressing map tab', async () => {
      render(reactQueryProviderHOC(<SearchResultsContent />))

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(mockRemoveSelectedVenue).toHaveBeenCalledTimes(1)
    })

    it('should display empty state view when there is no search result', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: [],
        nbHits: 0,
      })
      renderSearchResultsContent()

      expect(await screen.findByText('Pas de résultat')).toBeOnTheScreen()
    })

    it('should open venue map location modal when pressing map tab and user location selected is everywhere', async () => {
      mockSelectedLocationMode = LocationMode.EVERYWHERE
      renderSearchResultsContent()

      await user.press(await screen.findByText('Carte'))

      expect(await screen.findByText('Localisation')).toBeOnTheScreen()
    })

    it('should not open venue map location modal when pressing map tab and user location selected is not everywhere', async () => {
      render(reactQueryProviderHOC(<SearchResultsContent />))

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })

    it('should display venue map when pressing map tab if user location selected is not everywhere', async () => {
      render(reactQueryProviderHOC(<SearchResultsContent />))

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(screen.getByTestId('venue-map-view')).toBeOnTheScreen()
    })

    it('should not display venue map when pressing map tab if user location selected is everywhere', async () => {
      mockSelectedLocationMode = LocationMode.EVERYWHERE
      renderSearchResultsContent()

      await user.press(await screen.findByText('Carte'))

      expect(screen.queryByTestId('venue-map-view')).not.toBeOnTheScreen()
    })
  })
})

const renderSearchResultsContent = () => {
  render(<SearchResultsContent />)
}
