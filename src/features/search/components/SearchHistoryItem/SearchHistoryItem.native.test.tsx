import React from 'react'

import { NativeCategoryIdEnumv2, SearchGroupNameEnumv2 } from 'api/gen'
import { SearchHistoryItem } from 'features/search/components/SearchHistoryItem/SearchHistoryItem'
import { Highlighted, HistoryItem } from 'features/search/types'
import { fireEvent, render, screen } from 'tests/utils'

const defaultItem: Highlighted<HistoryItem> = {
  createdAt: new Date('2023-09-25T09:01:00.000Z').getTime(),
  query: 'manga',
  label: 'manga',
  _highlightResult: { query: { value: 'manga' } },
}

describe('SearchHistoryItem', () => {
  it('should not display "dans" a category or a native category when item has not it', () => {
    render(<SearchHistoryItem item={defaultItem} queryHistory="" onPress={jest.fn()} />)

    expect(screen.queryByText('dans')).not.toBeOnTheScreen()
  })

  it('should display "dans" a category when item has it and not has a native category', () => {
    const mockItem = {
      ...defaultItem,
      category: SearchGroupNameEnumv2.LIVRES,
      categoryLabel: 'Livres',
    }
    render(<SearchHistoryItem item={mockItem} queryHistory="" onPress={jest.fn()} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres')).toBeOnTheScreen()
  })

  it('should display "dans" a native category when item has it and not has a category', () => {
    const mockItem = {
      ...defaultItem,
      nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
      nativeCategoryLabel: 'Livres papier',
    }
    render(<SearchHistoryItem item={mockItem} queryHistory="" onPress={jest.fn()} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should display "dans" a native category when item has it and has a category too', () => {
    const mockItem = {
      ...defaultItem,
      category: SearchGroupNameEnumv2.LIVRES,
      categoryLabel: 'Livres',
      nativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER,
      nativeCategoryLabel: 'Livres papier',
    }
    render(<SearchHistoryItem item={mockItem} queryHistory="" onPress={jest.fn()} />)

    expect(screen.getByText('dans')).toBeOnTheScreen()
    expect(screen.getByText('Livres papier')).toBeOnTheScreen()
  })

  it('should execute onPress when pressing item', () => {
    const mockOnPress = jest.fn()

    render(<SearchHistoryItem item={defaultItem} queryHistory="" onPress={mockOnPress} />)

    fireEvent.press(screen.getByText('manga'))

    expect(mockOnPress).toHaveBeenNthCalledWith(1, defaultItem)
  })

  it('should not use highlighting when query history is an empty string', () => {
    render(<SearchHistoryItem item={defaultItem} queryHistory="" onPress={jest.fn()} />)

    expect(screen.getByTestId('withoutUsingHighlight')).toBeOnTheScreen()
    expect(screen.queryByTestId('highlightedHistoryItemText')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('nonHighlightedHistoryItemText')).not.toBeOnTheScreen()
  })

  it('should use highlighting when query history is not an empty string', () => {
    const item = { ...defaultItem, _highlightResult: { query: { value: '<mark>man</mark>ga' } } }
    render(<SearchHistoryItem item={item} queryHistory="man" onPress={jest.fn()} />)

    expect(screen.getByTestId('highlightedHistoryItemText')).toBeOnTheScreen()
    expect(screen.getByTestId('nonHighlightedHistoryItemText')).toBeOnTheScreen()
    expect(screen.queryByTestId('withoutUsingHighlight')).not.toBeOnTheScreen()
  })
})
