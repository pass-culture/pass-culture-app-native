import mockdate from 'mockdate'
import React from 'react'

import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { fireEvent, render, screen } from 'tests/utils'

const TODAY_DATE = new Date('2023-09-26T00:00:00.000Z')

const mockRemoveItem = jest.fn()

const mockHistory = [mockedSearchHistory[0]]

describe('SearchHistory', () => {
  beforeEach(() => {
    mockdate.set(TODAY_DATE)
  })

  it('should not display history when history is empty', () => {
    render(
      <SearchHistory history={[]} queryHistory="" removeItem={mockRemoveItem} onPress={jest.fn()} />
    )

    expect(screen.queryByText('Historique de recherches')).not.toBeOnTheScreen()
  })

  it('should display delete button in history item when queryHistory is an empty string', () => {
    render(
      <SearchHistory
        history={mockHistory}
        queryHistory=""
        removeItem={mockRemoveItem}
        onPress={jest.fn()}
      />
    )

    expect(screen.getByTestId('Supprimer manga de l’historique')).toBeOnTheScreen()
  })

  it('should execute remove history item when pressing delete button', () => {
    render(
      <SearchHistory
        history={mockHistory}
        queryHistory=""
        removeItem={mockRemoveItem}
        onPress={jest.fn()}
      />
    )

    fireEvent.press(screen.getByTestId('Supprimer manga de l’historique'))

    expect(mockRemoveItem).toHaveBeenNthCalledWith(1, mockHistory[0])
  })

  it('should not display delete button in history item when queryHistory is not an empty string', () => {
    render(
      <SearchHistory
        history={mockHistory}
        queryHistory="man"
        removeItem={mockRemoveItem}
        onPress={jest.fn()}
      />
    )

    expect(screen.queryByTestId('Supprimer manga de l’historique')).not.toBeOnTheScreen()
  })

  it('should execute onPress when pressing history item', () => {
    const mockOnPress = jest.fn()

    render(
      <SearchHistory
        history={mockHistory}
        queryHistory=""
        removeItem={jest.fn()}
        onPress={mockOnPress}
      />
    )

    fireEvent.press(screen.getByText('manga'))

    expect(mockOnPress).toHaveBeenNthCalledWith(1, {
      ...mockHistory[0],
      _highlightResult: {
        query: {
          value: 'manga',
        },
      },
    })
  })
})
