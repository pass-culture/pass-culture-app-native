import React from 'react'

import { DatePickerDropDown } from 'features/auth/signup/SetBirthday/DatePicker/DatePickerDropDown.web'

interface Props {
  onChange: (date: Date | undefined) => void
}

export function DateChoice(props: Props) {
  const now = new Date()
  return (
    <DatePickerDropDown defaultSelectedDate={now} minimumDate={now} onChange={props.onChange} />
  )
}
