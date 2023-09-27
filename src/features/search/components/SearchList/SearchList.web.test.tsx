import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { render, screen } from 'tests/utils/web'

jest.mock('react-query')

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

describe('<SearchList />', () => {
  const renderItem = jest.fn()

  const props: SearchListProps = {
    nbHits: mockNbHits,
    hits: { offers: mockHits, venues: [] },
    renderItem,
    autoScrollEnabled: true,
    refreshing: false,
    onRefresh: jest.fn(),
    isFetchingNextPage: false,
    onEndReached: jest.fn(),
    onScroll: jest.fn(),
    userData: [],
    venuesUserData: [],
  }

  it('should display search list header when number of offer results > 0', async () => {
    render(<SearchList {...props} />)

    expect(screen.getByTestId('searchListHeader')).toBeInTheDocument()
  })

  it('should not display search list header when number of offer results = 0 ', async () => {
    const propsWithoutHits = { ...props, nbHits: 0, hits: { offers: [], venues: [] } }
    render(<SearchList {...propsWithoutHits} />)

    expect(screen.queryByTestId('searchListHeader')).not.toBeInTheDocument()
  })
})
