import { t } from '@lingui/macro'
import React, { useEffect, useMemo, useState } from 'react'
import Picker from 'react-mobile-picker'
import styled from 'styled-components/native'

import { useAppSettings } from 'features/auth/settings'
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

export function DatePickerTouch(props: Props) {
  const CURRENT_DATE = new Date()
  const CURRENT_DATE_WITHOUT_TIME = formatDateToISOStringWithoutTime(CURRENT_DATE)

  const [date, setDate] = useState({
    day: CURRENT_DATE.getDate(),
    month: monthNamesShort[CURRENT_DATE.getMonth()],
    year: CURRENT_DATE.getFullYear(),
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const dateMonth = monthNamesShort.indexOf(date.month) + 1
  const SELECTED_DATE_WITHOUT_TIME = `${date.year}-${pad(dateMonth)}-${pad(date.day)}`

  const isDisabled = SELECTED_DATE_WITHOUT_TIME === CURRENT_DATE_WITHOUT_TIME

  const { optionGroups } = useMemo(() => {
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNamesShort.indexOf(selectedMonth)
    const currentYear = CURRENT_DATE.getFullYear()
    return {
      optionGroups: {
        day: getDatesInMonth(selectedMonthIndex, selectedYear),
        month: monthNamesShort,
        year: getPastYears(MINIMUM_DATE, currentYear),
      },
    }
  }, [date, monthNamesShort, getYears])

  const { data: settings } = useAppSettings()
  const youngestAge = settings?.accountCreationMinimumAge ?? DEFAULT_YOUNGEST_AGE

  useEffect(() => {
    const age = dateDiffInFullYears(new Date(SELECTED_DATE_WITHOUT_TIME), CURRENT_DATE)
    if (isDisabled) {
      return setErrorMessage(null)
    } else if (age < 0) {
      return setErrorMessage(t`Tu ne peux pas choisir une date dans le futur`)
    } else if (age < 15) {
      analytics.logSignUpTooYoung(age)
      return setErrorMessage(
        t`Tu dois avoir au moins\u00a0${youngestAge}\u00a0ans pour t’inscrire au pass Culture`
      )
    }
    return setErrorMessage(null)
  }, [date, isDisabled])

  function onDateChange(name: string, value: number | string) {
    setDate((prevDateValues) => ({ ...prevDateValues, [name]: value }))
  }

  function goToNextStep() {
    if (date) {
      props.goToNextStep({ birthdate: SELECTED_DATE_WITHOUT_TIME })
    }
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={2} />
      <CalendarPickerWrapper>
        <Picker valueGroups={date} optionGroups={optionGroups} onChange={onDateChange} />
      </CalendarPickerWrapper>
      {!!errorMessage && <InputError visible messageId={errorMessage} numberOfSpacesTop={2} />}
      <Spacer.Column numberOfSpaces={2} />
      <ButtonPrimary
        wording={t`Continuer`}
        accessibilityLabel={props.accessibilityLabelForNextStep}
        disabled={isDisabled || !!errorMessage}
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
