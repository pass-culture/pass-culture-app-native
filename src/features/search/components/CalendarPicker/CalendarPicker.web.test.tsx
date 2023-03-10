import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { CalendarPicker } from './CalendarPicker.web'

const mockHideCalendar = jest.fn()
const mockSetSelectedDate = jest.fn()

describe('CalendarPicker web component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should have validation button', () => {
    render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = screen.getByText('Valider la date')
    expect(button).not.toBeNull()
  })

  it('should validation button close the calendar', () => {
    render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = screen.getByText('Valider la date')
    fireEvent.click(button)
    expect(button).not.toBeNull()
    expect(mockHideCalendar).toHaveBeenCalledTimes(1)
  })

  it('should validation button change the date', () => {
    render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible
      />
    )
    const button = screen.getByText('Valider la date')
    fireEvent.click(button)
    expect(button).not.toBeNull()
    expect(mockHideCalendar).toHaveBeenCalledTimes(1)
    expect(mockSetSelectedDate).toHaveBeenCalledTimes(1)
  })
})
