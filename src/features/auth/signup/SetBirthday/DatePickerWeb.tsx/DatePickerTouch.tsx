import { t } from '@lingui/macro'
import React, { useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import styled from 'styled-components/native'

import { SignupData } from 'features/auth/signup/types'
import {
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

export function DatePickerTouch(props: Props) {
  const CURRENT_DATE = new Date()

  const [date, setDate] = useState({
    day: CURRENT_DATE.getDate(),
    month: monthNamesShort[CURRENT_DATE.getMonth()],
    year: CURRENT_DATE.getFullYear(),
  })

  const { isDateInvalid, optionGroups } = useMemo(() => {
    const { day: selectedDay, month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNamesShort.indexOf(selectedMonth)
    const currentYear = CURRENT_DATE.getFullYear()
    const currentMonth = CURRENT_DATE.getMonth()
    const currentDay = CURRENT_DATE.getDate()

    let invalid = false
    if (
      selectedDay >= currentDay &&
      currentMonth >= selectedMonthIndex &&
      currentYear === selectedYear
    ) {
      invalid = true
    }
    return {
      isDateInvalid: invalid,
      optionGroups: {
        day: getDatesInMonth(selectedMonthIndex, selectedYear),
        month: monthNamesShort,
        year: getPastYears(1900, currentYear),
      },
    }
  }, [date, monthNamesShort, getYears])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  function goToNextStep() {
    const dateMonth = monthNamesShort.indexOf(date.month) + 1
    const DateWithoutTime = `${date.year}-${dateMonth}-${date.day}`
    if (date) {
      const birthday = DateWithoutTime
      props.goToNextStep({ birthdate: birthday })
    }
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <CalendarPickerWrapper>
        <Picker valueGroups={date} optionGroups={optionGroups} onChange={onDateChange} />
      </CalendarPickerWrapper>
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDateInvalid}
        onPress={goToNextStep}
      />
      <Spacer.Column numberOfSpaces={2} />
    </React.Fragment>
  )
}

const CalendarPickerWrapper = styled.View(({ theme }) => ({
  alignSelf: 'stretch',
  flexDirection: 'row',
  alignItems: 'stretch',
  fontFamily: theme.fontFamily.regular,
  userSelect: 'none',
}))
