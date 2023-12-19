import React from 'react'

import { LocationFilter } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { render, screen } from 'tests/utils'

import { NumberOfResults } from './NumberOfResults'

jest.mock('react-query')

const mockLocationFilter: LocationFilter = { locationType: LocationMode.EVERYWHERE }

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { locationFilter: mockLocationFilter } }),
}))

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit - without venue', () => {
    const { toJSON } = render(<NumberOfResults nbHits={0} />)

    expect(toJSON()).not.toBeOnTheScreen()
  })

  it('should correctly format the number of hit when single', () => {
    render(<NumberOfResults nbHits={1} />)

    expect(screen.getByText('1 résultat')).toBeOnTheScreen()
  })

  it('should correctly format the number of hit when plural', () => {
    render(<NumberOfResults nbHits={2} />)

    expect(screen.getByText('2 résultats')).toBeOnTheScreen()
  })

  it('should correctly format the number of hit when more than 1 000', () => {
    render(<NumberOfResults nbHits={1234} />)

    expect(screen.getByText('1 234 résultats')).toBeOnTheScreen()
  })
})
