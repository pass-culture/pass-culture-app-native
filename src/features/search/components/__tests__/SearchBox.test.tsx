import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { SearchBox } from '../SearchBox'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))
jest.mock('libs/analytics')

describe('SearchBox component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should call logSearchQuery on submit', () => {
    const { getByPlaceholderText } = render(<SearchBox />)
    const searchInput = getByPlaceholderText('Titre, artiste, lieu...')
    fireEvent(searchInput, 'onSubmitEditing', { nativeEvent: { text: 'jazzaza' } })
    expect(analytics.logSearchQuery).toBeCalledWith('jazzaza')
    expect(mockDispatch).toBeCalledWith({ type: 'SHOW_RESULTS', payload: true })
    expect(navigate).toBeCalledWith(
      ...getTabNavConfig('Search', {
        query: 'jazzaza',
        showResults: true,
      })
    )
  })
})
