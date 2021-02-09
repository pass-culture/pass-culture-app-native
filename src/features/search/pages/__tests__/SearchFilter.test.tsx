import RNDateTimePicker from '@react-native-community/datetimepicker'
import { render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { useUserProfileInfo } from 'features/home/api'
import { SectionTitle } from 'features/search/sections/titles'
import { LocationType } from 'libs/algolia'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { initialSearchState } from '../reducer'
import { SearchFilter } from '../SearchFilter'

// @ts-ignore: solution find on the github repo to the issue https://github.com/react-native-datetimepicker/datetimepicker/issues/216
RNDateTimePicker.mockImplementation((props) => <View testID={props.testID} />)

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

const useUserProfileInfoMock = useUserProfileInfo as jest.Mock

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { isBeneficiary: true } })),
}))

const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('SearchFilter component', () => {
  it('should render correctly', () => {
    mockSearchState.locationType = LocationType.AROUND_ME
    const { toJSON } = renderSearchFilter()
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not render section Radius if search everywhere', () => {
    mockSearchState.locationType = LocationType.EVERYWHERE
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeFalsy()
    mockSearchState.locationType = LocationType.AROUND_ME
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()
    mockSearchState.locationType = LocationType.PLACE
    expect(renderSearchFilter().queryByText(SectionTitle.Radius)).toBeTruthy()
  })

  it('should not render Duo filter if user not beneficiary', () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({ data: { isBeneficiary: false } }))
    const { queryByTestId } = renderSearchFilter()
    expect(queryByTestId('duoFilter')).toBeNull()
  })
})
