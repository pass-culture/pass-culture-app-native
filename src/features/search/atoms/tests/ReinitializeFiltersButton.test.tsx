import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { ReinitializeFiltersButton } from '../ReinitializeFiltersButton'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))
describe('<ReinitializeFiltersButton />', () => {
  it('should dispatch INIT when clicking on Réinitialiser', () => {
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFiltersButton />))
    fireEvent.press(getByText('Réinitialiser'))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INIT' })
  })
})
