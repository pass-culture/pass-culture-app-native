import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete/SearchAutocomplete'
import { Hit } from 'features/search/pages/Search/Search'
import { env } from 'libs/environment'
import { render } from 'tests/utils'

const mockHits = [
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
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
        },
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
    [env.ALGOLIA_OFFERS_INDEX_NAME]: {
      exact_nb_hits: 2,
      facets: {
        analytics: {
          ['offer.searchGroupNamev2']: [
            {
              attribute: '',
              operator: '',
              value: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
              count: 10,
            },
          ],
        },
      },
    },
  },
]

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: mockHits,
  }),
}))

describe('SearchAutocomplete component', () => {
  it('should render SearchAutocomplete', () => {
    expect(render(<SearchAutocomplete hitComponent={Hit} />)).toMatchSnapshot()
  })
})
