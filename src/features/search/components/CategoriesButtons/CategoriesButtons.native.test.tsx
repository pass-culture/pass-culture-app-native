import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

const mockData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('CategoriesButtons', () => {
  it('should display categories', () => {
    render(<CategoriesButtons onPressCategory={jest.fn()} />)

    expect(screen.queryAllByRole('button').length).toEqual(14)
  })

  it('should call given callBack on press', () => {
    const mockOnPressCategory = jest.fn()
    render(<CategoriesButtons onPressCategory={mockOnPressCategory} />)

    const categoryButton = screen.getByText('Spectacles')
    fireEvent.press(categoryButton)

    expect(mockOnPressCategory).toHaveBeenCalledWith(SearchGroupNameEnumv2.SPECTACLES)
  })
})
