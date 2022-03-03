import React from 'react'
import { useTheme } from 'styled-components/native'

import { DatePickerDropDown } from 'ui/components/inputs/DateInput/DatePicker/DatePickerDropDown'
import { DatePickerSpinner } from 'ui/components/inputs/DateInput/DatePicker/DatePickerSpinner'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'

export function DateInput(props: DatePickerProps) {
  const { isTouch } = useTheme()
  return isTouch ? <DatePickerSpinner {...props} /> : <DatePickerDropDown {...props} />
}
