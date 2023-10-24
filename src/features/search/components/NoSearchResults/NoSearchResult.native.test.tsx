import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchView } from 'features/search/types'
import { fireEvent, render, screen } from 'tests/utils'

import { NoSearchResult } from './NoSearchResult'

describe('NoSearchResult component', () => {
  it('should show the message without query entered', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: '' } })
    render(<NoSearchResult />)

    const text = screen.getByText('Pas de résultat')
    const textContinuation = screen.getByText(
      'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    )

    expect(text).toBeOnTheScreen()
    expect(textContinuation).toBeOnTheScreen()
  })

  it('should show the message with query entered', () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Landing, query: 'ZZZZZZ' },
    })
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

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', {})
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button with url params', async () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Landing, query: 'vinyle' },
    })
    render(<NoSearchResult />)
    const button = screen.getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', {
      view: SearchView.Landing,
      query: 'vinyle',
    })
  })
})
