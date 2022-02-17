import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInputDesktop.web'
import { DatePickerWebProps } from 'features/auth/signup/SetBirthday/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export function DatePickerDropDown(props: DatePickerWebProps) {
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
      <Spacer.Column numberOfSpaces={2} />
      <DateInputDesktop
        onChange={setDate}
        minimumYear={props.minimumYear}
        defaultSelectedDate={props.defaultSelectedDate}
        aria-describedby={birthdateInputErrorId}
      />
      {!!props.errorMessage && (
        <InputError
          visible
          messageId={props.errorMessage}
          numberOfSpacesTop={2}
          relatedInputId={birthdateInputErrorId}
        />
      )}
      <Spacer.Column numberOfSpaces={props.errorMessage ? 6 : 12} />
    </React.Fragment>
  )
}
