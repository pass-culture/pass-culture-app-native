import React, { FunctionComponent } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export const DatePickerDropDown: FunctionComponent<DatePickerProps> = ({
  onChange,
  date,
  minimumDate,
  maximumDate,
  defaultSelectedDate,
  previousBirthdateProvided,
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
        previousBirthdateProvided={previousBirthdateProvided}
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
