import React from 'react'

import { SearchGroupNameEnum } from 'api/gen'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

describe('CategoriesButtons', () => {
  it('should display categories', () => {
    const { queryAllByRole } = render(<CategoriesButtons onCategoryPress={jest.fn()} />)

    expect(queryAllByRole('button').length).toEqual(13)
  })

  it('should call given callBack on press', () => {
    const mockOnCategoryPress = jest.fn()
    const { getByText } = render(<CategoriesButtons onCategoryPress={mockOnCategoryPress} />)

    const categoryButton = getByText('Spectacles')
    fireEvent.press(categoryButton)

    expect(mockOnCategoryPress).toHaveBeenCalledWith(SearchGroupNameEnum.SPECTACLE)
  })

  it('should log event on press', () => {
    const { getByText } = render(<CategoriesButtons onCategoryPress={jest.fn()} />)

    const categoryButton = getByText('Spectacles')
    fireEvent.press(categoryButton)

    expect(analytics.logUseLandingCategory).toHaveBeenCalledWith(SearchGroupNameEnum.SPECTACLE)
  })
})
