import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { NoSearchResult } from './NoSearchResult'

const searchId = uuidv4()

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

  it('should log NoSearchResult with the query', () => {
    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Landing, query: '', searchId },
    })

    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).not.toHaveBeenLastCalledWith('')

    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Landing, query: 'no result query', searchId },
    })
    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('no result query', searchId)
    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
  })
})
