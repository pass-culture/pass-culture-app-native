import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { VenuePlaylist } from 'features/search/components/VenuePlaylist/VenuePlaylist'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils/web'

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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<VenuePlaylist />', () => {
  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation()
      useFeatureFlagSpy.mockReturnValueOnce(true)
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
