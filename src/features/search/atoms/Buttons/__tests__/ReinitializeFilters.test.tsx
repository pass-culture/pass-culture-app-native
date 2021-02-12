import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { ReinitializeFilters } from '../ReinitializeFilters'

const mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('<ReinitializeFilters />', () => {
  it('should dispatch INIT when clicking on Réinitialiser', () => {
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFilters />))
    fireEvent.press(getByText('Réinitialiser'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'INIT' })
    expect(analytics.logReinitializeFilters).toBeCalledTimes(1)
  })
})
