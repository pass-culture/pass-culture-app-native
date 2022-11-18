import React from 'react'

import { fireEvent, render } from 'tests/utils/web'

import { CalendarPicker } from './CalendarPicker.web'

const mockHideCalendar = jest.fn()
const mockSetSelectedDate = jest.fn()

describe('CalendarPicker web component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should have validation button', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = getByTestId('validationButton')
    expect(button).not.toBeNull()
  })

  it('should validation button close the calendar', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = getByTestId('validationButton')
    fireEvent.click(button)
    expect(button).not.toBeNull()
    expect(mockHideCalendar).toHaveBeenCalled()
  })

  it('should validation button change the date', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = getByTestId('validationButton')
    fireEvent.click(button)
    expect(button).not.toBeNull()
    expect(mockHideCalendar).toHaveBeenCalled()
    expect(mockSetSelectedDate).toHaveBeenCalled()
  })
})
