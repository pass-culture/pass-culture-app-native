import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { Range } from 'libs/typesUtils/typeHelpers'

import { Hour as HourSection } from '../Hour'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()
const timeRange = [3, 20] as Range<number>

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

describe('Hour component', () => {
  it('should be controlled by searchState.timeRange', () => {
    expect(render(<HourSection />).getByTestId('filterSwitch').props.value).toBeFalsy()
    mockSearchState = { ...initialSearchState, timeRange }
    expect(render(<HourSection />).getByTestId('filterSwitch').props.value).toBeTruthy()
  })
  it('should dispatch TOGGLE_HOUR onPress', () => {
    const { getByTestId } = render(<HourSection />)
    getByTestId('filterSwitch').props.onChange({ nativeEvent: { value: true } })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_HOUR' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, timeRange: null }
    expect(render(<HourSection />).queryByText('Heure')).toBeTruthy()
    expect(render(<HourSection />).queryByText('Heure\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, timeRange }
    expect(render(<HourSection />).queryByText('Heure\xa0(1)')).toBeTruthy()
  })
})
