import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { LocationFilter } from '../LocationFilter'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))
describe('LocationFilter component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<LocationFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
})
