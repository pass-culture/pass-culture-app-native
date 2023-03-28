import React from 'react'

import { LocationType } from 'features/search/enums'
import { LocationFilter } from 'features/search/types'
import { Position } from 'libs/geolocation'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { render } from 'tests/utils'

import { NumberOfResults } from './NumberOfResults'

jest.mock('react-query')

const mockPosition: Position = null
jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ position: mockPosition })),
}))

let mockLocationFilter: LocationFilter = {
  locationType: LocationType.VENUE,
  venue: mockedSuggestedVenues[0],
}

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: { locationFilter: mockLocationFilter } }),
}))

describe('NumberOfResults component', () => {
  it('should correctly format the number of hit - without venue', () => {
    mockLocationFilter = { locationType: LocationType.EVERYWHERE }
    expect(render(<NumberOfResults nbHits={0} />).toJSON()).toBeNull()
    render(<NumberOfResults nbHits={1} />).getByText('1 résultat')
    render(<NumberOfResults nbHits={2} />).getByText('2 résultats')
    render(<NumberOfResults nbHits={1234} />).getByText('1 234 résultats')
  })
})
