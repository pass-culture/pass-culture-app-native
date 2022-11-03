import React, { useEffect, useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import {
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { pad } from 'libs/parsers'
import { DateInputDisplay } from 'ui/components/inputs/DateInput/atoms/DateInputDisplay'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { InputError } from 'ui/components/inputs/InputError'
import { getSpacing, Spacer } from 'ui/theme'

export function DatePickerSpinner(props: DatePickerProps) {
  const DEFAULT_DATE = {
    day: props.defaultSelectedDate.getDate(),
    month: monthNamesShort[props.defaultSelectedDate.getMonth()],
    year: props.defaultSelectedDate.getFullYear(),
  }
  const [date, setDate] = useState(DEFAULT_DATE)

  const optionGroups = useMemo(() => {
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNamesShort.indexOf(selectedMonth)
    return {
      day: getDatesInMonth(selectedMonthIndex, selectedYear),
      month: monthNamesShort,
      year: getPastYears(props.minimumDate.getFullYear(), DEFAULT_DATE.year),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, monthNamesShort, getYears])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  const dateMonth = monthNamesShort.indexOf(date.month) + 1
  const birthdate = new Date(`${date.year}-${pad(dateMonth)}-${pad(date.day)}`)

  useEffect(() => {
    props.onChange(birthdate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  const birthdateInputErrorId = uuidv4()

  return (
    <React.Fragment>
      <DateInputDisplay date={birthdate} isError={!!props.errorMessage} />
      <InputError
        visible={!!props.errorMessage}
        messageId={props.errorMessage}
        numberOfSpacesTop={2}
        relatedInputId={birthdateInputErrorId}
      />
      <Spacer.Column numberOfSpaces={2} />
      <SpinnerPickerWrapper testID="date-picker-spinner-touch">
        <StyledPicker
          valueGroups={date}
          optionGroups={optionGroups}
          onChange={onDateChange}
          aria-describedby={birthdateInputErrorId}
        />
      </SpinnerPickerWrapper>
    </React.Fragment>
  )
}

// This height will only show 3 rows of the spinner instead of 7
const SMALL_SCREEN_SPINNER_HEIGHT = getSpacing(25)
const StyledPicker = styled(Picker).attrs(({ theme }) => ({
  height: theme.isSmallScreen ? SMALL_SCREEN_SPINNER_HEIGHT : undefined,
}))``

const SpinnerPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))
