import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { NoSearchResult } from '../NoSearchResult'

const mockSearchState = initialSearchState
const mockDispatchStagedSearch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatchStagedSearch,
  }),
}))

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

  it('should update the staged search state with the actual search state when pressing "Modifier mes filtres" button', async () => {
    const { getByText } = render(<NoSearchResult />)
    const button = getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(mockDispatchStagedSearch).toHaveBeenCalledWith({
      type: 'SET_STATE_FROM_DEFAULT',
      payload: mockSearchState,
    })
  })

  it('should redirect to the general filters page when pressing "Modifier mes filtres" button', async () => {
    const { getByText } = render(<NoSearchResult />)
    const button = getByText('Modifier mes filtres')

    await fireEvent.press(button)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SearchFilter')
  })

  it('should log NoSearchResult with the query', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing, query: '' } })

    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).not.toHaveBeenLastCalledWith('')

    useRoute.mockReturnValueOnce({
      params: { view: SearchView.Landing, query: 'no result query' },
    })
    render(<NoSearchResult />)
    expect(analytics.logNoSearchResult).toHaveBeenLastCalledWith('no result query')
    expect(analytics.logNoSearchResult).toHaveBeenCalledTimes(1)
  })
})
