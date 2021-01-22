import DateTimePicker, { AndroidEvent } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'

import { Props } from './CalendarPicker.d'

export const CalendarPicker: React.FC<Props> = ({
  hideCalendar,
  setSelectedDate,
  selectedDate,
  visible,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)
  if (!visible) return <React.Fragment />

  const onChange = (event: AndroidEvent, newDate: Date | undefined) => {
    hideCalendar()
    if (event.type === 'set') {
      setCurrentDate(newDate || currentDate)
      setSelectedDate(newDate || currentDate)
    }
  }

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={currentDate}
      mode="date"
      is24Hour={true}
      display="spinner"
      onChange={onChange}
    />
  )
}
