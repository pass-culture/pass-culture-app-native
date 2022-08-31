import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { Category } from 'features/search/sections/Category'
import { fireEvent, render } from 'tests/utils/web'

const mockSearchState = initialSearchState

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

  it('should display categories list from a modal if desktop viewport', async () => {
    const { getByTestId, queryByTestId } = render(<Category />, {
      theme: { isDesktopViewport: true, isMobileViewport: false },
    })

    const categoryButton = getByTestId('FilterRow')

    await fireEvent.click(categoryButton)

    expect(queryByTestId('categoriesModal')).toBeTruthy()
  })

  it('should not display categories list from a modal if mobile viewport', async () => {
    const { getByTestId, queryByTestId } = render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })

    const categoryButton = getByTestId('FilterRow')

    await fireEvent.click(categoryButton)

    expect(queryByTestId('categoriesModal')).toBeFalsy()
  })

  it('should redirect to the filters page when clicking on the category button if mobile viewport', async () => {
    const { getByTestId } = render(<Category />, {
      theme: { isDesktopViewport: false, isMobileViewport: true },
    })
    const categoryButton = getByTestId('FilterRow')

    await fireEvent.click(categoryButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchCategories')
  })
})
