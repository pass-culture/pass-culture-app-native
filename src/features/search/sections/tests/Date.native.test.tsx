import React from 'react'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils'

import { Date as DateSection } from '../Date'

let mockSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
const date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: new Date() }

jest.mock('features/search/pages/SearchWrapper', () => ({
  useStagedSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('Date component', () => {
  it('should be controlled by searchState.date', () => {
    let { parent } = render(<DateSection />).getByTestId('Interrupteur')
    expect(parent?.props.accessibilityState.checked).toBeFalsy()

    mockSearchState = { ...initialSearchState, date }
    parent = render(<DateSection />).getByTestId('Interrupteur').parent
    expect(parent?.props.accessibilityState.checked).toBeTruthy()
  })
  it('should dispatch TOGGLE_DATE onPress', () => {
    const { getByTestId } = render(<DateSection />)
    fireEvent.press(getByTestId('Interrupteur'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_DATE' })
  })
})
