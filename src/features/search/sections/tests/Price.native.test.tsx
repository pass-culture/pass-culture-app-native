import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import { mocked } from 'ts-jest/utils'

import { initialSearchState } from 'features/search/pages/reducer'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { render } from 'tests/utils'

import { Price } from '../Price'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

jest.mock('features/search/utils/useMaxPrice')
const mockedUseMaxPrice = mocked(useMaxPrice)

describe('Price component', () => {
  beforeEach(() => {
    mockedUseMaxPrice.mockImplementation(() => 300)
  })
  it('should render initial price range correctly', () => {
    expect(render(<Price />).queryByText('0\u00a0€ - 300\u00a0€')).toBeTruthy()
    mockSearchState = { ...initialSearchState, priceRange: [20, 200] }
    expect(render(<Price />).queryByText('20\u00a0€ - 200\u00a0€')).toBeTruthy()
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

describe('Price component for underage', () => {
  const maxPrice = 50
  beforeEach(() => {
    mockSearchState = initialSearchState
    mockedUseMaxPrice.mockImplementation(() => maxPrice)
    // priceRange is initialized in the searchWrapper
    mockSearchState.priceRange = [0, maxPrice]
  })

  it('should render initial price correctly', () => {
    expect(render(<Price />).queryByText(`0\u00a0€ - ${maxPrice}\u00a0€`)).toBeTruthy()
  })

  it('should render the price correctly when the max price is changed', () => {
    mockSearchState = { ...initialSearchState, priceRange: [0, 49] }
    expect(render(<Price />).queryByText(`0\u00a0€ - 49\u00a0€`)).toBeTruthy()
  })

  it('should NOT have the indicator when the price range is untouched', () => {
    expect(render(<Price />).queryByText('Prix')).toBeTruthy()
  })

  it('should have the indicator when the price range is changed', () => {
    mockSearchState = { ...initialSearchState, priceRange: [0, 20] }
    expect(render(<Price />).queryByText('Prix\xa0(1)')).toBeTruthy()
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

    // 2. Move it back to [0, maxPrice]: we should toggle offerIsFree
    slider.props.onValuesChangeFinish([0, maxPrice])
    dispatchCalledTimes += 2
    expect(mockStagedDispatch).toHaveBeenCalledTimes(dispatchCalledTimes)
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_OFFER_FREE' })
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'PRICE_RANGE', payload: [0, maxPrice] })
  })
})
