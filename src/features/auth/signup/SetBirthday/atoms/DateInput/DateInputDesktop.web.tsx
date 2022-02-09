import React, { useMemo, useState, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DropDown } from 'features/auth/signup/SetBirthday/atoms/DropDown/DropDown'
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

const MINIMUM_DATE = 1900

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
  const CURRENT_DATE = new Date()

  const [date, setDate] = useState<InitialDateProps>(INITIAL_DATE)

  const optionGroups = useMemo(() => {
    const currentYear = CURRENT_DATE.getFullYear()
    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        days: dayNumber,
        months: monthNames,
        years: getPastYears(MINIMUM_DATE, currentYear),
      }
    }
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth)
    return {
      days: getDatesInMonth(selectedMonthIndex, selectedYear),
      months: monthNames,
      years: getPastYears(MINIMUM_DATE, currentYear),
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
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Mois"
          placeholder="MM"
          options={optionGroups.months}
          onChange={onPartialDateChange('month')}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Année"
          placeholder="AAAA"
          options={optionGroups.years.map(String)}
          onChange={onPartialDateChange('year')}
        />
      </DropDownContainer>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  width: '100%',
  zIndex: 1,
})

const DropDownContainer = styled.View({
  flex: 1,
})
