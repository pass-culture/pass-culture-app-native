import mockdate from 'mockdate'
import React from 'react'

import { SearchHistory } from 'features/search/components/SearchHistory/SearchHistory'
import { mockedSearchHistory } from 'features/search/fixtures/mockedSearchHistory'
import { fireEvent, render, screen } from 'tests/utils'

const TODAY_DATE = new Date('2023-09-26T00:00:00.000Z')

const mockRemoveItem = jest.fn()

jest.mock('react-query')

describe('SearchHistory', () => {
  beforeEach(() => {
    mockdate.set(TODAY_DATE)
  })

  it('should not display history when history is empty', () => {
    render(<SearchHistory history={[]} queryHistory="" removeItem={mockRemoveItem} />)

    expect(screen.queryByText('Historique de recherches')).not.toBeOnTheScreen()
  })

  it('should display 20 items maximum in the history when queryHistory is an empty string', () => {
    render(
      <SearchHistory history={mockedSearchHistory} queryHistory="" removeItem={mockRemoveItem} />
    )

    expect(screen.getAllByTestId('searchHistoryItem').length).toEqual(20)
  })

  it('should display 3 items maximum in the history when queryHistory is not an empty string', () => {
    render(
      <SearchHistory history={mockedSearchHistory} queryHistory="a" removeItem={mockRemoveItem} />
    )

    expect(screen.getAllByTestId('searchHistoryItem').length).toEqual(3)
  })

  it('should display delete button in history item when queryHistory is an empty string', () => {
    render(
      <SearchHistory history={mockedSearchHistory} queryHistory="" removeItem={mockRemoveItem} />
    )

    expect(screen.getAllByTestId('Supprimer la ligne de l’historique').length).toEqual(20)
  })

  it('should execute remove history item when pressing delete button', () => {
    render(
      <SearchHistory history={mockedSearchHistory} queryHistory="" removeItem={mockRemoveItem} />
    )

    fireEvent.press(screen.getAllByTestId('Supprimer la ligne de l’historique')[0])

    expect(mockRemoveItem).toHaveBeenNthCalledWith(1, mockedSearchHistory[0])
  })

  it('should not display delete button in history item when queryHistory is not an empty string', () => {
    render(
      <SearchHistory history={mockedSearchHistory} queryHistory="a" removeItem={mockRemoveItem} />
    )

    expect(screen.queryAllByTestId('Supprimer la ligne de l’historique').length).toEqual(0)
  })
})
