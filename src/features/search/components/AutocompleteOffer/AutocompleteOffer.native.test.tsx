import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { initialSearchState } from 'features/search/context/reducer'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

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

describe('AutocompleteOffer component', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

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
