import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { Price } from 'features/search/sections/Price'
import { fireEvent, render } from 'tests/utils'

let mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/profile/api')

describe('Price component', () => {
  it('should render correctly', () => {
    expect(render(<Price />)).toMatchSnapshot()
  })

  it('should display the search price description when minimum price selected', () => {
    mockSearchState = { ...initialSearchState, minPrice: '5' }
    const { getByText } = render(<Price />)

    expect(getByText('5\u00a0€ et plus')).toBeTruthy()
  })

  it('should display the search price description when maximum price selected', () => {
    mockSearchState = { ...initialSearchState, maxPrice: '10' }
    const { getByText } = render(<Price />)

    expect(getByText('10\u00a0€ et moins')).toBeTruthy()
  })

  it('should display the search price description when minimum and maximum prices selected', () => {
    mockSearchState = { ...initialSearchState, minPrice: '5', maxPrice: '10' }
    const { getByText } = render(<Price />)

    expect(getByText('de 5\u00a0€ à 10\u00a0€')).toBeTruthy()
  })

  it('should display the search price description with "Gratuit" when minimum and maximum prices selected and are 0', () => {
    mockSearchState = { ...initialSearchState, minPrice: '0', maxPrice: '0' }
    const { getByText } = render(<Price />)

    expect(getByText('Gratuit')).toBeTruthy()
  })

  it('should open the categories filter modal when clicking on the category button', () => {
    const { getByTestId } = render(<Price />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const searchPriceButton = getByTestId('FilterRow')

    fireEvent.press(searchPriceButton)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })
})
