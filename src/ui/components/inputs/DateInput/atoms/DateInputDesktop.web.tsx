import React, { useMemo, useState, useEffect, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { dayNumbers } from 'shared/date/days'
import { getDatesInMonth } from 'shared/date/getDatesInMonth'
import { getDateValuesString } from 'shared/date/getDateValuesString'
import { getPastYears } from 'shared/date/getPastYears'
import { monthNames } from 'shared/date/months'
import { DatePickerProps } from 'ui/components/inputs/DateInput/DatePicker/types'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'
import { Spacer } from 'ui/theme'

type InitialDateProps = {
  day?: string
  month?: string
  year?: string
}

export const DateInputDesktop: FunctionComponent<DatePickerProps> = ({
  defaultSelectedDate,
  maximumDate,
  minimumDate,
  onChange,
  accessibilityDescribedBy,
  errorMessage,
  previousBirthdateProvided,
}) => {
  const { day, month, year } = getDefaultDateValues(previousBirthdateProvided)

  const [date, setDate] = useState<InitialDateProps>({
    day,
    month,
    year,
  })

  const optionGroups = useMemo(() => {
    const maximumYear = getDateValuesString(maximumDate ?? defaultSelectedDate).year
    const minimumYear = minimumDate.getFullYear()
    const years = getPastYears(minimumYear, maximumYear)

    if (date.year === undefined || date.month === undefined || date.day === undefined) {
      return {
        days: dayNumbers,
        months: monthNames,
        years,
      }
    }

    const { month: selectedMonth, year: selectedYear } = date
    const selectedMonthIndex = monthNames.indexOf(selectedMonth).toString()
    return {
      days: getDatesInMonth(selectedMonthIndex, selectedYear),
      months: monthNames,
      years,
    }
  }, [date, defaultSelectedDate, maximumDate, minimumDate])

  const onPartialDateChange = (key: keyof InitialDateProps) => (value: string) => {
    setDate((prevDateValues) => ({ ...prevDateValues, [key]: value }))
  }

  useEffect(() => {
    onChange(getValidDate(date))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <Container testID="date-picker-dropdown" accessibilityDescribedBy={accessibilityDescribedBy}>
      <DropDownContainer>
        <DropDown
          value={date.day}
          label="Jour"
          placeholder="JJ"
          options={optionGroups.days}
          onChange={onPartialDateChange('day')}
          noBorderRadiusRight
          accessibilityLabel="Entrée pour le jour de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          value={date.month}
          label="Mois"
          placeholder="Mois"
          options={optionGroups.months}
          onChange={onPartialDateChange('month')}
          noBorderRadiusRight
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour le mois de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
      <Spacer.Row numberOfSpaces={2} />
      <DropDownContainer>
        <DropDown
          value={date.year}
          label="Année"
          placeholder="AAAA"
          options={optionGroups.years}
          onChange={onPartialDateChange('year')}
          noBorderRadiusLeft
          accessibilityLabel="Entrée pour l’année de la date de naissance"
          isError={!!errorMessage}
        />
      </DropDownContainer>
    </Container>
  )
}

const getDefaultDateValues = (previousBirthdate?: string): InitialDateProps => {
  if (!previousBirthdate)
    return {
      day: undefined,
      month: undefined,
      year: undefined,
    }

  const birthDate = new Date(previousBirthdate)

  return {
    day: birthDate.getUTCDate().toString(),
    month: monthNames.at(birthDate.getUTCMonth()),
    year: birthDate.getUTCFullYear().toString(),
  }
}

const getValidDate = (date: InitialDateProps) => {
  if (!date.year || !date.month || !date.day) return

  const dateMonth = monthNames.indexOf(date.month)
  const maybeValidDate = new Date(Number(date.year), dateMonth, Number(date.day))
  return maybeValidDate.getDate() == Number(date.day) ? maybeValidDate : undefined
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  width: '100%',
  maxWidth: theme.forms.maxWidth,
}))

const DropDownContainer = styled.View({
  flex: 1,
})
