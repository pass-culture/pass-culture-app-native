import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { Range } from 'libs/typesUtils/typeHelpers'

import { Hour as HourSection } from '../Hour'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
const timeRange = [3, 20] as Range<number>

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('Hour component', () => {
  it('should be controlled by searchState.timeRange', () => {
    expect(render(<HourSection />).getByTestId('switchBackground').props.active).toBeFalsy()
    mockSearchState = { ...initialSearchState, timeRange }
    expect(render(<HourSection />).getByTestId('switchBackground').props.active).toBeTruthy()
  })
  it('should dispatch TOGGLE_HOUR onPress', () => {
    const { getByTestId } = render(<HourSection />)
    fireEvent.press(getByTestId('filterSwitch'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_HOUR' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, timeRange: null }
    expect(render(<HourSection />).queryByText('Heure')).toBeTruthy()
    expect(render(<HourSection />).queryByText('Heure\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, timeRange }
    expect(render(<HourSection />).queryByText('Heure\xa0(1)')).toBeTruthy()
  })
})
