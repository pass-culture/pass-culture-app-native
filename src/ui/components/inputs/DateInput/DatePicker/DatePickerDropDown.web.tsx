import React, { FunctionComponent } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export type DatePickerDropDownProps = Omit<DatePickerProps, 'date'> & {
  date?: Date
}

export const DatePickerDropDown: FunctionComponent<DatePickerDropDownProps> = ({
  onChange,
  date,
  minimumDate,
  maximumDate,
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
        accessibilityDescribedBy={birthdateInputErrorId}
        errorMessage={errorMessage}
      />
      <InputError
        visible={!!errorMessage}
        errorMessage={errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={errorMessage ? 10 : 4} />
    </React.Fragment>
  )
}
