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
    let { parent } = render(<DateSection />).getByTestId('Interrupteur filtre dates')
    expect(parent?.props.accessibilityValue.text).toBe('false')

    mockSearchState = { ...initialSearchState, date }
    parent = render(<DateSection />).getByTestId('Interrupteur filtre dates').parent
    expect(parent?.props.accessibilityValue.text).toBe('true')
  })
  it('should dispatch TOGGLE_DATE onPress', () => {
    const { getByTestId } = render(<DateSection />)
    fireEvent.press(getByTestId('Interrupteur filtre dates'))
    expect(mockStagedDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_DATE' })
  })

  it('should have the indicator of the filters in the title', () => {
    mockSearchState = { ...initialSearchState, date: null }
    expect(render(<DateSection />).queryByText('Date')).toBeTruthy()
    expect(render(<DateSection />).queryByText('Date\xa0(1)')).toBeFalsy()
    mockSearchState = { ...initialSearchState, date }
    expect(render(<DateSection />).queryByText('Date\xa0(1)')).toBeTruthy()
  })
})
