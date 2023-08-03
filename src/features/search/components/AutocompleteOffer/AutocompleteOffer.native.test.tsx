import React from 'react'

import { AutocompleteOffer } from 'features/search/components/AutocompleteOffer/AutocompleteOffer'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { render } from 'tests/utils'

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: mockSuggestionHits,
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('AutocompleteOffer component', () => {
  it('should render AutocompleteOffer', () => {
    expect(render(<AutocompleteOffer />)).toMatchSnapshot()
  })
})
