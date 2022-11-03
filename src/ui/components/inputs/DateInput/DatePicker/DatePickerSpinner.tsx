import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

export function DatePickerSpinner(props: DatePickerProps) {
  const [date, setDate] = useState<Date>(props.defaultSelectedDate)

  const birthdateInputErrorId = uuidv4()

  useEffect(() => {
    props.onChange(date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <React.Fragment>
      <DateInputDisplay date={date} isError={!!props.errorMessage} />
      <InputError
        visible={!!props.errorMessage}
        messageId={props.errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={5} />
      <SpinnerDatePicker
        testID="date-picker-spinner-native"
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

// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)
const SpinnerDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.colors.black,
}))(({ theme }) => ({
  height: theme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
  width: '100%',
}))
