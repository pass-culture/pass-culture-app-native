import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen, userEvent } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

const searchId = uuidv4()
const mockUseSearch = jest.fn(() => ({
  searchState: { ...initialSearchState, searchId },
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const mockSetVenueTypeCode = jest.fn()
jest.mock('features/venueMap/store/venueTypeCodeStore', () => ({
  useVenueTypeCodeActions: () => ({ setVenueTypeCode: mockSetVenueTypeCode }),
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenuePlaylist />', () => {
  it('should render the title and venues playlist', () => {
    render(<VenuePlaylist venuePlaylistTitle="Test Playlist" venues={mockAlgoliaVenues} />)

    expect(screen.getByText('Test Playlist')).toBeOnTheScreen()
    expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
  })

  it('should not display Voir sur la carte button when current view is SearchN1 and wipVenueMap feature flag deactivated', () => {
    render(
      <VenuePlaylist
        venuePlaylistTitle="Test Playlist"
        venues={mockAlgoliaVenues}
        currentView="SearchResults"
      />
    )

    expect(screen.queryByText('Voir sur la carte')).toBeNull()
  })

  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
    })

    it('should display Voir sur la carte button when current view is SearchN1', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
        />
      )

      expect(screen.getByText('Voir sur la carte')).toBeOnTheScreen()
    })

    it('should display number of results when current view is not SearchN1', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchResults"
        />
      )

      expect(screen.getByText('6 résultats')).toBeOnTheScreen()
    })

    it('should set filter on bookstore venue type when pressing Voir sur la carte button and offer category is Livres', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.LIVRES}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockSetVenueTypeCode).toHaveBeenNthCalledWith(1, VenueTypeCodeKey.BOOKSTORE)
    })

    it('should not set filter on bookstore venue type when pressing Voir sur la carte button and offer category is not Livres', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockSetVenueTypeCode).not.toHaveBeenCalled()
    })

    it('should open venue map location modal when pressing Voir sur la carte button and user location is not located', async () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: false,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated={false}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    })

    it('should navigate to venue map when pressing Voir sur la carte button and user is located', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap')
    })

    it('should trigger ConsultVenueMap log when pressing Voir sur la carte button and user is located', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchPlaylist' })
    })

    it('should not trigger ConsultVenueMap log when pressing Voir sur la carte button and user is not located', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="SearchN1"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated={false}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(analytics.logConsultVenueMap).not.toHaveBeenCalled()
    })
  })
})
