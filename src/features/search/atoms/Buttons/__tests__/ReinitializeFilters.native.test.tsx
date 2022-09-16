import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

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
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFilters />))
    fireEvent.press(getByText('Réinitialiser'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'INIT' })
    expect(analytics.logReinitializeFilters).toBeCalledTimes(1)
  })
})
