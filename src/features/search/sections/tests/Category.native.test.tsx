import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'
import { Category } from 'features/search/sections/Category'
import { fireEvent, render } from 'tests/utils'

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

  it('should redirect to the categories filter page when clicking on the category button', async () => {
    const { getByTestId } = render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const categoryButton = getByTestId('FilterRow')

    await fireEvent.press(categoryButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchCategories')
  })
})
