import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'

import { Filter } from '../Filter'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))
describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<Filter />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to Filter page on pressing', () => {
    const { getByTestId } = render(<Filter />)
    fireEvent.press(getByTestId('FilterButton'))
    expect(navigate).toHaveBeenCalledWith('SearchFilter')
  })
})
