import React from 'react'

import { AutocompleteVenue } from 'features/search/components/AutocompleteVenue/AutocompleteVenue'
import { mockVenueHits } from 'features/search/fixtures/algolia'
import { render } from 'tests/utils'

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: mockVenueHits,
  }),
}))

describe('AutocompleteVenue component', () => {
  it('should render AutocompleteVenue', () => {
    expect(render(<AutocompleteVenue />)).toMatchSnapshot()
  })
})
