import React from 'react'
import { Keyboard } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { initialSearchState } from 'features/search/context/reducer'
import { HistoryItem, SearchView } from 'features/search/types'
import { placeholderData as mockSubcategoriesData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockSubcategoriesData,
  }),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const defaultItem: HistoryItem = {
  createdAt: new Date('2023-09-25T09:01:00.000Z').getTime(),
  query: 'manga',
  label: 'manga',
}

const searchId = uuidv4()

describe('SearchHistoryItem', () => {
  it('should not display "dans" a category or a native category when item has not it', () => {
    render(<SearchHistoryItem item={defaultItem} />)

    expect(screen.queryByText('dans')).not.toBeOnTheScreen()
  })

  it('should display "dans" a category when item has it and not has a native category', () => {
    const mockItem = { ...defaultItem, category: SearchGroupNameEnumv2.LIVRES }
    render(<SearchHistoryItem item={mockItem} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres')).toBeOnTheScreen()
  })

  it('should display "dans" a native category when item has it and not has a category', () => {
    const mockItem = { ...defaultItem, nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER }
    render(<SearchHistoryItem item={mockItem} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should display "dans" a native category when item has it and has a category too', () => {
    const mockItem = {
      ...defaultItem,
      category: SearchGroupNameEnumv2.LIVRES,
      nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
    }
    render(<SearchHistoryItem item={mockItem} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should dismiss the keyboard when pressing item', () => {
    const keyboardDismissSpy = jest.spyOn(Keyboard, 'dismiss')
    render(<SearchHistoryItem item={defaultItem} />)

    fireEvent.press(screen.getByText('manga'))

    expect(keyboardDismissSpy).toHaveBeenCalledTimes(1)
  })

  describe('should navigate and execute the search with the item', () => {
    it('When it has not category and native category', () => {
      render(<SearchHistoryItem item={defaultItem} />)

      fireEvent.press(screen.getByText('manga'))

      expect(navigate).toHaveBeenNthCalledWith(
        1,
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: defaultItem.query,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerGenreTypes: undefined,
          offerNativeCategories: undefined,
          offerCategories: [],
        })
      )
    })

    it('When it has category and native category', () => {
      const mockItem = {
        ...defaultItem,
        category: SearchGroupNameEnumv2.LIVRES,
        nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
      }
      render(<SearchHistoryItem item={mockItem} />)

      fireEvent.press(screen.getByText('manga'))

      expect(navigate).toHaveBeenNthCalledWith(
        1,
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: defaultItem.query,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerGenreTypes: undefined,
          offerNativeCategories: [mockItem.nativeCategory],
          offerCategories: [mockItem.category],
        })
      )
    })

    it('When it has only a category', () => {
      const mockItem = {
        ...defaultItem,
        category: SearchGroupNameEnumv2.LIVRES,
      }
      render(<SearchHistoryItem item={mockItem} />)

      fireEvent.press(screen.getByText('manga'))

      expect(navigate).toHaveBeenNthCalledWith(
        1,
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: defaultItem.query,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerGenreTypes: undefined,
          offerNativeCategories: undefined,
          offerCategories: [mockItem.category],
        })
      )
    })

    it('When it has only a native category', () => {
      const mockItem = {
        ...defaultItem,
        nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
      }
      render(<SearchHistoryItem item={mockItem} />)

      fireEvent.press(screen.getByText('manga'))

      expect(navigate).toHaveBeenNthCalledWith(
        1,
        ...getTabNavConfig('Search', {
          ...mockSearchState,
          query: defaultItem.query,
          view: SearchView.Results,
          searchId,
          isAutocomplete: true,
          offerGenreTypes: undefined,
          offerNativeCategories: [mockItem.nativeCategory],
          offerCategories: [],
        })
      )
    })
  })
})
