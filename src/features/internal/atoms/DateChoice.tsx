import React from 'react'

import { DatePickerDropDown } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown'

interface Props {
  onChange: (date: Date | undefined) => void
}

export function DateChoice({ onChange }: Props) {
  const [date, setDate] = React.useState<Date | undefined>()
  const onDateChange = (date: Date | undefined) => {
    onChange(date)
    setDate(date)
  }

  const now = new Date()
  return (
    <DatePickerDropDown
      maximumDate={new Date(new Date().setFullYear(now.getFullYear() + 1))}
      minimumDate={now}
      date={date}
      onChange={onDateChange}
    />
  )
}
