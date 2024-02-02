import React, { FunctionComponent } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export type DatePickerDropDownProps = Omit<DatePickerProps, 'date' | 'defaultSelectedDate'> & {
  date?: Date
  defaultSelectedDate?: Date
}

export const DatePickerDropDown: FunctionComponent<DatePickerDropDownProps> = ({
  onChange,
  date,
  minimumDate,
  maximumDate,
  defaultSelectedDate,
  errorMessage,
}) => {
  const birthdateInputErrorId = uuidv4()

  return (
    <React.Fragment>
      <DateInputDesktop
        date={date}
        onChange={onChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        defaultSelectedDate={defaultSelectedDate}
        accessibilityDescribedBy={birthdateInputErrorId}
        errorMessage={errorMessage}
      />
      <InputError
        visible={!!errorMessage}
        messageId={errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={errorMessage ? 10 : 4} />
    </React.Fragment>
  )
}
