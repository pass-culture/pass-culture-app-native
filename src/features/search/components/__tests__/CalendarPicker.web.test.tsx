import React from 'react'

import { fireEvent, render } from 'tests/utils/web'

import { CalendarPicker } from '../CalendarPicker.web'

const mockHideCalendar = jest.fn()
const mockSetSelectedDate = jest.fn()

describe('CalendarPicker web component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })
  it('should not be visible if visible prop equal false', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible={false}
      />
    )
    const container = getByTestId('calendarPickerContainer')
    expect(container).not.toBeNull()
    expect(container.style.display).toBe('none')
  })

  it('should be visible if visible prop equals true', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible={true}
      />
    )
    const container = getByTestId('calendarPickerContainer')
    expect(container).not.toBeNull()
    expect(container.style.display).not.toBe('none')
  })

  it('should have validation button', () => {
    const { getByTestId } = render(
      <CalendarPicker
        hideCalendar={mockHideCalendar}
        selectedDate={new Date()}
        setSelectedDate={mockSetSelectedDate}
        visible={true}
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
        visible={true}
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
        visible={true}
      />
    )
    const button = getByTestId('validationButton')
    fireEvent.click(button)
    expect(button).not.toBeNull()
    expect(mockHideCalendar).toHaveBeenCalled()
    expect(mockSetSelectedDate).toHaveBeenCalled()
  })
})
