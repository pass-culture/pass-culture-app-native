import { Route } from '@react-navigation/native'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { usePreviousRoute } from 'features/navigation/helpers/__mocks__/usePreviousRoute'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeoCoordinates } from 'libs/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { act, render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

jest.useFakeTimers()
jest.mock('libs/firebase/analytics/analytics')

const searchId = uuidv4()

const mockUsePreviousRoute: jest.Mock<Route<string> | null> = usePreviousRoute

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
const mockPosition: GeoCoordinates | null = DEFAULT_POSITION

const mockUseLocation: jest.Mock<Partial<ILocationContext>> = jest.fn(() => ({
  geolocPosition: mockPosition,
  selectedLocationMode: LocationMode.EVERYWHERE,
}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockDisabilities = {
  [DisplayedDisabilitiesEnum.AUDIO]: false,
  [DisplayedDisabilitiesEnum.MENTAL]: false,
  [DisplayedDisabilitiesEnum.MOTOR]: false,
  [DisplayedDisabilitiesEnum.VISUAL]: false,
}
const defaultValuesAccessibilityContext = {
  disabilities: mockDisabilities,
  setDisabilities: jest.fn(),
}

jest.mock('features/accessibility/context/AccessibilityFiltersWrapper')
const mockUseAccessibilityFiltersContext = useAccessibilityFiltersContext as jest.Mock

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockSearchState: SearchState = initialSearchState
const mockUseSearch = jest.fn(() => ({
  searchState: { ...initialSearchState, searchId },
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('features/location/helpers/useLocationState', () => ({
  useLocationState: () => ({
    onModalHideRef: { current: jest.fn() },
  }),
}))

const mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<SearchListHeader />', () => {
  beforeEach(() => {
    mockUseAccessibilityFiltersContext.mockReturnValue(defaultValuesAccessibilityContext)
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  describe('When feature flags deactivated', () => {
    beforeEach(() => {
      setFeatureFlags()
    })

    it('should display the number of results', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, searchId },
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText('10 résultats')).toBeOnTheScreen()
    })

    describe('venuePlaylistTitle', () => {
      const accessibilityFilterActivated = {
        ...defaultValuesAccessibilityContext,
        disabilities: { ...mockDisabilities, [DisplayedDisabilitiesEnum.AUDIO]: true },
      }

      it.each`
        mockVenuesUserData                              | accessibilityFilter                  | selectedLocationMode         | geolocPosition  | expectedTitle
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${accessibilityFilterActivated}      | ${LocationMode.EVERYWHERE}   | ${undefined}    | ${'Les disquaires accessibles'}
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${defaultValuesAccessibilityContext} | ${LocationMode.AROUND_ME}    | ${mockPosition} | ${'Les disquaires près de toi'}
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${defaultValuesAccessibilityContext} | ${LocationMode.AROUND_PLACE} | ${undefined}    | ${'Les disquaires près de toi'}
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${defaultValuesAccessibilityContext} | ${LocationMode.EVERYWHERE}   | ${undefined}    | ${'Les disquaires'}
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${accessibilityFilterActivated}      | ${LocationMode.AROUND_ME}    | ${mockPosition} | ${'Les disquaires accessibles près de toi'}
        ${[{ venue_playlist_title: 'Les disquaires' }]} | ${accessibilityFilterActivated}      | ${LocationMode.AROUND_PLACE} | ${undefined}    | ${'Les disquaires accessibles près de toi'}
        ${[]}                                           | ${accessibilityFilterActivated}      | ${LocationMode.EVERYWHERE}   | ${undefined}    | ${'Les lieux culturels accessibles'}
        ${[]}                                           | ${defaultValuesAccessibilityContext} | ${LocationMode.AROUND_ME}    | ${mockPosition} | ${'Les lieux culturels près de toi'}
        ${[]}                                           | ${defaultValuesAccessibilityContext} | ${LocationMode.AROUND_PLACE} | ${undefined}    | ${'Les lieux culturels près de toi'}
        ${[]}                                           | ${accessibilityFilterActivated}      | ${LocationMode.AROUND_ME}    | ${mockPosition} | ${'Les lieux culturels accessibles près de toi'}
        ${[]}                                           | ${accessibilityFilterActivated}      | ${LocationMode.AROUND_PLACE} | ${undefined}    | ${'Les lieux culturels accessibles près de toi'}
        ${[]}                                           | ${defaultValuesAccessibilityContext} | ${LocationMode.EVERYWHERE}   | ${undefined}    | ${'Les lieux culturels'}
      `(
        'should show correct title',
        ({
          accessibilityFilter,
          mockVenuesUserData,
          selectedLocationMode,
          geolocPosition,
          expectedTitle,
        }) => {
          mockUseAccessibilityFiltersContext.mockReturnValueOnce(accessibilityFilter)
          mockUseLocation.mockReturnValueOnce({
            geolocPosition,
            selectedLocationMode,
          })
          render(
            <SearchListHeader
              nbHits={10}
              userData={[]}
              venuesUserData={mockVenuesUserData}
              venues={mockAlgoliaVenues}
            />
          )

          expect(screen.getByText(expectedTitle)).toBeOnTheScreen()
        }
      )
    })

    it('should not display the geolocation button if position is not null', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
    })

    it('should display the geolocation incitation button when position is null', () => {
      mockUseLocation.mockReturnValueOnce({
        geolocPosition: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
      })
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
    })

    it('should display paddingBottom when nbHits is greater than 0', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[{ message: 'message test' }]}
          venuesUserData={[]}
        />
      )
      const bannerContainer = screen.getByTestId('banner-container')

      expect(bannerContainer).toHaveStyle({ paddingBottom: 16, paddingHorizontal: 24 })
    })

    it('should not display paddingBottom when nbHits is equal to 0', () => {
      render(
        <SearchListHeader nbHits={0} userData={[{ message: 'message test' }]} venuesUserData={[]} />
      )
      const bannerContainer = screen.getByTestId('banner-container')

      expect(bannerContainer.props.style).not.toEqual([
        { paddingBottom: 16, paddingHorizontal: 24 },
      ])
    })

    it('should render venue items when there are venues', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
    })

    it('should render venues nbHits', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText('6 résultats')).toBeOnTheScreen()
    })

    it.each`
      locationFilter                                                                          | isLocated | locationType
      ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${false}  | ${LocationMode.EVERYWHERE}
      ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${true}   | ${LocationMode.AROUND_ME}
      ${{ locationType: LocationMode.AROUND_PLACE, place: kourou, aroundRadius: MAX_RADIUS }} | ${true}   | ${LocationMode.AROUND_PLACE}
    `(
      'should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is $locationType with isLocated param = $isLocated',
      ({ locationFilter, isLocated }) => {
        mockUseSearch.mockReturnValueOnce({
          searchState: { ...mockSearchState, searchId, locationFilter },
        })
        mockUseLocation.mockReturnValueOnce({
          geolocPosition: mockPosition,
          selectedLocationMode: locationFilter.locationType,
        })

        render(
          <SearchListHeader
            nbHits={10}
            userData={[]}
            venuesUserData={[]}
            venues={mockAlgoliaVenues}
          />
        )

        expect(analytics.logVenuePlaylistDisplayedOnSearchResults).toHaveBeenNthCalledWith(1, {
          isLocated,
          searchId: 'testUuidV4',
          searchNbResults: 6,
        })
      }
    )

    it('should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is undefined with isLocated param = false', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, searchId },
      })
      mockUseLocation.mockReturnValueOnce({
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.EVERYWHERE,
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).toHaveBeenNthCalledWith(1, {
        isLocated: false,
        searchId: 'testUuidV4',
        searchNbResults: 6,
      })
    })

    it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is VENUE with isLocated param = true', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          venue: mockAlgoliaVenues[0] as unknown as Venue,
        },
      })
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
    })

    it('should trigger AllTilesSeen log when there are venues', async () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, searchId },
      })
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      const scrollView = screen.getByTestId('search-venue-list')
      await act(async () => {
        // 1st scroll to last item => trigger
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenNthCalledWith(1, {
        searchId: 'testUuidV4',
      })

      await act(async () => {
        await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      })

      expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
    })

    it('should not render venue items when there are not venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

      expect(screen.queryByTestId('search-venue-list')).not.toBeOnTheScreen()
    })

    it('should not render venues nbHits', () => {
      render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

      expect(screen.queryByText('2 résultats')).not.toBeOnTheScreen()
    })

    it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are not venues', () => {
      render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

      expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
    })

    it('should not trigger AllTilesSeen log when there are not venues', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: { ...mockSearchState, searchId },
      })
      render(<SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={[]} />)

      expect(analytics.logAllTilesSeen).not.toHaveBeenCalled()
    })

    it('should not show disability title when NO disabilities are selected', async () => {
      mockUseAccessibilityFiltersContext.mockReturnValueOnce({
        disabilities: {
          [DisplayedDisabilitiesEnum.AUDIO]: false,
          [DisplayedDisabilitiesEnum.MENTAL]: false,
          [DisplayedDisabilitiesEnum.MOTOR]: false,
          [DisplayedDisabilitiesEnum.VISUAL]: false,
        },
        setDisabilities: jest.fn(),
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      await screen.findByText('Les offres')

      expect(screen.queryByText('Les offres dans des lieux accessibles')).not.toBeOnTheScreen()
    })

    it('should show disability title when at least one disability is selected', async () => {
      mockUseAccessibilityFiltersContext.mockReturnValueOnce({
        disabilities: {
          [DisplayedDisabilitiesEnum.AUDIO]: true,
          [DisplayedDisabilitiesEnum.MENTAL]: false,
          [DisplayedDisabilitiesEnum.MOTOR]: false,
          [DisplayedDisabilitiesEnum.VISUAL]: false,
        },
        setDisabilities: jest.fn(),
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText('Les offres dans des lieux accessibles')).toBeOnTheScreen()
    })
  })

  describe('when FF WIP_VENUE_MAP_IN_SEARCH is activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH])
    })

    it('should not displayed the button "Voir sur la carte"', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.queryByText('Voir sur la carte')).not.toBeOnTheScreen()
    })
  })

  it('should display system banner for geolocation incitation', () => {
    mockUseLocation.mockReturnValueOnce({
      geolocPosition: null,
      selectedLocationMode: LocationMode.EVERYWHERE,
    })
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
  })

  describe('when FF WIP_ENABLE_GRID_LIST is activated', () => {
    it('should display grid list menu', async () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
          shouldDisplayGridList
        />
      )

      await screen.findByText('Les offres')

      expect(await screen.findByTestId('grid-list-menu')).toBeOnTheScreen()
    })
  })
})
