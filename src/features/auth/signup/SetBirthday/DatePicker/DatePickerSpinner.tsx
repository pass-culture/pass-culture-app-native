import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInput } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInput'
import { DatePickerProps } from 'features/auth/signup/SetBirthday/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

export function DatePickerSpinner(props: DatePickerProps) {
  const [date, setDate] = useState<Date>(props.defaultSelectedDate)

  const birthdateInputErrorId = uuidv4()

  useEffect(() => {
    props.onChange(date)
  }, [date])

  return (
    <React.Fragment>
      <DateInput date={date} isError={!!props.errorMessage} />
      {!!props.errorMessage && (
        <InputError
          visible
          messageId={props.errorMessage}
          numberOfSpacesTop={2}
          relatedInputId={birthdateInputErrorId}
        />
      )}
      <Spacer.Column numberOfSpaces={5} />
      <SpinnerDatePicker
        testID="datePicker"
        date={date}
        onDateChange={setDate}
        mode="date"
        locale="fr-FR"
        maximumDate={props.maximumDate}
        minimumDate={props.minimumDate}
        androidVariant="nativeAndroid"
        aria-describedby={birthdateInputErrorId}
      />
    </React.Fragment>
  )
}

const SpinnerDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))({ width: '100%' })
