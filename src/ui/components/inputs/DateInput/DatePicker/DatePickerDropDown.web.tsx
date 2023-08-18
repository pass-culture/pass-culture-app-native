import React, { FunctionComponent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export const DatePickerDropDown: FunctionComponent<DatePickerProps> = ({
  onChange,
  minimumDate,
  maximumDate,
  defaultSelectedDate,
  errorMessage,
}) => {
  const [date, setDate] = useState<Date | undefined>()

  const birthdateInputErrorId = uuidv4()

  useEffect(() => {
    if (date) {
      onChange(date)
    } else {
      onChange(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <React.Fragment>
      <DateInputDesktop
        onChange={setDate}
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
      {!!errorMessage && <Spacer.Column numberOfSpaces={6} />}
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}
