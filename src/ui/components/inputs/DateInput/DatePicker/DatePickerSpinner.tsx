import React, { FunctionComponent } from 'react'
import DatePicker from 'react-native-date-picker'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

import { DateInputText } from 'ui/components/inputs/DateInput/DateInputText'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { getSpacing } from 'ui/theme'

export const DatePickerSpinner: FunctionComponent<DatePickerProps> = ({
  date,
  onChange,
  errorMessage,
  maximumDate,
  minimumDate,
}) => {
  const theme = useTheme()

  return (
    <React.Fragment>
      <DateInputText
        date={date}
        onChange={onChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        errorMessage={errorMessage}
      />
      {errorMessage ? null : <PlaceholderErrorMessage />}
      <SpinnerDatePicker
        testID="date-picker-spinner-native"
        date={date}
        onDateChange={onChange}
        mode="date"
        locale="fr-FR"
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        theme={theme.colorScheme} // DatePicker requires a theme prop that overrides the styled-component theme
        appTheme={theme}
      />
    </React.Fragment>
  )
}

// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)

const SpinnerDatePicker = styled(DatePicker)<{ appTheme: DefaultTheme }>(({ appTheme }) => ({
  height: appTheme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
}))

const PlaceholderErrorMessage = styled.View(({ theme }) => ({
  height: theme.designSystem.size.spacing.xl,
}))
