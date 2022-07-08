import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

import { Filter } from '../Filter'

jest.mock('features/search/utils/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300),
}))

describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())
  const mockSearchState = initialSearchState
  mockSearchState.offerIsDuo = true

  it('should render correctly', () => {
    const renderAPI = render(<Filter />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to Filter page on pressing', async () => {
    const { getByTestId } = render(<Filter />)
    fireEvent.click(getByTestId('FilterButton'))
    await waitForExpect(() => {
      expect(navigate).toHaveBeenCalledWith('SearchFilter', undefined)
    })
  })
})
