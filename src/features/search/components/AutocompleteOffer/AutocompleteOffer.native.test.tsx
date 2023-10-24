import { Hit } from '@algolia/client-search'
import { BaseHit } from 'instantsearch.js'
import React from 'react'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { render, screen } from 'tests/utils'

let mockHits: Hit<BaseHit>[] = []
jest.mock('react-instantsearch-core', () => ({
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('AutocompleteOffer component', () => {
  describe('With suggestion hits', () => {
    beforeEach(() => {
      mockHits = mockSuggestionHits
    })

    it('should render AutocompleteOffer', () => {
      expect(render(<AutocompleteOffer addSearchHistory={jest.fn()} />)).toMatchSnapshot()
    })

    it('should display "Suggestions"', () => {
      render(<AutocompleteOffer addSearchHistory={jest.fn()} />)

      expect(screen.getByText('Suggestions')).toBeOnTheScreen()
    })
  })

  describe('Without suggestion hits', () => {
    beforeEach(() => {
      mockHits = []
    })

    it('should not display "Suggestions"', () => {
      render(<AutocompleteOffer addSearchHistory={jest.fn()} />)

      expect(screen.queryByText('Suggestions')).not.toBeOnTheScreen()
    })
  })
})
