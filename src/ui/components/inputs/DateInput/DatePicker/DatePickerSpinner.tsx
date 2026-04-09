import React, { FunctionComponent } from 'react'
import DatePicker from 'react-native-date-picker'
import styled, { DefaultTheme, useTheme } from 'styled-components/native'

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
  const theme = useTheme()

  return (
    <React.Fragment>
      <DateInputDisplay date={date} errorMessage={errorMessage} />
      <InputError visible={!!errorMessage} errorMessage={errorMessage} numberOfSpacesTop={2} />
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
  marginTop: appTheme.designSystem.size.spacing.xl,
}))
