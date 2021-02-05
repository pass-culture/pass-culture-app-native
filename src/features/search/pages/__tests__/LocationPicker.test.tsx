import { render } from '@testing-library/react-native'
import React from 'react'

import { LocationPicker } from 'features/search/pages/LocationPicker'
import { initialSearchState } from 'features/search/pages/reducer'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('LocationPicker component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<LocationPicker />)
    expect(toJSON()).toMatchSnapshot()
  })
})
