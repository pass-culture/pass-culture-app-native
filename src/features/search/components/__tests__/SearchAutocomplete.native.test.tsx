import React from 'react'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { Hit } from 'features/search/pages/Search'
import { render } from 'tests/utils'

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        query: 'cinéma',
      },
      {
        objectID: '2',
        query: 'terrain',
      },
    ],
  }),
}))

describe('SearchAutocomplete component', () => {
  it('should render SearchAutocomplete', () => {
    expect(render(<SearchAutocomplete hitComponent={Hit} />)).toMatchSnapshot()
  })
})
