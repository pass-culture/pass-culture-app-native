import { t } from '@lingui/macro'
import React, { useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { DateInput } from 'features/auth/signup/SetBirthday/atoms/DateInput/DateInput'
import { useDatePickerErrorHandler } from 'features/auth/signup/SetBirthday/utils/useDatePickerErrorHandler'
import { SignupData } from 'features/auth/signup/types'
import {
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { pad } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

const MINIMUM_DATE = 1900

export function DatePickerSpinner(props: Props) {
  const CURRENT_DATE = new Date()

  const [date, setDate] = useState({
    day: CURRENT_DATE.getDate(),
    month: monthNamesShort[CURRENT_DATE.getMonth()],
    year: CURRENT_DATE.getFullYear(),
  })

  const { optionGroups } = useMemo(() => {
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNamesShort.indexOf(selectedMonth)
    const defaultSelectedYear = DEFAULT_SELECTED_DATE.getFullYear()
    return {
      optionGroups: {
        day: getDatesInMonth(selectedMonthIndex, selectedYear),
        month: monthNamesShort,
        year: getPastYears(MINIMUM_DATE, defaultSelectedYear),
      },
    }
  }, [date, monthNamesShort, getYears])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  const dateMonth = monthNamesShort.indexOf(date.month) + 1
  const birthdate = `${date.year}-${pad(dateMonth)}-${pad(date.day)}`

  const { isDisabled, errorMessage } = useDatePickerErrorHandler(new Date(birthdate))

  function goToNextStep() {
    if (birthdate) {
      props.goToNextStep({ birthdate })
    }
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <DateInput date={new Date(birthdate)} isFocus={!isDisabled} isError={!!errorMessage} />
      {!!errorMessage && (
        <InputError
          visible
          messageId={errorMessage}
          numberOfSpacesTop={2}
          relatedInputId={dateInputErrorId}
        />
      )}
      <Spacer.Column numberOfSpaces={2} />
      <CalendarPickerWrapper>
        <Picker
          valueGroups={date}
          optionGroups={optionGroups}
          onChange={onDateChange}
          aria-describedby={dateInputErrorId}
        />
      </CalendarPickerWrapper>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDisabled}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}

const CalendarPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
}))
