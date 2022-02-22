import { t } from '@lingui/macro'
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components/native'

import { DropDown } from 'features/auth/signup/SetBirthday/atoms/DropDown/DropDown'
import { DatePickerProps } from 'features/auth/signup/SetBirthday/DatePicker/types'
import {
  dayNumber,
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNames,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { Spacer } from 'ui/theme'

type InitialDateProps = {
  day?: number
  month?: string
  year?: number
}

const INITIAL_DATE: InitialDateProps = {
  day: undefined,
  month: undefined,
  year: undefined,
}

export function DateInputDesktop(props: DatePickerProps) {
  const [date, setDate] = useState<InitialDateProps>(INITIAL_DATE)

  const optionGroups = useMemo(() => {
    const defaultSelectedYear = props.defaultSelectedDate.getFullYear()
    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        days: dayNumber,
        months: monthNames,
        years: getPastYears(props.minimumDate.getFullYear(), defaultSelectedYear),
      }
    }
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth)
    return {
      days: getDatesInMonth(selectedMonthIndex, selectedYear),
      months: monthNames,
      years: getPastYears(props.minimumDate.getFullYear(), defaultSelectedYear),
    }
  }, [date, monthNames, getYears])

  const onPartialDateChange = (key: keyof InitialDateProps) => (value: string) => {
    setDate((prevDateValues) => ({ ...prevDateValues, [key]: value }))
  }

  const getValidDate = () => {
    if (!date.year || !date.month || !date.day) return

    const dateMonth = monthNames.indexOf(date.month)
    const maybeValidDate = new Date(date.year, dateMonth, date.day)
    return maybeValidDate.getDate() == date.day ? maybeValidDate : undefined
  }

  useEffect(() => {
    props.onChange(getValidDate())
  }, [date])

  return (
    <Container>
      <DropDownContainer>
        <DropDown
          label="Jour"
          placeholder="JJ"
          options={optionGroups.days.map(String)}
          onChange={onPartialDateChange('day')}
          noBorderRadiusRight
          ariaLabel={t`Entrée pour le jour de la date de naissance`}
          isError={!!props.errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Mois"
          placeholder="MM"
          options={optionGroups.months}
          onChange={onPartialDateChange('month')}
          noBorderRadiusRight
          noBorderRadiusLeft
          ariaLabel={t`Entrée pour le mois de la date de naissance`}
          isError={!!props.errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Année"
          placeholder="AAAA"
          options={optionGroups.years.map(String)}
          onChange={onPartialDateChange('year')}
          noBorderRadiusLeft
          ariaLabel={t`Entrée pour l'année de la date de naissance`}
          isError={!!props.errorMessage}
        />
      </DropDownContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const DropDownContainer = styled.View({
  flex: 1,
})
