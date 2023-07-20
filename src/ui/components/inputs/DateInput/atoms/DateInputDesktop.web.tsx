import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components/native'

import {
  dayNumbers,
  getDatesInMonth,
  getPastYears,
  getYears,
  monthNames,
} from 'features/bookOffer/components/Calendar/Calendar.utils'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'
import { Spacer } from 'ui/theme'

type InitialDateProps = {
  day?: string
  month?: string
  year?: string
}

const INITIAL_DATE: InitialDateProps = {
  day: undefined,
  month: undefined,
  year: undefined,
}

export function DateInputDesktop(props: DatePickerProps) {
  const [date, setDate] = useState<InitialDateProps>(INITIAL_DATE)

  const optionGroups = useMemo(() => {
    const defaultSelectedYear = props.defaultSelectedDate.getFullYear().toString()
    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        days: dayNumbers,
        months: monthNames,
        years: getPastYears(props.minimumDate.getFullYear(), defaultSelectedYear),
      }
    }
    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth).toString()
    return {
      days: getDatesInMonth(selectedMonthIndex, selectedYear),
      months: monthNames,
      years: getPastYears(props.minimumDate.getFullYear(), defaultSelectedYear),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, monthNames, getYears])

  const onPartialDateChange = (key: keyof InitialDateProps) => (value: string) => {
    setDate((prevDateValues) => ({ ...prevDateValues, [key]: value }))
  }

  const getValidDate = () => {
    if (!date.year || !date.month || !date.day) return

    const dateMonth = monthNames.indexOf(date.month)
    const maybeValidDate = new Date(Number(date.year), dateMonth, Number(date.day))
    return maybeValidDate.getDate() == Number(date.day) ? maybeValidDate : undefined
  }

  useEffect(() => {
    props.onChange(getValidDate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <Container
      testID="date-picker-dropdown"
      accessibilityDescribedBy={props.accessibilityDescribedBy}>
      <DropDownContainer>
        <DropDown
          label="Jour"
          placeholder="JJ"
          options={optionGroups.days}
          onChange={onPartialDateChange('day')}
          noBorderRadiusRight
          accessibilityLabel="Entrée pour le jour de la date de naissance"
          isError={!!props.errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Mois"
          placeholder="Mois"
          options={optionGroups.months}
          onChange={onPartialDateChange('month')}
          noBorderRadiusRight
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour le mois de la date de naissance"
          isError={!!props.errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          label="Année"
          placeholder="AAAA"
          options={optionGroups.years}
          onChange={onPartialDateChange('year')}
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour l’année de la date de naissance"
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
