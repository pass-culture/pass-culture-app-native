import RNDateTimePicker from '@react-native-community/datetimepicker'
import React from 'react'
import { View } from 'react-native'

import { useUserProfileInfo } from 'features/home/api'
import { LocationType } from 'features/search/enums'
import { SectionTitle } from 'features/search/sections/titles'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render } from 'tests/utils'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

// @ts-expect-error: solution find on the github repo to the issue https://github.com/react-native-datetimepicker/datetimepicker/issues/216
RNDateTimePicker.mockImplementation((props) => <View testID={props.testID} />)

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
  useCommit: () => ({
    commit: jest.fn(),
  }),
}))

const useUserProfileInfoMock = useUserProfileInfo as jest.Mock

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('SearchFilter component', () => {
  it('should render correctly', () => {
    mockSearchState.locationFilter.locationType = LocationType.AROUND_ME
    const { toJSON } = renderSearchFilter()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not render section Radius if search everywhere or venue selected', () => {
    mockSearchState.locationFilter.locationType = LocationType.EVERYWHERE
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeFalsy()

    mockSearchState.locationFilter.locationType = LocationType.AROUND_ME
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()

    // Address
    mockSearchState.locationFilter.venueId = null
    mockSearchState.locationFilter.locationType = LocationType.PLACE
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()

    // Venue
    mockSearchState.locationFilter.venueId = 24
    mockSearchState.locationFilter.locationType = LocationType.PLACE
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeFalsy()
  })

  it('should not render Duo filter if user not beneficiary', () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({ data: { isBeneficiary: false } }))
    const { queryByTestId } = renderSearchFilter()
    expect(queryByTestId('duoFilter')).toBeNull()
  })
})
