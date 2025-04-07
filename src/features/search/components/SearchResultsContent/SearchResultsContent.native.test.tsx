import { useRoute } from '@react-navigation/native'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { SearchResultsContent } from 'features/search/components/SearchResultsContent/SearchResultsContent'
import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState, UserData } from 'features/search/types'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState, Position } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { useVenuesInRegionQuery } from 'queries/venueMap/useVenuesInRegionQuery'
import { Offer } from 'shared/offer/types'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'
import { theme } from 'theme'

const searchId = uuidv4()
const mockSearchState: SearchState = { ...initialSearchState, searchId }
const mockDispatch = jest.fn()
const mockUseSearch = jest.fn(() => ({
  searchState: mockSearchState,
  dispatch: mockDispatch,
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
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
jest.mock('features/search/queries/useSearchResultsQuery', () => ({
  useSearchResultsQuery: () => mockUseSearchResults(),
}))

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockShowGeolocPermissionModal = jest.fn()
const mockedPosition = { latitude: 2, longitude: 40 } as Position
const mockedNoPosition = null as Position
const DEFAULT_RADIUS = 50
const everywhereUseLocation = {
  geolocPosition: mockedNoPosition,
  geolocPositionError: null,
  place: mockedPlace,
  userLocation: mockedNoPosition,
  selectedLocationMode: LocationMode.EVERYWHERE,
  hasGeolocPosition: false,
  permissionState: GeolocPermissionState.DENIED,
  onModalHideRef: jest.fn(),
  setPlace: jest.fn(),
  isCurrentLocationMode: jest.fn(),
  setSelectedLocationMode: jest.fn(),
  showGeolocPermissionModal: mockShowGeolocPermissionModal,
  requestGeolocPermission: jest.fn(),
  triggerPositionUpdate: jest.fn(),
  onPressGeolocPermissionModalButton: jest.fn(),
  onResetPlace: jest.fn(),
  onSetSelectedPlace: jest.fn(),
  selectedPlace: null,
  setSelectedPlace: jest.fn(),
  placeQuery: '',
  setPlaceQuery: jest.fn(),
  aroundPlaceRadius: DEFAULT_RADIUS,
  setAroundPlaceRadius: jest.fn(),
  aroundMeRadius: DEFAULT_RADIUS,
  setAroundMeRadius: jest.fn(),
}
const aroundMeUseLocation = {
  ...everywhereUseLocation,
  geolocPosition: mockedPosition,
  userLocation: mockedPosition,
  selectedLocationMode: LocationMode.AROUND_ME,
  hasGeolocPosition: true,
  permissionState: GeolocPermissionState.GRANTED,
}

const mockUseLocation = jest.fn(() => everywhereUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('queries/venueMap/useVenuesInRegionQuery')
const mockUseVenuesInRegionQuery = useVenuesInRegionQuery as jest.Mock

jest.mock('@react-navigation/native')
const mockUseRoute = useRoute as jest.Mock
mockUseRoute.mockReturnValue({ name: 'venueMap' })

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

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

const mockUseSearchResultsQuery = (
  params = {
    ...initialSearchResults,
    hits: [],
    nbHits: 0,
    userData: [],
  }
) => {
  mockUseSearchResults.mockReturnValue(params)
}

describe('SearchResultsContent component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  const user = userEvent.setup()

  beforeAll(() => {
    mockUseSearchResultsQuery()
    mockUseVenuesInRegionQuery.mockReturnValue({ data: venuesFixture })
  })

  afterEach(() => {
    mockUseSearchResultsQuery()
    mockUseSearch.mockReturnValue({
      searchState: mockSearchState,
      dispatch: mockDispatch,
    })

    mockUseLocation.mockReturnValue({
      ...everywhereUseLocation,
      userLocation: mockedPosition,
      hasGeolocPosition: false,
    })
  })

  it('should render correctly', async () => {
    jest.advanceTimersByTime(2000)
    render(<SearchResultsContent />)

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

    render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)

      expect(await screen.findByText('Catégories')).toBeOnTheScreen()
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      render(<SearchResultsContent />)
      const categoryButton = await screen.findByText('Catégories')

      await user.press(categoryButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in category button when has category selected', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.MUSIQUE],
        },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)

      expect(await screen.findByText('Prix')).toBeOnTheScreen()
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      render(<SearchResultsContent />)
      const priceButton = screen.getByTestId('Prix')

      await user.press(priceButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })

    it('should display an icon and change color in prices filter button when has prices filter selected', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          minPrice: '5',
        },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

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
        render(<SearchResultsContent />)

        expect(await screen.findByText('Duo')).toBeOnTheScreen()
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        render(<SearchResultsContent />)
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
        render(<SearchResultsContent />)

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('when user is not logged in', () => {
      beforeEach(() => {
        mockAuthContextWithoutUser()
      })

      it('should not display Duo offer button', async () => {
        render(<SearchResultsContent />)

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('when user is not a beneficiary', () => {
      beforeEach(() => {
        mockAuthContextWithUser(nonBeneficiaryUser)
      })

      it('should not display Duo offer button', async () => {
        render(<SearchResultsContent />)

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      render(<SearchResultsContent />)

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when a category filter is selected and position is null', async () => {
      mockUseLocation.mockReturnValueOnce(everywhereUseLocation)
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
          searchId,
        },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when position is null and no results search', async () => {
      mockUseLocation.mockReturnValueOnce(everywhereUseLocation)
      render(<SearchResultsContent />)

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  it(`should display ${venue.label} in location filter button label when a venue is selected`, async () => {
    mockUseSearch.mockReturnValueOnce({
      searchState: {
        ...mockSearchState,
        venue,
      },
      dispatch: mockDispatch,
    })
    render(<SearchResultsContent />)

    expect(await screen.findByText(venue.label)).toBeOnTheScreen()
  })

  describe('Venue filter', () => {
    it('should open the venue modal when pressing the venue filter button', async () => {
      render(<SearchResultsContent />)

      const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
      await user.press(venueButton)

      expect(screen.getByTestId('fullscreenModalView')).toHaveTextContent(
        'Trouver un lieu culturel'
      )
    })

    it('should call set search state on press "Rechercher" in venue modal', async () => {
      render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display venueButtonLabel in venue filter if a venue is selected', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          venue,
        },
        dispatch: mockDispatch,
      })
      render(<SearchResultsContent />)

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent(venue.label)
    })

    it('should display "Lieu culturel" in venue filter if location type is AROUND_ME', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })

    it('should display "Lieu culturel" in venue filter if location type is EVERYWHERE', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          locationFilter: { locationType: LocationMode.EVERYWHERE },
        },
        dispatch: mockDispatch,
      })
      render(<SearchResultsContent />)

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      render(<SearchResultsContent />)

      expect(await screen.findByText('Dates & heures')).toBeOnTheScreen()
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      render(<SearchResultsContent />)
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
        mockUseSearch.mockReturnValueOnce({
          searchState: {
            ...mockSearchState,
            ...params,
          },
          dispatch: mockDispatch,
        })
        render(<SearchResultsContent />)

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
      render(<SearchResultsContent />)
      const accessibilityFilterButton = await screen.findByRole('button', { name: 'Accessibilité' })

      expect(accessibilityFilterButton).toBeOnTheScreen()
    })

    it('should open accessibility filters modal when accessibilityFiltersButton is pressed', async () => {
      render(<SearchResultsContent />)
      const accessibilityFilterButton = screen.getByRole('button', { name: 'Accessibilité' })

      await user.press(accessibilityFilterButton)
      const accessibilityFiltersModal = await screen.findByText(
        'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
      )

      expect(accessibilityFiltersModal).toBeOnTheScreen()
    })
  })

  it('should open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...everywhereUseLocation,
      userLocation: null,
    })
    mockUseSearchResults.mockReturnValueOnce({
      ...initialSearchResults,
      hits: mockedAlgoliaResponse.hits,
      nbHits: mockedAlgoliaResponse.nbHits,
      userData: [],
    })
    render(<SearchResultsContent />)

    await user.press(screen.getByText('Géolocalise-toi'))

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user position received in a second time', async () => {
    mockUseLocation.mockReturnValueOnce(everywhereUseLocation)
    render(<SearchResultsContent />)
    await screen.findByText('Lieu culturel')

    expect(mockRefetch).not.toHaveBeenCalled()

    mockUseLocation.mockReturnValueOnce(aroundMeUseLocation)

    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should refetch results when user stop to share his position', async () => {
    mockUseLocation.mockReturnValueOnce(aroundMeUseLocation)
    render(<SearchResultsContent />)
    await screen.findByText('Lieu culturel')

    // previousGeolocPosition is empty in first rendering
    expect(mockRefetch).toHaveBeenCalledTimes(1)

    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)

    mockUseLocation.mockReturnValueOnce(everywhereUseLocation)
    screen.rerender(<SearchResultsContent />)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should not log PerformSearch when there is not search query execution', async () => {
    render(<SearchResultsContent />)
    await screen.findByText('Lieu culturel')

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()
  })

  it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    render(<SearchResultsContent />)

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    screen.rerender(<SearchResultsContent />)

    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
  })

  it('should log PerformSearch with search result when there is search query execution', async () => {
    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    render(<SearchResultsContent />)

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    mockUseSearch.mockReturnValueOnce({
      searchState: mockSearchState,
      dispatch: mockDispatch,
    })
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
      0,
      'SearchResults'
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

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

    render(<SearchResultsContent />)

    mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

    mockUseSearch.mockReturnValueOnce({
      searchState: mockSearchState,
      dispatch: mockDispatch,
    })

    screen.rerender(<SearchResultsContent />)

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
      1,
      mockSearchState,
      mockDisabilitesPropertiesTruthy,
      0,
      'SearchResults'
    )
  })

  describe('when search returns no results', () => {
    it('should render NoSearchResults component', async () => {
      render(<SearchResultsContent />)

      expect(await screen.findByText(`Pas de résultat`)).toBeOnTheScreen()
      expect(
        await screen.findByText(
          'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
        )
      ).toBeOnTheScreen()
    })

    it('should render NoSearchResults component with query', async () => {
      const query = 'cinéma'
      const newSearchState = { ...mockSearchState, query }
      mockUseSearch.mockReturnValueOnce({
        searchState: newSearchState,
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      expect(await screen.findByText(`pour "${query}"`)).toBeOnTheScreen()
      expect(
        await screen.findByText(
          'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
        )
      ).toBeOnTheScreen()
    })

    it('should render NoSearchResults when location is not everywhere', async () => {
      const newSearchState = {
        ...mockSearchState,
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
          aroundRadius: MAX_RADIUS,
          place: mockedPlace,
        },
        query: 'cinéma',
      }

      mockUseSearch.mockReturnValueOnce({
        searchState: newSearchState,
        dispatch: mockDispatch,
      })
      render(<SearchResultsContent />)

      expect(
        await screen.findByText('Élargis la zone de recherche pour plus de résultats.')
      ).toBeOnTheScreen()
    })

    it('should navigate to SearchFilter when location is everywhere', async () => {
      const newSearchState = { ...mockSearchState, query: 'cinéma' }
      mockUseSearch.mockReturnValueOnce({
        searchState: newSearchState,
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      const cta = await screen.findByText('Modifier mes filtres')
      await user.press(cta)

      expect(navigate).toHaveBeenNthCalledWith(1, 'TabNavigator', {
        screen: 'SearchStackNavigator',
        params: { screen: 'SearchFilter', params: newSearchState },
      })
    })

    it('should navigate to SearchResults when location is not EVERYWHERE', async () => {
      const query = 'cinéma'
      const newSearchState = {
        ...mockSearchState,
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
          aroundRadius: MAX_RADIUS,
          place: mockedPlace,
        },
        query,
      }

      mockUseSearch.mockReturnValueOnce({
        searchState: newSearchState,
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      const cta = await screen.findByText('Élargir la zone de recherche')
      await user.press(cta)

      expect(navigate).toHaveBeenNthCalledWith(1, 'TabNavigator', {
        params: {
          params: expect.objectContaining({ ...mockSearchState, query }),
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })

    it('should log ExtendSearchRadiusClicked when `Élargir la zone de recherche` cta is pressed', async () => {
      const query = 'cinéma'
      const newSearchState = {
        ...mockSearchState,
        locationFilter: {
          locationType: LocationMode.AROUND_ME,
          aroundRadius: MAX_RADIUS,
          place: mockedPlace,
        },
        query,
      }

      mockUseSearch.mockReturnValueOnce({
        searchState: newSearchState,
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      const cta = await screen.findByText('Élargir la zone de recherche')
      await user.press(cta)

      expect(analytics.logExtendSearchRadiusClicked).toHaveBeenCalledWith()
    })

    it('should not log NoSearchResult when there is not search query execution', async () => {
      render(<SearchResultsContent />)
      await screen.findByText('Lieu culturel')

      expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
    })

    it('should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render', async () => {
      mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

      render(<SearchResultsContent />)

      mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

      screen.rerender(<SearchResultsContent />)

      screen.rerender(<SearchResultsContent />)

      expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
    })

    it('should log NoSearchResult with search result when there is search query execution and nbHits = 0', async () => {
      mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: true })

      render(<SearchResultsContent />)

      mockUseSearchResults.mockReturnValueOnce({ ...initialSearchResults, isLoading: false })

      mockUseSearch.mockReturnValueOnce({
        searchState: mockSearchState,
        dispatch: mockDispatch,
      })
      screen.rerender(<SearchResultsContent />)

      expect(analytics.logNoSearchResult).toHaveBeenNthCalledWith(1, '', searchId)
    })
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...everywhereUseLocation,
      userLocation: null,
    })
    mockUseSearchResults.mockReturnValueOnce({
      ...initialSearchResults,
      hits: mockedAlgoliaResponse.hits,
      nbHits: mockedAlgoliaResponse.nbHits,
    })
    render(<SearchResultsContent />)

    await user.press(screen.getByText('Géolocalise-toi'))

    expect(analytics.logActivateGeolocfromSearchResults).toHaveBeenCalledTimes(1)
  })

  describe('should display geolocation incitation button', () => {
    beforeAll(() => {
      mockUseLocation.mockReturnValue({
        ...everywhereUseLocation,
        userLocation: null,
      })
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
      })
    })

    it('when position is null', async () => {
      render(<SearchResultsContent />)

      expect(await screen.findByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
        userData: [{ message: 'n’est pas disponible sur le pass Culture.' }],
      })
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'iPhone' },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)
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

      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'iPhone' },
        dispatch: mockDispatch,
      })
      render(<SearchResultsContent />)

      expect(await screen.findByText('Offre non disponible sur le pass Culture.')).toBeOnTheScreen()
    })

    it('should not display when query is an available offer', async () => {
      mockUseSearchResults.mockReturnValueOnce({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
        userData: [],
      })
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'Deezer' },
        dispatch: mockDispatch,
      })
      render(<SearchResultsContent />)
      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Offre non disponible sur le pass Culture.')).not.toBeOnTheScreen()
    })
  })

  describe('Main filter button', () => {
    it('should display filter button with the number of active filters', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, priceRange: [5, 300], offerIsDuo: true },
        dispatch: mockDispatch,
      })

      render(<SearchResultsContent />)

      const filterButton = await screen.findByLabelText(
        'Voir tous les filtres\u00a0: 2 filtres actifs'
      )

      expect(filterButton).toBeOnTheScreen()
      expect(filterButton).toHaveTextContent('2')
    })
  })

  describe('when feature flag map in search desactivated', () => {
    beforeEach(() => {
      mockUseSearchResults.mockReturnValue({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
      })
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should not display tabs', async () => {
      render(<SearchResultsContent />)

      await screen.findByText('Prix')

      expect(screen.queryByText('Carte')).not.toBeOnTheScreen()
      expect(screen.queryByText('Liste')).not.toBeOnTheScreen()
    })
  })

  describe('when feature flag map in search activated', () => {
    beforeEach(() => {
      mockUseSearchResults.mockReturnValue({
        ...initialSearchResults,
        hits: mockedAlgoliaResponse.hits,
        nbHits: mockedAlgoliaResponse.nbHits,
      })
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH])
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should display tabs', async () => {
      render(<SearchResultsContent />)

      expect(await screen.findByText('Carte')).toBeOnTheScreen()
      expect(await screen.findByText('Liste')).toBeOnTheScreen()
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

      expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
    })

    it('should display empty state view when there is no search result', async () => {
      mockUseSearchResultsQuery()
      render(<SearchResultsContent />)

      expect(await screen.findByText('Pas de résultat')).toBeOnTheScreen()
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

    describe('and user location selected is everywhere', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(everywhereUseLocation)
      })

      it('should open venue map location modal when pressing map tab', async () => {
        render(reactQueryProviderHOC(<SearchResultsContent />))

        await user.press(await screen.findByText('Carte'))

        expect(await screen.findByText('Localisation')).toBeOnTheScreen()
      })

      it('should not display venue map when pressing map tab', async () => {
        render(reactQueryProviderHOC(<SearchResultsContent />))

        await user.press(await screen.findByText('Carte'))

        expect(screen.queryByTestId('venue-map-view')).not.toBeOnTheScreen()
      })
    })
  })
})
