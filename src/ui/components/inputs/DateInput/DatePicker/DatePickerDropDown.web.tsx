import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDesktop } from 'ui/components/inputs/DateInput/atoms/DateInputDesktop.web'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <React.Fragment>
      <DateInputDesktop
        onChange={setDate}
        minimumDate={props.minimumDate}
        defaultSelectedDate={props.defaultSelectedDate}
        accessibilityDescribedBy={birthdateInputErrorId}
        errorMessage={props.errorMessage}
      />
      <InputError
        visible={!!props.errorMessage}
        messageId={props.errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      {!!props.errorMessage && <Spacer.Column numberOfSpaces={6} />}
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}
