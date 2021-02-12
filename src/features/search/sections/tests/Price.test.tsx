import { render } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { initialSearchState } from 'features/search/pages/reducer'

import { Price } from '../Price'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('Price component', () => {
  it('should render initial price range correctly', () => {
    expect(render(<Price />).queryByText('0 € - 300 €')).toBeTruthy()
    mockSearchState = { ...initialSearchState, priceRange: [20, 200] }
    expect(render(<Price />).queryByText('20 € - 200 €')).toBeTruthy()
  })
  it('should dispatch PRICE_RANGE onPress', () => {
    const { getByTestId } = render(<Price />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance
    slider.props.onValuesChangeFinish([20, 30])
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [20, 30] })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = initialSearchState
    expect(render(<Price />).queryByText('Prix')).toBeTruthy()
    expect(render(<Price />).queryByText('Prix\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, priceRange: [0, 200] }
    expect(render(<Price />).queryByText('Prix\xa0(1)')).toBeTruthy()
    mockSearchState = { ...initialSearchState, priceRange: [20, 200] }
    expect(render(<Price />).queryByText('Prix\xa0(1)')).toBeTruthy()
  })
})
