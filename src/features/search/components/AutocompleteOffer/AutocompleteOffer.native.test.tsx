import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { initialSearchState } from 'features/search/context/reducer'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

let mockHits: Hit<BaseHit>[] = []
jest.mock('react-instantsearch-core', () => ({
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))

jest.mock('libs/subcategories/useSubcategories')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
    hideSuggestions: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('AutocompleteOffer component', () => {
  describe('With suggestion hits', () => {
    beforeEach(() => {
      mockHits = mockSuggestionHits
    })

    it('should display "Suggestions"', async () => {
      render(<AutocompleteOffer addSearchHistory={jest.fn()} />, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await act(() => {})

      expect(screen.getByText('Suggestions')).toBeOnTheScreen()
    })
  })

  describe('Without suggestion hits', () => {
    beforeEach(() => {
      mockHits = []
    })

    it('should not display "Suggestions"', () => {
      render(<AutocompleteOffer addSearchHistory={jest.fn()} />, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      expect(screen.queryByText('Suggestions')).not.toBeOnTheScreen()
    })
  })
})
