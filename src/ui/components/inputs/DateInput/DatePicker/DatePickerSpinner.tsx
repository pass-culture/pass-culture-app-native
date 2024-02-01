import React, { FunctionComponent } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

export const DatePickerSpinner: FunctionComponent<DatePickerProps> = ({
  date,
  onChange,
  defaultSelectedDate,
  errorMessage,
  maximumDate,
  minimumDate,
}) => {
  const birthdateInputErrorId = uuidv4()

  return (
    <React.Fragment>
      <DateInputDisplay date={date || defaultSelectedDate} isError={!!errorMessage} />
      <InputError
        visible={!!errorMessage}
        messageId={errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={5} />
      <SpinnerDatePicker
        testID="date-picker-spinner-native"
        date={date || defaultSelectedDate}
        onDateChange={onChange}
        mode="date"
        locale="fr-FR"
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        androidVariant="nativeAndroid"
        accessibilityDescribedBy={birthdateInputErrorId}
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
