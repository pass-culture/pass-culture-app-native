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
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

  it('should be connected to section FreeOffer - FreeOffer is activated when priceRange is [Ø, 0]', () => {
    mockSearchState.offerIsFree = false
    const { getByTestId } = render(<Price />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance

    // 1. Move it to [0, 30]: we should not toggle offerIsFree
    let dispatchCalledTimes = 1
    slider.props.onValuesChangeFinish([0, 30])
    expect(mockStagedDispatch).toHaveBeenCalledTimes(dispatchCalledTimes)
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [0, 30] })

    // 2. Move it to [0, 0]: we should toggle offerIsFree
    slider.props.onValuesChangeFinish([0, 0])
    dispatchCalledTimes += 2
    expect(mockStagedDispatch).toHaveBeenCalledTimes(dispatchCalledTimes)
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_FREE' })
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [0, 0] })
  })

  it('should be connected to section FreeOffer - FreeOffer is deactivated when priceRange is not [Ø, 0]', () => {
    mockSearchState.offerIsFree = true
    const { getByTestId } = render(<Price />)
    const slider = getByTestId('slider').children[0] as ReactTestInstance

    // 1. Move it to [0, 0]: we should not toggle offerIsFree, because it is already true
    slider.props.onValuesChangeFinish([0, 0])
    let dispatchCalledTimes = 1
    expect(mockStagedDispatch).toHaveBeenCalledTimes(dispatchCalledTimes)
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [0, 0] })

    // 2. Move it back to [0, 300]: we should toggle offerIsFree
    slider.props.onValuesChangeFinish([0, 300])
    dispatchCalledTimes += 2
    expect(mockStagedDispatch).toHaveBeenCalledTimes(dispatchCalledTimes)
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_FREE' })
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [0, 300] })
  })
})
