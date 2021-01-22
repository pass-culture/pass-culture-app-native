import { fireEvent, render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'
import { DATE_FILTER_OPTIONS } from 'libs/algolia/enums'

import { OfferDate } from '../OfferDate'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()

const Today = new Date(2020, 10, 1)
const Tomorrow = new Date(2020, 10, 2)

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('features/search/components', () => ({
  CalendarPicker: ({ visible }: { visible: boolean }) =>
    visible ? 'CalendarPicker' : 'NoCalendar',
}))

describe('OfferDate component', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })
  it('should render depending if Date is active', () => {
    expect(render(<OfferDate />).queryByTestId('offerDateContainer')).toBeNull()
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    expect(render(<OfferDate />).getByTestId('offerDateContainer')).toBeTruthy()
  })
  it('should dispatch SELECT_DATE_FILTER_OPTION when we choose another offer', () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    const { getByText } = render(<OfferDate />)
    fireEvent.press(getByText('Cette semaine'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.CURRENT_WEEK,
    })

    fireEvent.press(getByText('Ce week-end'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
    })

    fireEvent.press(getByText('Date précise'))
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DATE_FILTER_OPTION',
      payload: DATE_FILTER_OPTIONS.USER_PICK,
    })
  })

  it("shows the calendar when we pick 'Date précise'", () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: Today }
    const { getByText, toJSON } = render(<OfferDate />)

    let component = toJSON()
    if (Array.isArray(component)) {
      expect(component.includes('CalendarPicker')).toBeFalsy()
      expect(component.includes('NoCalendar')).toBeTruthy()
    }

    fireEvent.press(getByText('Date précise'))
    component = toJSON()
    if (Array.isArray(component)) {
      expect(component.includes('CalendarPicker')).toBeTruthy()
      expect(component.includes('NoCalendar')).toBeFalsy()
    }
  })

  it("shows the the correct date when we choose 'Date précise'", () => {
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: Today }
    expect(render(<OfferDate />).getByText('Dimanche 1 novembre 2020')).toBeTruthy()
    mockSearchState.date = { option: DATE_FILTER_OPTIONS.USER_PICK, selectedDate: Tomorrow }
    expect(render(<OfferDate />).getByText('Lundi 2 novembre 2020')).toBeTruthy()
  })
})
