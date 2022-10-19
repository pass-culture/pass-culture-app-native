import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, act } from 'tests/utils'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

const mockStagedSearchState = initialSearchState
const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockStagedSearchState,
    dispatch: jest.fn(),
  }),
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('SearchFilter component', () => {
  it('should render correctly', async () => {
    mockStagedSearchState.locationFilter = {
      locationType: LocationType.AROUND_ME,
      aroundRadius: 100,
    }
    const { toJSON } = renderSearchFilter()
    await act(async () => {
      expect(toJSON()).toMatchSnapshot()
    })
  })

  it('should navigate on search results with the current search state when pressing go back', async () => {
    const { getByTestId } = renderSearchFilter()

    await act(async () => {
      fireEvent.press(getByTestId('backButton'))
    })

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: mockSearchState,
      screen: 'Search',
    })
  })
})
