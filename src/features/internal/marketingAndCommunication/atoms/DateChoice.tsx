import React from 'react'

import { DateInput } from 'ui/components/inputs/DateInput/DateInput'

interface Props {
  onChange: (date: Date | undefined) => void
}

export function DateChoice({ onChange }: Props) {
  const [date, setDate] = React.useState<Date>()
  const onDateChange = (date: Date | undefined) => {
    onChange(date)
    setDate(date)
  }
  const now = new Date()
  return (
    <DateInput
      maximumDate={new Date(now.getFullYear() + 100)}
      minimumDate={now}
      defaultSelectedDate={now}
      date={date}
      onChange={onDateChange}
    />
  )
}
