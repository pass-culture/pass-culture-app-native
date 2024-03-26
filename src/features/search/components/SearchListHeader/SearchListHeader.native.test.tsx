import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { SearchState } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { act, fireEvent, render, screen } from 'tests/utils'

import { SearchListHeader } from './SearchListHeader'

const searchId = uuidv4()

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()
let mockSelectedLocationMode = LocationMode.EVERYWHERE

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
    selectedLocationMode: mockSelectedLocationMode,
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

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
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockSearchState: SearchState = initialSearchState

const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

describe('<SearchListHeader />', () => {
  beforeEach(() => {
    mockUseAccessibilityFiltersContext.mockReturnValue(defaultValuesAccessibilityContext)
    useFeatureFlagSpy.mockReturnValue(false)
  })

  afterEach(() => {
    mockSearchState = initialSearchState
    mockSelectedLocationMode = LocationMode.EVERYWHERE
  })

  it('should display the number of results', () => {
    mockSearchState = { ...mockSearchState, searchId }

    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByText('10 résultats')).toBeOnTheScreen()
  })

  it('should show correct title when NO userData exists', () => {
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
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
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.queryByText('Géolocalise-toi')).not.toBeOnTheScreen()
  })

  it('should display the geolocation incitation button when position is null', () => {
    mockPosition = null
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByText('Géolocalise-toi')).toBeOnTheScreen()
  })

  it('should display paddingBottom when nbHits is greater than 0', () => {
    render(
      <SearchListHeader nbHits={10} userData={[{ message: 'message test' }]} venuesUserData={[]} />
    )
    const bannerContainer = screen.getByTestId('banner-container')

    expect(bannerContainer.props.style).toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should not display paddingBottom when nbHits is equal to 0', () => {
    render(
      <SearchListHeader nbHits={0} userData={[{ message: 'message test' }]} venuesUserData={[]} />
    )
    const bannerContainer = screen.getByTestId('banner-container')

    expect(bannerContainer.props.style).not.toEqual([{ paddingBottom: 16, paddingHorizontal: 24 }])
  })

  it('should render venue items when there are venues', () => {
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
  })

  it('should render venues nbHits', () => {
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByText('6 résultats')).toBeOnTheScreen()
  })

  it.each`
    locationFilter                                                                          | isLocated | locationType
    ${undefined}                                                                            | ${false}  | ${undefined}
    ${{ locationType: LocationMode.EVERYWHERE }}                                            | ${false}  | ${LocationMode.EVERYWHERE}
    ${{ locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS }}                   | ${true}   | ${LocationMode.AROUND_ME}
    ${{ locationType: LocationMode.AROUND_PLACE, place: kourou, aroundRadius: MAX_RADIUS }} | ${true}   | ${LocationMode.AROUND_PLACE}
  `(
    'should trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is $locationType with isLocated param = $isLocated',
    ({ locationFilter, isLocated }) => {
      mockSearchState = { ...mockSearchState, searchId, locationFilter }
      mockSelectedLocationMode = locationFilter?.locationType ?? LocationMode.EVERYWHERE
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

  it('should not trigger VenuePlaylistDisplayedOnSearchResults log when there are venues and location type is VENUE with isLocated param = true', () => {
    mockSearchState = {
      ...mockSearchState,
      searchId,
      venue: mockAlgoliaVenues[0] as unknown as Venue,
    }
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(analytics.logVenuePlaylistDisplayedOnSearchResults).not.toHaveBeenCalled()
  })

  it('should trigger AllTilesSeen log when there are venues', async () => {
    mockSearchState = { ...mockSearchState, searchId }
    render(
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    const scrollView = screen.getByTestId('search-venue-list')
    await act(async () => {
      // 1st scroll to last item => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    })

    expect(analytics.logAllTilesSeen).toHaveBeenNthCalledWith(1, {
      searchId: 'testUuidV4',
    })

    scrollView.props.onScroll({ nativeEvent: nativeEventEnd })

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
    mockSearchState = { ...mockSearchState, searchId }
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
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
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
      <SearchListHeader nbHits={10} userData={[]} venuesUserData={[]} venues={mockAlgoliaVenues} />
    )

    expect(screen.getByText('Les offres dans des lieux accessibles')).toBeOnTheScreen()
  })

  describe('When wipVenueMapSearchResults feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValue(true)
    })

    it('should not display see map button when user is not located and there is a venues playlist', () => {
      mockSearchState = {
        ...mockSearchState,
        searchId,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
      }
      mockSelectedLocationMode = LocationMode.EVERYWHERE
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
      mockSearchState = {
        ...mockSearchState,
        searchId,
        locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
      }
      mockSelectedLocationMode = LocationMode.AROUND_ME
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
      mockSearchState = {
        ...mockSearchState,
        searchId,
        locationFilter: {
          locationType: LocationMode.AROUND_PLACE,
          place: kourou,
          aroundRadius: MAX_RADIUS,
        },
      }
      mockSelectedLocationMode = LocationMode.AROUND_PLACE
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

    describe('When see map button displayed', () => {
      beforeEach(() => {
        mockSearchState = {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        }
        mockSelectedLocationMode = LocationMode.AROUND_ME
      })

      it('should redirect to venue map when pressing see map button', () => {
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
    })
  })
})
