import React, { FunctionComponent } from 'react'
import DatePicker from 'react-native-date-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing } from 'ui/theme'

export const DatePickerSpinner: FunctionComponent<DatePickerProps> = ({
  date,
  onChange,
  errorMessage,
  maximumDate,
  minimumDate,
}) => {
  const birthdateInputErrorId = uuidv4()

  return (
    <React.Fragment>
      <DateInputDisplay date={date} isError={!!errorMessage} />
      <InputError
        visible={!!errorMessage}
        messageId={errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <SpinnerDatePicker
        testID="date-picker-spinner-native"
        date={date}
        onDateChange={onChange}
        mode="date"
        locale="fr-FR"
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        accessibilityDescribedBy={birthdateInputErrorId}
      />
    </React.Fragment>
  )
}
// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)
const SpinnerDatePicker = styled(DatePicker).attrs(({ theme }) => ({
  textColor: theme.designSystem.color.text.default,
}))(({ theme }) => ({
  height: theme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
  width: '100%',
  marginTop: getSpacing(5),
}))
