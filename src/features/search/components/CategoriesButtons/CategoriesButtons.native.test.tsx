import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

const mockData = placeholderData
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('CategoriesButtons', () => {
  it('should display categories', async () => {
    render(<CategoriesButtons />)

    await waitFor(async () => {
      expect(screen.queryAllByRole('button')).toHaveLength(14)
    })
  })

  it('should update searchContext on press', async () => {
    render(<CategoriesButtons />)

    const categoryButton = screen.getByText('Spectacles')
    fireEvent.press(categoryButton)

    await waitFor(async () => {
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          ...mockSearchState,
          offerSubcategories: [],
          offerNativeCategories: undefined,
          offerGenreTypes: undefined,
          searchId: 'testUuidV4',
          isFullyDigitalOffersCategory: undefined,
          isFromHistory: undefined,
          view: SearchView.Results,
          offerCategories: ['SPECTACLES'],
        },
        type: 'SET_STATE',
      })
    })
  })
})
