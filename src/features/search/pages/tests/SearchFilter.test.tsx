import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))
describe('SearchFilter component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SearchFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
})
