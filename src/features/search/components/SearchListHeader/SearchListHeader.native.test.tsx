import { Route } from '@react-navigation/native'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { usePreviousRoute } from 'features/navigation/helpers/__mocks__/usePreviousRoute'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { adaptAlgoliaVenues } from 'libs/algolia/fetchAlgolia/fetchVenues/adaptAlgoliaVenues'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates } from 'libs/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

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

const useFeatureFlagSpy = jest
  .spyOn(useFeatureFlagAPI, 'useFeatureFlag')
  // venue map FF
  .mockReturnValue(false)
  // venue map in search FF
  .mockReturnValue(false)

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

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<SearchListHeader />', () => {
  beforeEach(() => {
    mockUseAccessibilityFiltersContext.mockReturnValue(defaultValuesAccessibilityContext)
    mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' })
  })

  describe('When feature flags deactivated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(false)
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

    it('should show correct title when NO userData exists', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText('Les lieux culturels')).toBeOnTheScreen()
    })

    it('should show correct title when userData exists', () => {
      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[{ venue_playlist_title: 'test' }]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.queryByText('Les lieux culturels')).not.toBeOnTheScreen()
      expect(screen.getByText('test')).toBeOnTheScreen()
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

      expect(bannerContainer.props.style).toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
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

    it('should display generic banner for geolocation incitation', () => {
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

      expect(screen.getByTestId('genericBanner')).toBeOnTheScreen()
    })
  })

  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true).mockReturnValue(false)
    })

    it('should not display see map button when user is not located and there is a venues playlist', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.EVERYWHERE },
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

      expect(
        screen.queryByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)
      ).not.toBeOnTheScreen()
    })

    it('should display see map button when user location mode is around me and there is a venues playlist', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
      })
      const location = {
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_ME,
        hasGeolocPosition: true,
      }
      mockUseLocation.mockReturnValueOnce(location)
      mockUseLocation.mockReturnValueOnce(location)

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)).toBeOnTheScreen()
    })

    it('should display see map button when user location mode is around place and there is a venues playlist', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: {
            locationType: LocationMode.AROUND_PLACE,
            place: kourou,
            aroundRadius: MAX_RADIUS,
          },
        },
      })
      const location = {
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        hasGeolocPosition: true,
      }
      mockUseLocation.mockReturnValueOnce(location)
      mockUseLocation.mockReturnValueOnce(location)

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      expect(screen.getByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)).toBeOnTheScreen()
    })

    it('should redirect to venue map when pressing see map button with playlist venues content', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
      })
      const location = {
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_ME,
        hasGeolocPosition: true,
      }
      mockUseLocation.mockReturnValueOnce(location)
      mockUseLocation.mockReturnValueOnce(location)

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      fireEvent.press(screen.getByText(`Voir sur la carte (${mockAlgoliaVenues.length})`))

      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap')
    })

    it('should update initial venues store when pressing see map button with playlist venues content', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
      })
      const location = {
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_ME,
        hasGeolocPosition: true,
      }
      mockUseLocation.mockReturnValueOnce(location)
      mockUseLocation.mockReturnValueOnce(location)

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      fireEvent.press(screen.getByText(`Voir sur la carte (${mockAlgoliaVenues.length})`))

      expect(mockSetInitialVenues).toHaveBeenNthCalledWith(1, adaptAlgoliaVenues(mockAlgoliaVenues))
    })

    it('should log consult venue map from search playlist when pressing see map button', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
      })
      const location = {
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_ME,
        hasGeolocPosition: true,
      }
      mockUseLocation.mockReturnValueOnce(location)
      mockUseLocation.mockReturnValueOnce(location)

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues}
        />
      )

      fireEvent.press(screen.getByText(`Voir sur la carte (${mockAlgoliaVenues.length})`))

      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchPlaylist' })
    })
  })

  describe('When wipVenueMapInSearch feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true).mockReturnValue(true)
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

      expect(
        screen.queryByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)
      ).not.toBeOnTheScreen()
    })
  })

  describe('When wipAppV2SystemBlock feature flag activated', () => {
    beforeAll(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should display system banner for geolocation incitation', () => {
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

      expect(screen.getByTestId('systemBanner')).toBeOnTheScreen()
    })
  })
})
