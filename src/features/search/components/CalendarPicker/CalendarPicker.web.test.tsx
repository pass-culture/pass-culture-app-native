import React from 'react'

import { fireEvent, render, screen } from 'tests/utils/web'

import { CalendarPicker } from './CalendarPicker.web'

const mockHideCalendar = jest.fn()
const mockSetSelectedDate = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('CalendarPicker web component', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation()
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

    expect(button).toBeInTheDocument()
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

    expect(button).toBeInTheDocument()
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

    expect(button).toBeInTheDocument()
    expect(mockHideCalendar).toHaveBeenCalledTimes(1)
    expect(mockSetSelectedDate).toHaveBeenCalledTimes(1)
  })
})
