import React from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { fireEvent, render } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

describe('CategoriesButtons', () => {
  it('should display categories', () => {
    const { queryAllByRole } = render(<CategoriesButtons onPressCategory={jest.fn()} />)

    expect(queryAllByRole('button').length).toEqual(15)
  })

  it('should call given callBack on press', () => {
    const mockOnPressCategory = jest.fn()
    const { getByText } = render(<CategoriesButtons onPressCategory={mockOnPressCategory} />)

    const categoryButton = getByText('Spectacles')
    fireEvent.press(categoryButton)

    expect(mockOnPressCategory).toHaveBeenCalledWith(SearchGroupNameEnumv2.SPECTACLES)
  })
})
