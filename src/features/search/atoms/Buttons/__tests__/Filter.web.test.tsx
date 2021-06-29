import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils/web'

import { Filter } from '../Filter'

describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(<Filter />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to Filter page on pressing', () => {
    const { getByTestId } = render(<Filter />)
    fireEvent.click(getByTestId('FilterButton'))
    expect(navigate).toHaveBeenCalledWith('SearchFilter')
  })
})
