import mockdate from 'mockdate'
import React from 'react'

import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { fireEvent, render, screen } from 'tests/utils'

const TODAY_DATE = new Date('2023-09-26T00:00:00.000Z')

const mockRemoveItem = jest.fn()

jest.mock('react-query')

const mockHistory = [mockedSearchHistory[0]]

describe('SearchHistory', () => {
  beforeEach(() => {
    mockdate.set(TODAY_DATE)
  })

  it('should not display history when history is empty', () => {
    render(<SearchHistory history={[]} queryHistory="" removeItem={mockRemoveItem} />)

    expect(screen.queryByText('Historique de recherches')).not.toBeOnTheScreen()
  })

  it('should display delete button in history item when queryHistory is an empty string', () => {
    render(<SearchHistory history={mockHistory} queryHistory="" removeItem={mockRemoveItem} />)

    expect(screen.getByTestId('Supprimer manga de l’historique')).toBeOnTheScreen()
  })

  it('should execute remove history item when pressing delete button', () => {
    render(<SearchHistory history={mockHistory} queryHistory="" removeItem={mockRemoveItem} />)

    fireEvent.press(screen.getByTestId('Supprimer manga de l’historique'))

    expect(mockRemoveItem).toHaveBeenNthCalledWith(1, mockHistory[0])
  })

  it('should not display delete button in history item when queryHistory is not an empty string', () => {
    render(<SearchHistory history={mockHistory} queryHistory="a" removeItem={mockRemoveItem} />)

    expect(screen.queryByTestId('Supprimer manga de l’historique')).not.toBeOnTheScreen()
  })
})
