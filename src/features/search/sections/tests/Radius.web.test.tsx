import React from 'react'
// import { ReactTestInstance } from 'react-test-renderer'

import { initialSearchState } from 'features/search/pages/reducer'
import { render } from 'tests/utils/web'

import { Radius } from '../Radius'

const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('Radius component', () => {
  it('should render initial radius range correctly', () => {
    const { queryByText } = render(<Radius />)
    expect(queryByText('100 km')).toBeTruthy()
  })
})
