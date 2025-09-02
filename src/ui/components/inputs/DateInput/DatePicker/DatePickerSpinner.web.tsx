import React, { FunctionComponent, useEffect, useState } from 'react'
import * as ReactMobilePicker from 'react-mobile-picker'
import styled from 'styled-components/native'

import { pad } from 'libs/parsers/formatDates'
import { getDateValuesString } from 'shared/date/getDateValuesString'
import { CAPITALIZED_SHORT_MONTHS } from 'shared/date/months'
import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { useDatePickerOptions } from 'ui/components/inputs/DateInput/hooks/useDatePickerOptions'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing } from 'ui/theme'

export const DatePickerSpinner: FunctionComponent<DatePickerProps> = ({
  date: initialDate,
  maximumDate,
  minimumDate,
  onChange,
  errorMessage,
}) => {
  const defaultDate = getDateValuesString(initialDate)
  const [date, setDate] = useState(defaultDate)

  const { optionGroups } = useDatePickerOptions({
    date,
    maximumYear: maximumDate.getFullYear(),
    minimumYear: minimumDate.getFullYear(),
    monthNamesType: 'short',
  })

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  const dateMonth = CAPITALIZED_SHORT_MONTHS.indexOf(date.month) + 1
  const birthdate = new Date(`${date.year}-${pad(dateMonth)}-${pad(Number(date.day))}`)

  useEffect(() => {
    onChange(birthdate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <React.Fragment>
      <DateInputDisplay date={birthdate} errorMessage={errorMessage} />
      <InputError visible={!!errorMessage} messageId={errorMessage} numberOfSpacesTop={2} />
      <SpinnerPickerWrapper testID="date-picker-spinner-touch">
        <StyledPicker valueGroups={date} optionGroups={optionGroups} onChange={onDateChange} />
      </SpinnerPickerWrapper>
    </React.Fragment>
  )
}

// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)
const StyledPicker = styled(ReactMobilePicker.default)<ReactMobilePicker.ReactMobilePickerProps>(
  ({ theme }) => ({
    height: theme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
  })
)

const SpinnerPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
  marginTop: getSpacing(2),
}))
