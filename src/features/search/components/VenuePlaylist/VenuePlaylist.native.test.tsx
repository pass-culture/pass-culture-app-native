import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, VenueTypeCodeKey } from 'api/gen'
import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { convertAlgoliaVenue2AlgoliaVenueOfferListItem } from 'features/search/helpers/searchList/getReconciledVenues'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { render, screen, userEvent } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

const searchId = uuidv4()
const mockUseSearch = jest.fn(() => ({
  searchState: { ...initialSearchState, searchId },
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const mockSetVenuesFilters = jest.spyOn(venuesFilterActions, 'setVenuesFilters')

const mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockedAlgoliaVenuesItems = mockAlgoliaVenues.map(
  convertAlgoliaVenue2AlgoliaVenueOfferListItem
)

const user = userEvent.setup()

jest.useFakeTimers()

describe('<VenuePlaylist />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should render the title and venues playlist', () => {
    render(<VenuePlaylist venuePlaylistTitle="Test Playlist" venues={mockedAlgoliaVenuesItems} />)

    expect(screen.getByText('Test Playlist')).toBeOnTheScreen()
    expect(screen.getByTestId('search-venue-list')).toBeOnTheScreen()
  })

  it('should not display Voir sur la carte button when current view is ThematicSearch and wipVenueMap feature flag deactivated', () => {
    render(
      <VenuePlaylist
        venuePlaylistTitle="Test Playlist"
        venues={mockedAlgoliaVenuesItems}
        currentView="SearchResults"
      />
    )

    expect(screen.queryByText('Voir sur la carte')).toBeNull()
  })

  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    })

    it('should display Voir sur la carte button when current view is ThematicSearch', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
        />
      )

      expect(screen.getByText('Voir sur la carte')).toBeOnTheScreen()
    })

    it('should display number of results when current view is not ThematicSearch', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="SearchResults"
        />
      )

      expect(screen.getByText('6 résultats')).toBeOnTheScreen()
    })

    it('should set venue types filter when search group associated to venue types when pressing Voir sur la carte button', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
          offerCategory={SearchGroupNameEnumv2.LIVRES}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockSetVenuesFilters).toHaveBeenNthCalledWith(1, [
        VenueTypeCodeKey.BOOKSTORE,
        VenueTypeCodeKey.DISTRIBUTION_STORE,
        VenueTypeCodeKey.LIBRARY,
      ])
    })

    it('should set venue types filter as empty array when search group not associated to venue types when pressing Voir sur la carte button', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
          offerCategory={SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockSetVenuesFilters).toHaveBeenNthCalledWith(1, [])
    })

    it('should set venue types filter as empty array when no search group specified when pressing Voir sur la carte button', async () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(mockSetVenuesFilters).toHaveBeenNthCalledWith(1, [])
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
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
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
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
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
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
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
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated={false}
        />
      )

      await user.press(screen.getByText('Voir sur la carte'))

      expect(analytics.logConsultVenueMap).not.toHaveBeenCalled()
    })
  })

  describe('Separator', () => {
    it('should display Separator when shouldDisplaySeparator is true', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated={false}
          shouldDisplaySeparator
        />
      )

      expect(screen.getByTestId('venue-playlist-separator')).toBeOnTheScreen()
    })

    it('should not display Separator when shouldDisplaySeparator is false', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockedAlgoliaVenuesItems}
          currentView="ThematicSearch"
          offerCategory={SearchGroupNameEnumv2.CINEMA}
          isLocated={false}
          shouldDisplaySeparator={false}
        />
      )

      expect(screen.queryByTestId('venue-playlist-separator')).not.toBeOnTheScreen()
    })
  })
})
