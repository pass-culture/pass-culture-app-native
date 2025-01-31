import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { setSettings } from 'features/auth/tests/setSettings'
import { navigationRef } from 'features/navigation/navigationRef'
import * as useGoBack from 'features/navigation/useGoBack'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { BooksNativeCategoriesEnum, SearchState, SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContextModule from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { GeoCoordinates, Position } from 'libs/location'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { act, render, screen, userEvent } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { SearchBox } from './SearchBox'

let mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.CINEMA],
  priceRange: [0, 20],
}

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))
const queryWithMoreThan150characters =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non aliquet quam, at ultrices purus. Morbi velit orci, tincidunt sed erat sed efficitur.'

const mockDispatch = jest.fn()
let mockIsFocusOnSuggestions = false
const mockHideSuggestions = jest.fn()
const mockShowSuggestions = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
    hideSuggestions: mockHideSuggestions,
    showSuggestions: mockShowSuggestions,
  }),
}))

jest.mock('libs/firebase/analytics')
jest.mock('features/navigation/TabBar/routes')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
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

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
const mockClear = jest.fn()
let mockQuery = ''
jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: mockQuery,
    refine: jest.fn,
    clear: mockClear,
  }),
}))

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: Position = DEFAULT_POSITION

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    place: null,
    onModalHideRef: jest.fn(),
    isCurrentLocationMode: jest.fn(),
  }),
}))

jest.mock('features/navigation/navigationRef')

const mockRoutes = [
  { key: 'TabNavigator1', name: 'TabNavigator', params: { screen: 'Bookings' } },
  {
    key: 'TabNavigator2',
    name: 'TabNavigator',
    params: {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchResults' },
    },
  },
]

const mockRoutesWithVenue = [
  { key: 'Venue1', name: 'Venue', params: { id: 22912 } },
  {
    key: 'TabNavigator2',
    name: 'TabNavigator',
    params: {
      screen: 'SearchStackNavigator',
      params: { screen: 'SearchResults' },
    },
  },
]

const mockRoutesWithThematicSearch = [
  {
    key: 'TabNavigator',
    name: 'TabNavigator',
    params: { screen: 'SearchStackNavigator' },
    state: {
      routes: [{ name: 'SearchStackNavigator', state: { routes: [{ name: 'ThematicSearch' }] } }],
    },
  },
]

const venue = mockedSuggestedVenue

const searchId = uuidv4()

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.useFakeTimers()
const user = userEvent.setup()

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContextModule, 'useRemoteConfigContext')

jest.mock('libs/firebase/analytics/analytics')

describe('SearchBox component', () => {
  beforeEach(() => {
    setFeatureFlags()
    jest.spyOn(navigationRef, 'getState').mockReturnValue({
      key: 'Navigator',
      index: 1,
      routeNames: ['TabNavigator'],
      routes: mockRoutes,
      type: 'tab',
      stale: false,
    })
  })

  afterEach(() => {
    mockSearchState = {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.CINEMA],
      priceRange: [0, 20],
    }
    mockQuery = ''
    mockIsFocusOnSuggestions = false
  })

  describe('shouldRedirectToThematicSearch remote config enabled', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldRedirectToThematicSearch: true,
      })
    })

    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1])
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldRedirectToThematicSearch: false,
      })
    })

    it.each(['CINÉMA', 'Cinéma ', 'cinéma', 'cinémas', 'CINEMA', 'Cinema ', 'cinéma', 'cinémas'])(
      'should log HasSearchedCinemaQuery analytic when queryText is `%s` and SearchView is `Landing`',
      async (queryText) => {
        // TODO(PC-32646): useRoute & useRemoteConfigContext are called every time a letter is inputted +1
        useRoute.mockReturnValue({ name: SearchView.Landing })

        renderSearchBox()

        const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

        await user.type(searchInput, queryText, { submitEditing: true })

        expect(analytics.logHasSearchedCinemaQuery).toHaveBeenCalledTimes(1)
      }
    )

    it('should update searchState with remote config when current route is searchLanding', async () => {
      // TODO(PC-32646): useRoute is called every time a letter is inputted +1 (sic!)
      useRoute
        .mockReturnValueOnce({ name: SearchView.Landing })
        .mockReturnValueOnce({ name: SearchView.Landing })
        .mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'HP', { submitEditing: true })

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_STATE',
        payload: expect.objectContaining({
          shouldRedirect: true,
        }),
      })
    })

    it('should not update searchState with remote config when current route is not searchLanding', async () => {
      // TODO(PC-32646): useRoute is called every time a letter is inputted +1 (sic!)
      useRoute
        .mockReturnValueOnce({ name: SearchView.Results })
        .mockReturnValueOnce({ name: SearchView.Results })
        .mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'HP', { submitEditing: true })

      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_STATE',
        payload: expect.not.objectContaining({
          shouldRedirect: expect.anything(),
        }),
      })
    })
  })

  describe('shouldRedirectToThematicSearch remote config disabled', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldRedirectToThematicSearch: false,
      })
    })

    describe('Without autocomplete', () => {
      beforeAll(() => {
        setSettings({ appEnableAutocomplete: false })
      })

      it('should stay on the current view when focusing search input and being on the %s view', async () => {
        useRoute.mockReturnValueOnce({ name: SearchView.Results })

        renderSearchBox()

        const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

        await user.type(searchInput, '')

        expect(mockDispatch).not.toHaveBeenCalled()
      })

      it('should reset input when user click on reset icon when being focus on the suggestions view', async () => {
        useRoute.mockReturnValueOnce({ name: SearchView.Results })

        mockIsFocusOnSuggestions = true
        mockSearchState = {
          ...mockSearchState,
          query: 'Some text',
        }
        renderSearchBox()

        const resetIcon = screen.getByTestId('Réinitialiser la recherche')
        await user.press(resetIcon)

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            query: '',
          },
        })
        expect(mockClear).toHaveBeenCalledTimes(1)
      })

      it('should reset input when user click on reset icon when being on the search results view when isDesktopViewport', async () => {
        mockSearchState = {
          ...mockSearchState,
          query: 'Some text',
        }
        useRoute.mockReturnValueOnce({ name: SearchView.Results })

        renderSearchBox(true)

        const resetIcon = screen.getByTestId('Réinitialiser la recherche')
        await user.press(resetIcon)

        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'SET_STATE',
          payload: {
            ...mockSearchState,
            query: '',
          },
        })
        expect(mockClear).toHaveBeenCalledTimes(1)
      })
    })

    describe('With autocomplete', () => {
      beforeAll(() => {
        setSettings({ appEnableAutocomplete: true })
      })

      afterAll(() => {
        setSettings()
      })

      it('should unfocus from suggestion when being focus on the suggestions and press back button', async () => {
        mockIsFocusOnSuggestions = true
        useRoute.mockReturnValueOnce({ name: SearchView.Landing })

        renderSearchBox()
        const previousButton = screen.getByTestId('Revenir en arrière')

        await user.press(previousButton)

        expect(mockHideSuggestions).toHaveBeenNthCalledWith(1)
      })

      it('should hide suggestions when being focus on suggestions and press back button on landing view', async () => {
        mockIsFocusOnSuggestions = true
        useRoute.mockReturnValueOnce({ name: SearchView.Landing })

        renderSearchBox()

        const previousButton = screen.getByTestId('Revenir en arrière')

        await user.press(previousButton)

        expect(mockHideSuggestions).toHaveBeenNthCalledWith(1)
      })

      it('should reset input when user click on reset icon when being focus on suggestions', async () => {
        mockIsFocusOnSuggestions = true
        mockSearchState = {
          ...mockSearchState,
          query: 'Some text',
        }
        mockQuery = 'Some text'
        renderSearchBox()

        const resetIcon = await screen.findByTestId('Réinitialiser la recherche')
        await user.press(resetIcon)

        expect(screen.queryByText('Some text')).not.toBeOnTheScreen()

        expect(mockClear).toHaveBeenCalledTimes(1)
      })
    })

    it('should render SearchBox', async () => {
      renderSearchBox()
      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      expect(searchInput).toBeOnTheScreen()
    })

    it('should set search state on submit', async () => {
      // TODO(PC-32646): useRoute is called every time a letter is inputted +1 (sic!)
      useRoute
        .mockReturnValueOnce({ name: SearchView.Results })
        .mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'j', { submitEditing: true })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          query: 'j',
          offerCategories: mockSearchState.offerCategories,
          priceRange: mockSearchState.priceRange,
          searchId,
        },
      })
    })

    it('should display error message when query submitted is longer than 150 characters', async () => {
      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, queryWithMoreThan150characters, { submitEditing: true })

      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Ta recherche ne peut pas faire plus de 150 caractères.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })

    it('should navigate to search results on submit', async () => {
      // TODO(PC-32646): useRoute is called every time a letter is inputted +1 (sic!)
      useRoute.mockReturnValueOnce({}).mockReturnValueOnce({})

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'j', { submitEditing: true })

      expect(useRoute).toHaveBeenCalledTimes(2)
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          params: {
            ...initialSearchState,
            query: 'j',
            offerCategories: mockSearchState.offerCategories,
            priceRange: mockSearchState.priceRange,
            searchId,
            accessibilityFilter: {
              isAudioDisabilityCompliant: undefined,
              isMentalDisabilityCompliant: undefined,
              isMotorDisabilityCompliant: undefined,
              isVisualDisabilityCompliant: undefined,
            },
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })

    it('should not navigate to searchResults when user clicks on reset icon', async () => {
      useRoute.mockReturnValueOnce({}).mockReturnValueOnce({})

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')
      await user.type(searchInput, 'j')
      const resetSearchInputButton = screen.getByTestId('Réinitialiser la recherche')
      await user.press(resetSearchInputButton)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: mockSearchState,
      })
      expect(navigate).not.toHaveBeenCalled()
    })

    it('should not show back button when being on the search landing view', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()

      const previousButton = screen.queryByTestId('Revenir en arrière')

      expect(previousButton).not.toBeOnTheScreen()
    })

    it('should show back button when being on the search results view', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      expect(previousButton).toBeOnTheScreen()
    })

    it('should show back button when being focus on suggestions', async () => {
      mockIsFocusOnSuggestions = true
      renderSearchBox()

      const previousButton = screen.getByTestId('Revenir en arrière')

      expect(previousButton).toBeOnTheScreen()
    })

    it('should show the text typed by the user', async () => {
      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')
      await user.type(searchInput, 'Some text')

      expect(searchInput.props.value).toBe('Some text')
    })

    it('should not execute a search if input is empty', async () => {
      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, '')

      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('should show reset button when search input is filled', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      mockIsFocusOnSuggestions = true
      mockQuery = 'Some text'
      mockSearchState = {
        ...mockSearchState,
        query: mockQuery,
      }

      renderSearchBox()

      expect(await screen.findByLabelText('Réinitialiser la recherche')).toBeOnTheScreen()
    })

    it('should not show reset button when search input is empty', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      mockIsFocusOnSuggestions = true

      renderSearchBox()

      expect(screen.queryByLabelText('Réinitialiser la recherche')).not.toBeOnTheScreen()
    })

    it.each(['LIVRE', 'Livre ', 'livre', 'LIVRES', 'Livres', 'livres '])(
      'should redirect to ThematicSearch when queryText is `%s` and SearchView is `Landing`',
      async (queryText) => {
        // TODO(PC-32646): useRoute is called every time a letter is inputted +1 (sic!)
        useRoute.mockReturnValue({ name: SearchView.Landing })
        setFeatureFlags([RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1])

        renderSearchBox()

        const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')
        await user.type(searchInput, queryText, { submitEditing: true })

        expect(navigate).toHaveBeenCalledWith('TabNavigator', {
          params: {
            params: {
              ...initialSearchState,
              query: queryText.trim(),
              offerCategories: [SearchGroupNameEnumv2.LIVRES],
              searchId,
              accessibilityFilter: {
                isAudioDisabilityCompliant: undefined,
                isMentalDisabilityCompliant: undefined,
                isMotorDisabilityCompliant: undefined,
                isVisualDisabilityCompliant: undefined,
              },
              priceRange: mockSearchState.priceRange,
              shouldRedirect: false,
            },
            screen: 'ThematicSearch',
          },
          screen: 'SearchStackNavigator',
        })
      }
    )

    it('should log HasSearchedCinemaQuery analytic when shouldRedirectToThematicSearch is disabled', async () => {
      // TODO(PC-32646): useRoute & useRemoteConfigContext are called every time a letter is inputted +1
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'cinéma', { submitEditing: true })

      expect(analytics.logHasSearchedCinemaQuery).toHaveBeenCalledTimes(1)
    })

    it('should reset searchState when user go goBack to Landing', async () => {
      mockSearchState = {
        ...mockSearchState,
        query: 'Some text',
      }
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      mockQuery = 'Some text'
      renderSearchBox(true)

      const goBackIcon = screen.getByTestId('icon-back')
      await user.press(goBackIcon)

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: { ...initialSearchState, offerCategories: mockSearchState.offerCategories },
      })
    })

    it('should execute a search if input is not empty', async () => {
      useRoute
        .mockReturnValueOnce({ name: SearchView.Results })
        .mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, 'j', { submitEditing: true })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_STATE',
        payload: {
          ...initialSearchState,
          query: 'j',
          offerCategories: mockSearchState.offerCategories,
          priceRange: mockSearchState.priceRange,
          searchId,
        },
      })
    })

    it('should display suggestions when focusing search input and no search executed', async () => {
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })
      renderSearchBox()

      const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

      await user.type(searchInput, '')

      expect(mockShowSuggestions).toHaveBeenNthCalledWith(1)
    })

    it('should hide the search filter button when being on the search landing view', async () => {
      mockSearchState = {
        ...mockSearchState,
        query: 'la fnac',
      }
      useRoute.mockReturnValueOnce({ name: SearchView.Landing })

      renderSearchBox()

      await act(async () => {
        expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
      })
    })

    it('should hide the search filter button when being on the search result view and being focus on the suggestion', async () => {
      mockIsFocusOnSuggestions = true
      mockSearchState = {
        ...mockSearchState,
        query: 'la fnac',
      }
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      await act(async () => {
        expect(screen.queryByTestId(/Voir tous les filtres/)).not.toBeOnTheScreen()
      })
    })

    it(`should not display Le Petit Rintintin 1 in location search widget when a venue is selected`, async () => {
      mockSearchState = { ...initialSearchState, venue }
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      renderSearchBox()

      expect(screen.queryByText(venue.label)).not.toBeOnTheScreen()
    })

    it('should not display locationSearchWidget when isDesktopViewport = true', async () => {
      mockSearchState = {
        ...initialSearchState,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
      }
      useRoute.mockReturnValueOnce({ name: SearchView.Results })

      mockPosition = DEFAULT_POSITION
      renderSearchBox()

      expect(await screen.findByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
    })

    jest.mock('libs/firebase/analytics/analytics')

    describe('Venue previous route on search results', () => {
      beforeEach(() => {
        jest.spyOn(navigationRef, 'getState').mockReturnValue({
          key: 'Navigator',
          index: 1,
          routeNames: ['TabNavigator'],
          routes: mockRoutesWithVenue,
          type: 'tab',
          stale: false,
        })
        useRoute.mockReturnValueOnce({ name: SearchView.Results })
      })

      it('should unselect the venue and set the view to Landing when current route is search and previous route is Venue when the user press the back button', async () => {
        renderSearchBox()

        const previousButton = screen.getByTestId('Revenir en arrière')

        await user.press(previousButton)

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: { ...initialSearchState, offerCategories: mockSearchState.offerCategories },
        })
      })

      it('should execute go back when current route is search and previous route is Venue', async () => {
        renderSearchBox()

        const previousButton = screen.getByTestId('Revenir en arrière')

        await user.press(previousButton)

        expect(mockGoBack).toHaveBeenCalledTimes(1)
      })

      it('should update searchState without offerNativeCategories set to undefined when a query is made from another page than ThematicSearch', async () => {
        // TODO(PC-32646): useRoute is called every time a letter is inputted +1
        useRoute
          .mockReturnValueOnce({
            name: SearchView.Results,
          })
          .mockReturnValueOnce({ name: SearchView.Results })
        const BOOK_OFFER_CATEGORIES = [SearchGroupNameEnumv2.LIVRES]
        const BOOK_OFFER_NATIVE_CATEGORIES = [BooksNativeCategoriesEnum.BD_ET_COMICS]

        mockSearchState = {
          ...mockSearchState,
          offerCategories: BOOK_OFFER_CATEGORIES,
          offerNativeCategories: BOOK_OFFER_NATIVE_CATEGORIES,
        }

        renderSearchBox()

        const searchInput = screen.getByPlaceholderText('Offre, artiste, lieu culturel...')

        await user.type(searchInput, 'HP', { submitEditing: true })

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: 'HP',
            offerCategories: BOOK_OFFER_CATEGORIES,
            offerNativeCategories: BOOK_OFFER_NATIVE_CATEGORIES,
            priceRange: mockSearchState.priceRange,
            searchId,
          },
        })
      })
    })

    describe('ThematicSearch previous route on search results', () => {
      beforeEach(() => {
        jest.spyOn(navigationRef, 'getState').mockReturnValue({
          key: 'Navigator',
          index: 1,
          routeNames: ['TabNavigator'],
          routes: mockRoutesWithThematicSearch,
          type: 'tab',
          stale: false,
        })
        useRoute.mockReturnValueOnce({ name: SearchView.Thematic })
      })

      it('should execute go back when current route is search and previous route is ThematicSearch', async () => {
        useRoute.mockReturnValueOnce({
          name: SearchView.Results,
        })

        renderSearchBox()

        const previousButton = screen.getByTestId('Revenir en arrière')

        await user.press(previousButton)

        expect(mockGoBack).toHaveBeenCalledTimes(1)
      })

      it('should clear offerNativeCategories and gtls when a previous search was made on searchResults and now a query is made on ThematicSearch', async () => {
        // TODO(PC-32646): useRoute is called every time a letter is inputted +1
        useRoute
          .mockReturnValueOnce({
            name: SearchView.Thematic,
          })
          .mockReturnValueOnce({ name: SearchView.Thematic })

        const BOOK_OFFER_CATEGORIES = [SearchGroupNameEnumv2.LIVRES]
        const BOOK_SEARCH_BOX_PLACEHOLDER = 'Livres'

        mockSearchState = {
          ...mockSearchState,
          offerCategories: BOOK_OFFER_CATEGORIES,
          offerNativeCategories: [BooksNativeCategoriesEnum.MANGAS],
          offerGenreTypes: undefined,
          gtls: [
            {
              code: '03040300',
              label: 'Kodomo',
              level: 3,
            },
            {
              code: '03040400',
              label: 'Shôjo',
              level: 3,
            },
          ],
        }

        renderSearchBox(false, BOOK_OFFER_CATEGORIES, BOOK_SEARCH_BOX_PLACEHOLDER)

        const searchInput = screen.getByPlaceholderText(BOOK_SEARCH_BOX_PLACEHOLDER)

        await user.type(searchInput, 'HP', { submitEditing: true })

        expect(mockDispatch).toHaveBeenNthCalledWith(1, {
          type: 'SET_STATE',
          payload: {
            ...initialSearchState,
            query: 'HP',
            offerCategories: BOOK_OFFER_CATEGORIES,
            gtls: [],
            priceRange: mockSearchState.priceRange,
            searchId,
          },
        })
      })
    })
  })
})

const renderSearchBox = (
  isDesktopViewport?: boolean,
  offerCategories?: SearchGroupNameEnumv2[],
  placeholder?: string
) => {
  return render(
    <DummySearchBox offerCategories={offerCategories} placeholder={placeholder} />,

    { theme: { isDesktopViewport: isDesktopViewport ?? false } }
  )
}

const DummySearchBox = ({
  placeholder,
  offerCategories,
}: {
  offerCategories?: SearchGroupNameEnumv2[]
  placeholder?: string
}) => {
  const searchInputID = uuidv4()

  return (
    <React.Fragment>
      <SearchBox
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
        offerCategories={offerCategories}
        placeholder={placeholder}
      />
    </React.Fragment>
  )
}
