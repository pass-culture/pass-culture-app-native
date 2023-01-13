import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { NoSearchResult } from './NoSearchResult'

const searchId = uuidv4()

describe('NoSearchResult component', () => {
  it('should show the message without query entered', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: '' } })
    const { getByText } = render(<NoSearchResult />)

    const text = getByText('Pas de résultat')
    const textContinuation = getByText(
      'Vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    )
    expect(text).toBeTruthy()
    expect(textContinuation).toBeTruthy()
  })

  it('should show the message with query entered', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: 'ZZZZZZ' } })
    const { getByText } = render(<NoSearchResult />)

    const text = getByText('Pas de résultat')
    const complement = getByText('pour "ZZZZZZ"')
    const textContinuation = getByText(
      'Essaye un autre mot-clé, vérifie ta localisation ou modifie tes filtres pour trouver plus de résultats.'
    )

    expect(text).toBeTruthy()
    expect(complement).toBeTruthy()
    expect(textContinuation).toBeTruthy()
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button', async () => {
    const { getByText } = render(<NoSearchResult />)
    const button = getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', {})
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button with route params', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: 'ZZZZZZ' } })
    const { getByText } = render(<NoSearchResult />)
    const button = getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter', {
      view: SearchView.Landing,
      query: 'ZZZZZZ',
    })
  })

  it('should log NoSearchResult with the query', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: '', searchId } })

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
