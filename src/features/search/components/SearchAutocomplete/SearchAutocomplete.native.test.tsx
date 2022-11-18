import React from 'react'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete/SearchAutocomplete'
import { Hit } from 'features/search/pages/Search/Search'
import { render } from 'tests/utils'

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        query: 'cinéma',
        _highlightResult: {
          query: {
            value: '<mark>cinéma</mark>',
            matchLevel: 'full',
            fullyHighlighted: true,
            matchedWords: ['cinéma'],
          },
        },
      },
      {
        objectID: '2',
        query: 'cinéma itinérant',
        _highlightResult: {
          query: {
            value: '<mark>cinéma</mark> itinérant',
            matchLevel: 'full',
            fullyHighlighted: false,
            matchedWords: ['cinéma'],
          },
        },
      },
    ],
  }),
}))

describe('SearchAutocomplete component', () => {
  it('should render SearchAutocomplete', () => {
    expect(render(<SearchAutocomplete hitComponent={Hit} />)).toMatchSnapshot()
  })
})
