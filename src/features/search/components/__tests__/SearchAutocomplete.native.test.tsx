import React, { createRef } from 'react'
import { FlatList } from 'react-native'

import { SearchAutocomplete } from 'features/search/components/SearchAutocomplete'
import { Hit } from 'features/search/components/SearchDetails'
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
  const ref = createRef<FlatList>()
  const setShouldAutocomplete = jest.fn

  it('should render SearchAutocomplete', () => {
    expect(
      render(
        <SearchAutocomplete
          ref={ref}
          hitComponent={Hit}
          setShouldAutocomplete={setShouldAutocomplete}
        />
      )
    ).toMatchSnapshot()
  })
})
