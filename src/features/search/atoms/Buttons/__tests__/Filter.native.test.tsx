import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { Filter } from '../Filter'

jest.mock('features/search/utils/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300),
}))

describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())
  const mockSearchState = initialSearchState
  mockSearchState.offerIsDuo = true
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
