import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { ReinitializeFilters } from '../ReinitializeFilters'

const mockSearchState = initialSearchState
const mockStateDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStateDispatch,
  }),
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('<ReinitializeFilters />', () => {
  it('should dispatch INIT when clicking on the reset button', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFilters />))
    fireEvent.press(getByText('Réinitialiser'))

    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'INIT' })
  })

  it('should update the state when clicking on the reset button', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFilters />))
    fireEvent.press(getByText('Réinitialiser'))

    expect(mockStateDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: {
        locationFilter: {
          locationType: 'EVERYWHERE',
        },
        offerCategories: [],
      },
    })
  })

  it('should log analytics when clicking on the reset button', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const { getByText } = render(reactQueryProviderHOC(<ReinitializeFilters />))
    fireEvent.press(getByText('Réinitialiser'))

    expect(analytics.logReinitializeFilters).toBeCalledTimes(1)
  })
})
