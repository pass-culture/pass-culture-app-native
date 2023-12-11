import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'
import * as ReactMobilePicker from 'react-mobile-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { pad } from 'libs/parsers'
import { getDatesInMonth } from 'shared/date/getDatesInMonth'
import { getDateValuesString } from 'shared/date/getDateValuesString'
import { getPastYears } from 'shared/date/getPastYears'
import { monthNamesShort } from 'shared/date/months'
import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

interface PickerProps extends ReactMobilePicker.ReactMobilePickerProps {
  accessibilityDescribedBy?: string
}

const birthdateInputErrorId = uuidv4()

export const DatePickerSpinner: FunctionComponent<DatePickerProps> = ({
  defaultSelectedDate,
  maximumDate,
  minimumDate,
  onChange,
  errorMessage,
}) => {
  const defaultDate = getDateValuesString(defaultSelectedDate)
  const maximumYear = getDateValuesString(maximumDate ?? new Date()).year
  const [date, setDate] = useState(defaultDate)

  const optionGroups = useMemo(() => {
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNamesShort.indexOf(selectedMonth).toString()
    return {
      day: getDatesInMonth(selectedMonthIndex, selectedYear),
      month: monthNamesShort,
      year: getPastYears(minimumDate.getFullYear(), maximumYear),
    }
  }, [date, maximumYear, minimumDate])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  const dateMonth = monthNamesShort.indexOf(date.month) + 1
  const birthdate = new Date(`${date.year}-${pad(dateMonth)}-${pad(Number(date.day))}`)

  useEffect(() => {
    onChange(birthdate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <React.Fragment>
      <DateInputDisplay date={birthdate} isError={!!errorMessage} />
      <InputError
        visible={!!errorMessage}
        messageId={errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={2} />
      <SpinnerPickerWrapper testID="date-picker-spinner-touch">
        <StyledPicker
          valueGroups={date}
          optionGroups={optionGroups}
          onChange={onDateChange}
          accessibilityDescribedBy={birthdateInputErrorId}
        />
      </SpinnerPickerWrapper>
    </React.Fragment>
  )
}

// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)
const StyledPicker = styled(ReactMobilePicker.default)<PickerProps>(({ theme }) => ({
  height: theme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
}))

const SpinnerPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))
