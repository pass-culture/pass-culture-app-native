import { t } from '@lingui/macro'
import React, { useEffect, useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { DateInput } from 'features/auth/signup/SetBirthday/DateInput/DateInput'
import { SignupData } from 'features/auth/signup/types'
import {
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNamesShort,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { analytics } from 'libs/analytics'
import { dateDiffInFullYears } from 'libs/dates'
import { formatDateToISOStringWithoutTime, pad } from 'libs/parsers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InputError } from 'ui/components/inputs/InputError'
import { Spacer } from 'ui/theme'

interface Props {
  accessibilityLabelForNextStep?: string
  goToNextStep: (signupData: Partial<SignupData>) => void
}

const MINIMUM_DATE = 1900
const DEFAULT_YOUNGEST_AGE = 15
const UNDER_YOUNGEST_AGE = DEFAULT_YOUNGEST_AGE - 1

export function DatePickerSpinner(props: Props) {
  const CURRENT_DATE = new Date()
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const DEFAULT_SELECTED_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(DEFAULT_SELECTED_DATE)
  const dateInputErrorId = uuidv4()

  const [date, setDate] = useState({
    day: CURRENT_DATE.getDate(),
    month: monthNamesShort[CURRENT_DATE.getMonth()],
    year: CURRENT_DATE.getFullYear(),
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState(true)

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

  const { data: settings } = useAppSettings()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE

  useEffect(() => {
    const dateMonth = monthNamesShort.indexOf(date.month) + 1
    const selected_date_without_time = `${date.year}-${pad(dateMonth)}-${pad(date.day)}`
    const age = dateDiffInFullYears(new Date(selected_date_without_time), CURRENT_DATE)

    if (selected_date_without_time === DEFAULT_SELECTED_DATE_WITHOUT_TIME) {
      return setIsDisabled(true), setErrorMessage(null)
    }
    if (age < 0) {
      return (
        setIsDisabled(true),
        setErrorMessage(t`Tu ne peux pas choisir une date dans le futur`),
        setIsDisabled(true)
      )
    }
    if (age < 15) {
      return (
        analytics.logSignUpTooYoung(age),
        setIsDisabled(true),
        setErrorMessage(
          t`Tu dois avoir au moins\u00a0${youngestAge}\u00a0ans pour t’inscrire au pass Culture`
        )
      )
    }
    setIsDisabled(false)
    setErrorMessage(null)
  }, [date])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  const dateMonth = monthNamesShort.indexOf(date.month) + 1
  const birthdate = `${date.year}-${pad(dateMonth)}-${pad(date.day)}`

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
