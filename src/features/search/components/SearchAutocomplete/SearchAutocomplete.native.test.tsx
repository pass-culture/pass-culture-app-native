import React from 'react'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete/SearchAutocomplete'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { Hit } from 'features/search/pages/Search/Search'
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

describe('SearchAutocomplete component', () => {
  it('should render SearchAutocomplete', () => {
    expect(render(<SearchAutocomplete hitComponent={Hit} />)).toMatchSnapshot()
  })
})
