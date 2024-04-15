import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import { fireEvent, render, screen } from 'tests/utils'

import { NoSearchResult } from './NoSearchResult'

let mockSearchState: SearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
}))

describe('NoSearchResult component', () => {
  afterEach(() => {
    mockSearchState = initialSearchState
  })

  it('should show the message without query entered', () => {
    render(<NoSearchResult />)

    const text = screen.getByText('Pas de résultat')
    const textContinuation = screen.getByText(
      'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    )

    expect(text).toBeOnTheScreen()
    expect(textContinuation).toBeOnTheScreen()
  })

  it('should show the message with query entered', () => {
    mockSearchState = { ...initialSearchState, query: 'ZZZZZZ' }
    render(<NoSearchResult />)

    const text = screen.getByText('Pas de résultat')
    const complement = screen.getByText('pour "ZZZZZZ"')
    const textContinuation = screen.getByText(
      'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    )

    expect(text).toBeOnTheScreen()
    expect(complement).toBeOnTheScreen()
    expect(textContinuation).toBeOnTheScreen()
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button', async () => {
    render(<NoSearchResult />)
    const button = screen.getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', mockSearchState)
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button with url params', async () => {
    mockSearchState = { ...initialSearchState, query: 'vinyle' }
    render(<NoSearchResult />)
    const button = screen.getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', mockSearchState)
  })
})
