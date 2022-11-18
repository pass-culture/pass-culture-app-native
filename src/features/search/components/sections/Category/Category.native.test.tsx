import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { fireEvent, render } from 'tests/utils'

import { Category } from './Category'

let mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('features/profile/api')

describe('Category component', () => {
  it('should render correctly', () => {
    expect(render(<Category />)).toMatchSnapshot()
  })

  it('should display the category when selected', () => {
    mockSearchState = { ...initialSearchState, offerCategories: [SearchGroupNameEnumv2.LIVRES] }
    const { getByText } = render(<Category />)

    expect(getByText('Livres')).toBeTruthy()
  })

  it('should open the categories filter modal when clicking on the category button', async () => {
    const { getByTestId } = render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const categoryButton = getByTestId('FilterRow')

    await fireEvent.press(categoryButton)

    const fullscreenModalScrollView = getByTestId('fullscreenModalScrollView')

    expect(fullscreenModalScrollView).toBeTruthy()
  })
})
