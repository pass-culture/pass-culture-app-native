import React from 'react'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { Hit } from 'features/search/pages/Search'
import { render } from 'tests/utils'

jest.mock('react-instantsearch-hooks', () => ({
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        offer: { name: 'Test1', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
      {
        objectID: '2',
        offer: { name: 'Test2', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
    ],
  }),
}))

describe('SearchAutocomplete component', () => {
  it('should render SearchAutocomplete', () => {
    expect(render(<SearchAutocomplete hitComponent={Hit} />)).toMatchSnapshot()
  })
})
