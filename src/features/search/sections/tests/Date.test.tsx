import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'
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
    expect(render(<DateSection />).getByTestId('switchBackground').props.active).toBeFalsy()
    mockSearchState = { ...initialSearchState, date }
    expect(render(<DateSection />).getByTestId('switchBackground').props.active).toBeTruthy()
  })
  it('should dispatch TOGGLE_DATE onPress', () => {
    const { getByTestId } = render(<DateSection />)
    fireEvent.press(getByTestId('filterSwitch'))
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
