import { useRoute } from '@react-navigation/native'
import { Hit } from 'algoliasearch/lite'
import { uniqBy } from 'lodash'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import {
  defaultDisabilitiesProperties,
  useAccessibilityFiltersContext,
} from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { initialSearchState } from 'features/search/context/reducer'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, AlgoliaVenue, FacetData } from 'libs/algolia/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { GeolocPermissionState, Position } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { useVenuesInRegionQuery } from 'queries/venueMap/useVenuesInRegionQuery'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, userEvent, waitFor, within } from 'tests/utils'

import { SearchResultsContent, SearchResultsContentProps } from './SearchResultsContent'

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
const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

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

jest.mock('features/location/helpers/getLocationSubmit', () => ({
  getLocationSubmit: () => ({
    setTempAroundMeRadius: jest.fn(),
  }),
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

jest.mock('queries/subcategories/useSubcategoriesQuery')

const venue = mockedSuggestedVenue

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

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

const mockOnEndReached = jest.fn()

const DEFAULT_SEARCH_RESULT_CONTENT_PROPS = {
  isFetching: false,
  isLoading: false,
  isFetchingNextPage: false,
  userData: [],
  onEndReached: mockOnEndReached,
  onSearchResultsRefresh: jest.fn(),
  venuesUserData: [],
  facets: {} as FacetData,
  offerVenues: [],
  hits: {
    offers: mockedAlgoliaResponse.hits.map(transformOfferHit('')),
    artists: uniqBy(
      mockedAlgoliaResponse.hits.flatMap((hit: Hit<AlgoliaOffer>) => hit.artists ?? []),
      'name'
    ),
    duplicatedOffers: [],
    venues: mockedAlgoliaResponse.hits.map((hit: Hit<AlgoliaOffer>) => ({
      ...hit.venue,
      _geoloc: hit._geoloc,
    })) as AlgoliaVenue[],
  },
  nbHits: mockedAlgoliaResponse.hits.length,
} satisfies SearchResultsContentProps

const renderSearchResultContent = (
  props: SearchResultsContentProps = DEFAULT_SEARCH_RESULT_CONTENT_PROPS
) => {
  const { rerender, ...otherProps } = render(
    reactQueryProviderHOC(<SearchResultsContent {...props} />)
  )
  const customRerender = (newProps?: SearchResultsContentProps) =>
    rerender(reactQueryProviderHOC(<SearchResultsContent {...(newProps ?? props)} />))

  return { rerender: customRerender, ...otherProps }
}

const initSearchResultsFlashlist = async () => {
  const flashList = await screen.findByTestId('searchResultsFlashlist')
  fireEvent(flashList, 'layout', {
    nativeEvent: {
      layout: { height: 2000, width: 400 },
    },
  })
  return flashList
}

describe('SearchResultsContent component', () => {
  beforeEach(() => {
    setFeatureFlags()
    useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
  })

  const user = userEvent.setup()

  beforeAll(() => {
    mockUseVenuesInRegionQuery.mockReturnValue({ data: venuesFixture })
  })

  afterEach(() => {
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
    renderSearchResultContent()

    expect(await screen.findByText('Lieu culturel')).toBeOnTheScreen()
  })

  it('should trigger onEndReached', async () => {
    renderSearchResultContent()

    const flashList = await initSearchResultsFlashlist()

    fireEvent.scroll(flashList, {
      nativeEvent: {
        layoutMeasurement: { height: 500 },
        contentOffset: { y: 1500 },
        contentSize: { height: 2000 },
      },
    })

    await waitFor(() => expect(mockOnEndReached).toHaveBeenCalledTimes(1))
  })

  describe('Category filter', () => {
    it('should display category filter button', async () => {
      renderSearchResultContent()

      expect(await screen.findByText('Catégories')).toBeOnTheScreen()
    })

    it('should open the categories filter modal when pressing the category button', async () => {
      renderSearchResultContent()
      const categoryButton = await screen.findByText('Catégories')

      await user.press(categoryButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })
  })

  describe('Price filter', () => {
    it('should display price filter button', async () => {
      renderSearchResultContent()

      expect(await screen.findByText('Prix')).toBeOnTheScreen()
    })

    it('should open the prices filter modal when pressing the prices filter button', async () => {
      renderSearchResultContent()
      const priceButton = screen.getByTestId('Prix')

      await user.press(priceButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })
  })

  describe('Offer Duo filter', () => {
    describe('When user is logged in and is benificiary with credit', () => {
      it('should display Duo filter button', async () => {
        renderSearchResultContent()

        expect(await screen.findByText('Duo')).toBeOnTheScreen()
      })

      it('should open the duo filter modal when pressing the duo filter button', async () => {
        renderSearchResultContent()
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
        renderSearchResultContent()

        await screen.findByText('Lieu culturel')

        await waitFor(() => expect(screen.queryByText('Duo')).not.toBeOnTheScreen())
      })
    })

    describe('when user is not logged in', () => {
      beforeEach(() => {
        mockAuthContextWithoutUser()
      })

      it('should not display Duo offer button', async () => {
        renderSearchResultContent()

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })

    describe('when user is not a beneficiary', () => {
      beforeEach(() => {
        mockAuthContextWithUser(nonBeneficiaryUser)
      })

      it('should not display Duo offer button', async () => {
        renderSearchResultContent()

        await screen.findByText('Lieu culturel')

        expect(screen.queryByText('Duo')).not.toBeOnTheScreen()
      })
    })
  })

  describe('should not display geolocation incitation button', () => {
    it('when position is not null', async () => {
      mockUseLocation.mockReturnValueOnce(aroundMeUseLocation)
      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('when position is null and no results search', async () => {
      mockUseLocation.mockReturnValueOnce(everywhereUseLocation)
      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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
    renderSearchResultContent()

    expect(await screen.findByText(venue.label)).toBeOnTheScreen()
  })

  describe('Venue filter', () => {
    it('should open the venue modal when pressing the venue filter button', async () => {
      renderSearchResultContent()

      const venueButton = screen.getByRole('button', { name: 'Lieu culturel' })
      await user.press(venueButton)

      expect(screen.getByTestId('fullscreenModalView')).toHaveTextContent(
        /Trouver un lieu culturel/
      )
    })

    it('should call set search state on press "Rechercher" in venue modal', async () => {
      renderSearchResultContent()

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
      renderSearchResultContent()

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
      renderSearchResultContent()

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

      renderSearchResultContent()

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
      renderSearchResultContent()

      expect(await screen.findByTestId('venueButtonLabel')).toHaveTextContent('Lieu culturel')
    })
  })

  describe('Dates and hours filter', () => {
    it('should display dates and hours filter button', async () => {
      renderSearchResultContent()

      expect(await screen.findByText('Dates & heures')).toBeOnTheScreen()
    })

    it('should open the type filter modal when pressing the type filter button', async () => {
      renderSearchResultContent()
      const datesHoursButton = screen.getByTestId('Dates & heures')

      await user.press(datesHoursButton)

      const fullscreenModalScrollView = screen.getByTestId('fullscreenModalScrollView')

      expect(fullscreenModalScrollView).toBeOnTheScreen()
    })
  })

  describe('Accessibility filter', () => {
    it('should display accessibility filter button', async () => {
      renderSearchResultContent()
      const accessibilityFilterButton = await screen.findByRole('button', { name: 'Accessibilité' })

      expect(accessibilityFilterButton).toBeOnTheScreen()
    })

    it('should open accessibility filters modal when accessibilityFiltersButton is pressed', async () => {
      renderSearchResultContent()
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
    renderSearchResultContent()

    await initSearchResultsFlashlist()

    await user.press(await screen.findByText('Géolocalise-toi'))

    await waitFor(() => expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1))
  })

  it('should not log PerformSearch when there is not search query execution', async () => {
    renderSearchResultContent()
    await screen.findByText('Lieu culturel')

    expect(analytics.logPerformSearch).not.toHaveBeenCalled()
  })

  it('should log PerformSearch only one time when there is search query execution and several re-render', async () => {
    const { rerender } = renderSearchResultContent({
      ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
      isLoading: true,
    })

    rerender({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, isLoading: false })

    expect(analytics.logPerformSearch).toHaveBeenCalledTimes(1)
  })

  it('should log PerformSearch with search result when there is search query execution', async () => {
    const { rerender } = renderSearchResultContent({
      ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
      isLoading: true,
    })

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
    rerender({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, isLoading: false })

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
      1,
      mockSearchState,
      mockAccessibilityFilter,
      4,
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

    const { rerender } = renderSearchResultContent({
      ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
      isLoading: true,
    })

    rerender({
      ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
      isLoading: false,
    })

    mockUseSearch.mockReturnValueOnce({
      searchState: mockSearchState,
      dispatch: mockDispatch,
    })

    rerender({
      ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
      isLoading: false,
    })

    expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
      1,
      mockSearchState,
      mockDisabilitesPropertiesTruthy,
      4,
      'SearchResults'
    )
  })

  describe('when search returns no results', () => {
    it('should render NoSearchResults component', async () => {
      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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
      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

      const cta = await screen.findByText('Modifier mes filtres')
      await user.press(cta)

      expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', newSearchState)
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

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

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

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

      const cta = await screen.findByText('Élargir la zone de recherche')
      await user.press(cta)

      expect(analytics.logExtendSearchRadiusClicked).toHaveBeenNthCalledWith(1, searchId)
    })

    it('should not log NoSearchResult when there is not search query execution', async () => {
      renderSearchResultContent()
      await screen.findByText('Lieu culturel')

      expect(analytics.logNoSearchResult).not.toHaveBeenCalled()
    })

    it('should log NoSearchResult only one time when there is search query execution, nbHits = 0 and several re-render', async () => {
      const { rerender } = renderSearchResultContent({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        isLoading: true,
      })

      rerender({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        isLoading: false,
        nbHits: 0,
      })

      expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
    })

    it('should log NoSearchResult with search result when there is search query execution and nbHits = 0', async () => {
      const { rerender } = renderSearchResultContent({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        isLoading: true,
      })

      mockUseSearch.mockReturnValueOnce({
        searchState: mockSearchState,
        dispatch: mockDispatch,
      })

      rerender({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        nbHits: 0,
        isLoading: false,
      })

      expect(analytics.logNoSearchResult).toHaveBeenNthCalledWith(1, '', searchId)
    })
  })

  it('should log open geolocation activation incitation modal when pressing geolocation incitation button', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...everywhereUseLocation,
      userLocation: null,
    })

    renderSearchResultContent()
    await initSearchResultsFlashlist()

    await screen.findByTestId('searchListHeader')

    await user.press(await screen.findByText('Géolocalise-toi'))

    expect(analytics.logActivateGeolocfromSearchResults).toHaveBeenCalledTimes(1)
  })

  describe('should display geolocation incitation button', () => {
    beforeAll(() => {
      mockUseLocation.mockReturnValue({
        ...everywhereUseLocation,
        userLocation: null,
      })
    })

    it('when position is null', async () => {
      renderSearchResultContent()
      await initSearchResultsFlashlist()

      expect(await screen.findByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('when position is null and query is not an offer not present', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'iPhone' },
        dispatch: mockDispatch,
      })

      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })
      await screen.findByText('Lieu culturel')

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })
  })

  describe('Offer unavailable message', () => {
    it('should display when query is an unavailable offer', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'iPhone' },
        dispatch: mockDispatch,
      })

      renderSearchResultContent({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        userData: [{ message: 'Offre non disponible sur le pass Culture.' }],
      })

      initSearchResultsFlashlist()

      expect(await screen.findByText('Offre non disponible sur le pass Culture.')).toBeOnTheScreen()
    })

    it('should not display when query is an available offer', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, query: 'Deezer' },
        dispatch: mockDispatch,
      })
      renderSearchResultContent()
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

      renderSearchResultContent()

      const filterButton = await screen.findByLabelText(
        'Voir tous les filtres\u00a0: 2 filtres actifs'
      )

      expect(filterButton).toBeOnTheScreen()
      expect(filterButton).toHaveTextContent(/2/)
    })
  })

  describe('when feature flag map in search deactivated', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should not display tabs', async () => {
      renderSearchResultContent()

      await screen.findByText('Prix')

      expect(screen.queryByText('Carte')).not.toBeOnTheScreen()
      expect(screen.queryByText('Liste')).not.toBeOnTheScreen()
    })
  })

  describe('WIP_ENABLE_GRID_LIST', () => {
    describe('is activated', () => {
      beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_GRID_LIST]))

      it('should display results as grid when click on gridlist toggle already on list mode', async () => {
        renderSearchResultContent()

        await initSearchResultsFlashlist()
        const grilleIcon = await screen.findByTestId('Grille-icon')
        await user.press(grilleIcon)

        await initSearchResultsFlashlist()

        expect(screen.getAllByTestId('OfferTile')).toBeTruthy()
      })

      it('should trigger logHasClickedGridListToggle whith previous layout when pressing gridListToggle', async () => {
        renderSearchResultContent()

        await initSearchResultsFlashlist()

        const grilleIcon = await screen.findByTestId('Grille-icon')
        await user.press(grilleIcon)

        await initSearchResultsFlashlist()

        expect(analytics.logHasClickedGridListToggle).toHaveBeenCalledWith({
          fromLayout: 'Liste',
        })
      })

      it('should display list word on toggle when list mode', async () => {
        renderSearchResultContent()

        await initSearchResultsFlashlist()

        const gridListMenu = await screen.findByTestId('grid-list-menu')

        expect(within(gridListMenu).getByText(`Liste`)).toBeTruthy()
      })

      it('should display grille word on toggle when grille mode', async () => {
        renderSearchResultContent()

        await initSearchResultsFlashlist()

        const grilleIcon = await screen.findByTestId('Grille-icon')
        await user.press(grilleIcon)
        await initSearchResultsFlashlist()

        await waitFor(() => {
          expect(screen.getByText('Grille')).toBeTruthy()
        })
      })
    })

    describe('is desactivated', () => {
      beforeEach(() => setFeatureFlags())

      it('should not display toggle', async () => {
        renderSearchResultContent()

        await initSearchResultsFlashlist()

        expect(screen.queryByTestId('grid-list-menu')).not.toBeOnTheScreen()
      })
    })
  })

  describe('when feature flag map in search activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH])
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should display tabs', async () => {
      renderSearchResultContent()

      expect(await screen.findByText('Carte')).toBeOnTheScreen()
      expect(await screen.findByText('Résultats')).toBeOnTheScreen()
    })

    it('should log consult venue map when pressing map tab', async () => {
      renderSearchResultContent()

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(analytics.logConsultVenueMap).toHaveBeenCalledWith({
        from: 'search',
        searchId: 'testUuidV4',
      })
    })

    it('should reset selected venue in store when pressing map tab', async () => {
      renderSearchResultContent()

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
    })

    it('should display empty state view when there is no search result', async () => {
      renderSearchResultContent({ ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS, nbHits: 0 })

      expect(await screen.findByText('Pas de résultat')).toBeOnTheScreen()
    })

    it('should not open venue map location modal when pressing map tab and user location selected is not everywhere', async () => {
      renderSearchResultContent()

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })

    it('should display venue map when pressing map tab if user location selected is not everywhere', async () => {
      renderSearchResultContent()

      await user.press(await screen.findByText('Carte'))
      await screen.findByTestId('venue-map-view')

      expect(screen.getByTestId('venue-map-view')).toBeOnTheScreen()
    })

    describe('and user location selected is everywhere', () => {
      beforeEach(() => {
        mockUseLocation.mockReturnValue(everywhereUseLocation)
      })

      it('should open venue map location modal when pressing map tab', async () => {
        renderSearchResultContent()

        await user.press(await screen.findByText('Carte'))

        expect(await screen.findByText('Localisation')).toBeOnTheScreen()
      })

      it('should not display venue map when pressing map tab', async () => {
        renderSearchResultContent()

        await user.press(await screen.findByText('Carte'))

        expect(screen.queryByTestId('venue-map-view')).not.toBeOnTheScreen()
      })
    })
  })

  describe('When calendar filter feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_TIME_FILTER_V2])
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should display Dates in button filter', async () => {
      renderSearchResultContent()

      expect(await screen.findByText('Dates')).toBeOnTheScreen()
    })

    it('should open calendar modal', async () => {
      renderSearchResultContent()

      await user.press(await screen.findByText('Dates'))

      expect(screen.getByTestId('calendar')).toBeOnTheScreen()
    })
  })

  describe('Artists section', () => {
    beforeEach(() => {
      mockUseLocation.mockReturnValue(aroundMeUseLocation)
    })

    it('should display artists playlist when there are artists', async () => {
      renderSearchResultContent()

      await initSearchResultsFlashlist()

      expect(await screen.findByText('Les artistes')).toBeOnTheScreen()
    })

    it('should not display artists playlist when there are not artists', async () => {
      renderSearchResultContent({
        ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS,
        hits: { ...DEFAULT_SEARCH_RESULT_CONTENT_PROPS.hits, artists: [] },
      })

      await initSearchResultsFlashlist()

      expect(screen.queryByText('Les artistes')).not.toBeOnTheScreen()
    })

    it('should trigger consult artist log when pressing artists playlist item', async () => {
      renderSearchResultContent()

      await initSearchResultsFlashlist()

      await user.press(screen.getByText('Artist 1'))

      expect(analytics.logConsultArtist).toHaveBeenCalledWith({
        artistId: '1',
        artistName: 'Artist 1',
        from: 'search',
        searchId,
      })
    })
  })
})
