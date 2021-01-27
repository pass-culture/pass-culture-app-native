import RNDateTimePicker from '@react-native-community/datetimepicker'
import { render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { useUserProfileInfo } from 'features/home/api'

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

describe('SearchFilter component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<SearchFilter />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should not render Duo filter if user not beneficiary', () => {
    useUserProfileInfoMock.mockImplementationOnce(() => ({ data: { isBeneficiary: false } }))
    const { queryByTestId } = render(<SearchFilter />)
    expect(queryByTestId('duoFilter')).toBeNull()
  })
})
