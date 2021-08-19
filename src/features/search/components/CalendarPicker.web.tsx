import React, { CSSProperties, useState } from 'react'

import { Props } from './CalendarPicker.d'

interface OptionProps {
  label: string
  value: string
}

const Option = ({ label, value }: OptionProps) => <option value={value}>{label}</option>

interface DateTimePickerProps {
  style?: CSSProperties
  value: Date
  onChange: (event: any, newDate: Date | undefined) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: Array<OptionProps>
}

export const DateTimePicker = ({ style, value, onChange, options }: DateTimePickerProps) => (
  <select
    value={value.toISOString()}
    style={style}
    onChange={(event) => onChange(event, new Date(event.target.value))}>
    {options?.map((option: OptionProps) => (
      <Option key={`${option.label}_${option.value}`} {...option} />
    ))}
  </select>
)

export const CalendarPicker: React.FC<Props> = ({
  hideCalendar,
  setSelectedDate,
  selectedDate,
  visible,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate)
  if (!visible) return <React.Fragment />

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (event: any, newDate: Date | undefined) => {
    hideCalendar()
    if (event.type === 'set') {
      setCurrentDate(newDate || currentDate)
      setSelectedDate(newDate || currentDate)
    }
  }

  return (
    <DateTimePicker
      // testID="dateTimePicker"
      value={currentDate}
      // mode="date"
      // is24Hour={true}
      // display="spinner"
      // @ts-ignore FIXME: Types of parameters 'event' and 'event' are incompatible. Type 'Event' is not assignable to type 'AndroidEvent'. Added with PR #1272 when adding Web support
      onChange={onChange}
    />
  )
}
