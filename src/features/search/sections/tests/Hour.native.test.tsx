import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { Range } from 'libs/typesUtils/typeHelpers'
import { fireEvent, render } from 'tests/utils'

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

const testID = 'Interrupteur filtre heures'

describe('Hour component', () => {
  it('should be controlled by searchState.timeRange', () => {
    let { parent } = render(<HourSection />).getByTestId(testID)
    expect(parent?.props.accessibilityValue.text).toBe('false')

    mockSearchState = { ...initialSearchState, timeRange }
    parent = render(<HourSection />).getByTestId(testID).parent
    expect(parent?.props.accessibilityValue.text).toBe('true')
  })

  it('should dispatch TOGGLE_HOUR onPress', () => {
    const { getByTestId } = render(<HourSection />)
    fireEvent.press(getByTestId(testID))
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
