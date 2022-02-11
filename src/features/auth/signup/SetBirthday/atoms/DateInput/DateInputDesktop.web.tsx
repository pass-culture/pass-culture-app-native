import React, { useMemo, useState, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DropDown } from 'features/auth/signup/SetBirthday/atoms/DropDown/DropDown'
import { MINIMUM_YEAR, UNDER_YOUNGEST_AGE } from 'features/auth/signup/SetBirthday/utils/constants'
import {
  dayNumber,
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNames,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { Spacer } from 'ui/theme'

interface Props {
  onDateChange: (date?: Date) => void
  children?: never
}

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

export const DateInputDesktop: FunctionComponent<Props> = ({ onDateChange }) => {
  const DEFAULT_SELECTED_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - UNDER_YOUNGEST_AGE)
  )
  const [date, setDate] = useState<InitialDateProps>(INITIAL_DATE)

  const optionGroups = useMemo(() => {
    const defaultSelectedYear = DEFAULT_SELECTED_DATE.getFullYear()
    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        days: dayNumber,
        months: monthNames,
        years: getPastYears(MINIMUM_YEAR, defaultSelectedYear),
      }
    }
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth)
    return {
      days: getDatesInMonth(selectedMonthIndex, selectedYear),
      months: monthNames,
      years: getPastYears(MINIMUM_YEAR, defaultSelectedYear),
    }
  }, [date, monthNames, getYears])

  const onPartialDateChange = (key: keyof InitialDateProps) => (value: string) => {
    setDate((prevDateValues) => {
      const newDate = {
        ...prevDateValues,
        [key]: value,
      }

      if (newDate.year && newDate.month && newDate.day) {
        const dateMonth = monthNames.indexOf(newDate.month)
        const maybeValidDate = new Date(newDate.year, dateMonth, newDate.day)
        onDateChange(maybeValidDate.getDate() == newDate.day ? maybeValidDate : undefined)
      } else {
        onDateChange(undefined)
      }

      return newDate
    })
  }

  return (
    <Container>
      <DropDownContainer>
        <DropDown
          label="Jour"
          placeholder="JJ"
          options={optionGroups.days.map(String)}
          onChange={onPartialDateChange('day')}
          noBorderRadiusRight
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
