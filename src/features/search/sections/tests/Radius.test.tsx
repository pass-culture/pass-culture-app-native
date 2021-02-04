import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { Radius } from '../Radius'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('Radius component', () => {
  it('should render initial radius range correctly', () => {
    const { queryByText } = render(<Radius />)
    expect(queryByText('100 km')).toBeTruthy()
  })
})
