import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInputDesktop.web'
import { DatePickerProps } from 'features/auth/signup/SetBirthday/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export function DatePickerDropDown(props: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>()

  const birthdateInputErrorId = uuidv4()

  useEffect(() => {
    if (date) {
      props.onChange(date)
    } else {
      props.onChange(undefined)
    }
  }, [date])

  return (
    <React.Fragment>
      <DateInputDesktop
        onChange={setDate}
        minimumDate={props.minimumDate}
        defaultSelectedDate={props.defaultSelectedDate}
        aria-describedby={birthdateInputErrorId}
        errorMessage={props.errorMessage}
      />
      {props.errorMessage ? (
        <InputError
          visible
          messageId={props.errorMessage}
          numberOfSpacesTop={2}
          relatedInputId={birthdateInputErrorId}
        />
      ) : (
        <Spacer.Column numberOfSpaces={6} />
      )}
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}
