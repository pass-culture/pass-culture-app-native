import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { render, screen } from 'tests/utils/web'

const searchId = uuidv4()
const mockUseSearch = jest.fn(() => ({
  searchState: { ...initialSearchState, searchId },
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<VenuePlaylist />', () => {
  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation()
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    })

    it('should not display Voir sur la carte button when current view is ThematicSearch', () => {
      render(
        <VenuePlaylist
          venuePlaylistTitle="Test Playlist"
          venues={mockAlgoliaVenues}
          currentView="ThematicSearch"
        />
      )

      expect(screen.queryByText('Voir sur la carte')).toBeNull()
    })
  })
})
