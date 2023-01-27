import React, { useEffect, useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import { TextInput } from 'react-native'
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

const birthdateInputErrorId = uuidv4()

// This is the normal iso string formatted date length
// Try with `new Date().toISOString().length`
const CORRECT_DATE_LENGTH = 24

export function DatePickerSpinner(props: DatePickerProps) {
  const DEFAULT_DATE = {
    day: props.defaultSelectedDate.getDate(),
    month: monthNamesShort[props.defaultSelectedDate.getMonth()],
    year: props.defaultSelectedDate.getFullYear(),
  }
  const [date, setDate] = useState(DEFAULT_DATE)
  const [hiddenValue, setHiddenValue] = useState(props.defaultSelectedDate.toISOString())

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

  /**
   * During e2e, we set the value thanks to the hidden input.
   * So when a value is typed in the hidden input, the state changes and here we set the date once
   * the value is a correct date.
   */
  useEffect(() => {
    if (hiddenValue.length === CORRECT_DATE_LENGTH) {
      const nextDate = new Date(hiddenValue)

      setDate({
        day: nextDate.getDate(),
        month: monthNamesShort[nextDate.getMonth()],
        year: nextDate.getFullYear(),
      })
    }
  }, [hiddenValue])

  return (
    <React.Fragment>
      <DateInputDisplay date={birthdate} isError={!!props.errorMessage} />
      <HiddenInput
        testID="hidden-input-birthdate"
        value={hiddenValue}
        onChangeText={setHiddenValue}
      />
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
          accessibilityDescribedBy={birthdateInputErrorId}
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

const HiddenInput = styled(TextInput)({
  width: 1,
  height: 1,
})
